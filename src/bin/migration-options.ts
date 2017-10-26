import {DatabaseEngine} from '../lib/database-engine';

export interface Connection {
    hostname : string,
    port : number,
    database : string,
    versionTable : string,
    databaseEngine : DatabaseEngine
}

export interface MigrationOptions {
    connections : Connection[],
    migrationPaths : string[]
}