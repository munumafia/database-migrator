import {Migrate} from '../../../lib/decorators/migrate';
import {DatabaseEngine} from '../../../lib/database-engine';
import {MongoDbMigrate} from '../../../lib/mongodb-migrate';
import {Db, MongoError} from 'mongodb';

@Migrate("1.0.0", 201710260804, DatabaseEngine.MongoDB)
export class Migration201710260804_AddNewColumn implements MongoDbMigrate {
    migrate(db: Db): Promise<any> {
        return db.collection("documents").update({}, { '$set': {'newColumn': null} });
    }    
}