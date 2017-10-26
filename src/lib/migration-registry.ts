import {DatabaseEngine} from './database-engine';

export interface MigrationInfo {
    timestamp : number,
    migration : any,
    databaseEngine : DatabaseEngine,
    version : string
}

export class MigrationRegistry {
    private static _instance : MigrationRegistry;
    private _versions : Map<string, MigrationInfo[]> = new Map<string, MigrationInfo[]>();
    private _migrations : Map<number, MigrationInfo> = new Map<number, MigrationInfo>();
    
    static get instance() {
        if (!MigrationRegistry._instance) {
            MigrationRegistry._instance = new MigrationRegistry();
        }

        return MigrationRegistry._instance;
    }

    get versions() {
        return this._versions;
    }

    get migrations() {
        return this._migrations;
    }

    addMigration(migrationInfo : MigrationInfo) {
        if (this._migrations.has(migrationInfo.timestamp)) {
            let message = `A migration for timestamp ${migrationInfo.timestamp} already exists`;
            throw message;
        }

        this._migrations.set(migrationInfo.timestamp, migrationInfo);
        this.addVersion(migrationInfo.version, migrationInfo);
    }

    private addVersion(version : string, migrationInfo : MigrationInfo) {
        if (!this._versions.has(version)) {
            this._versions.set(version, []);
        }

        let migrations = this._versions.get(version);
        migrations.push(migrationInfo);
        this._versions.set(version, migrations); // Is this necessary?
    }
}