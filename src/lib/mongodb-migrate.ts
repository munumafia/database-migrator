import {Db} from 'mongodb';

export interface MongoDbMigrate {
    // TODO: Determine what values can be in the promise
    migrate(db : Db) : Promise<any>;    
}