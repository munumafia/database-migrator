import {MigrationEngine} from '../bin/migration-engine';
import {MigrationOptions, Connection} from '../bin/migration-options';
import {DatabaseEngine} from '../lib/database-engine';
import {MigrationRegistry} from '../lib/migration-registry';
import {expect} from 'chai';
import 'mocha';

 let migrationEngine : MigrationEngine = null;
 let migrationOptions : MigrationOptions = null;

describe('Migration Engine', () => {
    beforeEach(() => {
        migrationOptions  = {
            connections: [
                {
                    hostname: "localhost",
                    database: "migrationTests",
                    databaseEngine: DatabaseEngine.MongoDB,
                    port: 27017,
                    versionTable: "versions"
                }
            ],
            migrationPaths: [`${__dirname}/migrations/**/*.js`]
        }

        migrationEngine = new MigrationEngine(migrationOptions);
    });
    
    it('should load migrations', async () => {
        await migrationEngine.loadMigrations(migrationOptions.migrationPaths);
        
        // Brittle... need get the number of test migrations in existence at runtime
        expect(MigrationRegistry.instance.migrations.size).to.equal(1); 
    });

    it('should run migrations', async () => {

    });
});