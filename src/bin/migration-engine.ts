import {MigrationOptions} from './migration-options';
import {MigrationRegistry, MigrationInfo} from '../lib/migration-registry';
import {DatabaseEngine} from '../lib/database-engine';
import {MongoClient} from 'mongodb';
import * as glob from 'glob';

export class MigrationEngine {
    constructor(private options : MigrationOptions) {

    }

    async run(version : string) {
        await this.loadMigrations(this.options.migrationPaths);
        
        const alreadyMigrated : {[details : string] : boolean} = {};
        const versions = MigrationRegistry.instance.versions;
        const currentVersion = versions.get(version);
        const previousVersions = Array.from(versions.keys())
            .filter(entry => entry < version)
            .sort();

        currentVersion
            .filter(entry => !alreadyMigrated[entry.timestamp])
            .sort((a,b) => a.timestamp - b.timestamp)
            .forEach(entry => this.migrate(entry));

        this.migratePreviousVersions(previousVersions, versions, alreadyMigrated);
    }

    loadMigrations(globs : string[]) : Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            for (const entry of globs) {
                glob(entry, {}, (err, files) => {
                    if (err) reject(err);
                    files.forEach(file => require(file));
                    resolve(true);
                });
            }
        });
    }

    private async migrate(migrationInfo : MigrationInfo) {
        // Lack of type safety here, but can't really think of any other way
        // to accomplish this. We also have a potential problem that can occur
        // where the migration specifies an engine type of MongoDB as part of
        // the decorator but implements Neo4JMigrate instead. Might just have
        // to get rid of the concept of these interfaces since they may not
        // add much and just rely on convention instead

        // TODO: Implement transaction support for Neo4J, obviously there's no
        // way to implement transaction support for MongoDB

        if (migrationInfo.databaseEngine === DatabaseEngine.MongoDB) {
            const mongoConfig = this.options
                .connections
                .find(conn => conn.databaseEngine === DatabaseEngine.MongoDB);

            if (!mongoConfig) {
                // TODO: Better error message
                const error = 'Found migration for MongoDB but no connection string was supplied as part of configuration';
                throw error;
            }
            
            const connString = `mongodb://${mongoConfig.hostname}:${mongoConfig.port}/${mongoConfig.database}`; 
            const db = await MongoClient.connect(connString);
            const migration = new migrationInfo.migration();

            if (!migration.migrate) {
                // TODO: More in depth type checking and displaying of migration name
                const error = "MongoDB migration doesn't have migrate() method";
                throw error;
            }

            // We probably need to use the Adapter pattern here to where migrations
            // can only use the promise based interface so we can disallow the migration
            // using the callback based API

            // TODO: Find some way to determine if the migration encountered an error
            await migration.migrate(db);
        }
    }

    private migratePreviousVersions(previousVersions : string[], versions : Map<string, MigrationInfo[]>,
        alreadyMigrated : {[details : string] : boolean}) {
                
        previousVersions.forEach(version => {
            versions.get(version)
                .filter(info => !alreadyMigrated[info.timestamp])
                .sort((a,b) => a.timestamp - b.timestamp)
                .forEach(info => this.migrate(info));            
        });
    }
}