import {v1} from 'neo4j-driver';

export interface Neo4jMigrate {
    // TODO: Figure out what we'll actually return 
    migrate(session : v1.Session) : Promise<any>; 
}