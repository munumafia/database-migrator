import {DatabaseEngine} from './database-engine';

export interface MigrationOptions {
    hostname : string,
    port : number,
    database : string,
    versionTable : string,
    databaseServer : DatabaseEngine;
}