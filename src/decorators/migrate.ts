import {MigrationRegistry, MigrationInfo} from '../migration-registry';
import {DatabaseEngine} from '../database-engine';

export function Migrate(version : string, timestamp : string, databaseEngine : DatabaseEngine) {
    return function (target) {
        MigrationRegistry.instance.addMigration({
            version,
            timestamp,
            databaseEngine,
            migration : target
        });
    }
}