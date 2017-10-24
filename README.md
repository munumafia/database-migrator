# Database Migrator

This is a project that allows you to define migrations for multiple database engines
and then tie these migrations to a certain version. The idea is that for applications
that use polyglot data that you can define all migrations within a single Node package,
then migrate to a particular version from the command line across all database engines
used by the application. Each migration that has been added will run in order based on
its timestamp, and any migrations for previous versions than the one being migrated to
will be ran as needed.

## Usage

```typescript
import {DatabaseEngine, Migrate, MongoDbMigrate, Neo4JMigrate} from 'database-migrator';
import {Db} from 'mongodb';
import {Session} from 'neo4j-driver';

@Migrate("1.0.0", "201710241151", DatabaseEngine.MongoDB)
export class Migration201710241151_AddPropertyToDocument implements MongoDbMigrate {
    migrate(mongodb : Db) {
        mongodb.collections("documents").update({
            "$set": {
                "property": null
            }
        });
    }
}

@Migrate("1.0.0", "201710241222", DatabaseEngine.Neo4J)
export class Migration201710241222_AddPropertyToDocument implements Neo4JMigrate {
    async migrate(session : Session) {
        await session.run(
            `MATCH (d:Document)
            SET d.property = null
            RETURN d`
        );
    }
}
```

## Adding new migrations
There will be a global command installed named `database-migrator` that you will be able to
use to generate new migrations. Basic usage is as follows:

`database-generator --add-migration --database-engine=mongodb --version=1.0.0 --name=AddProperty --output=src/migrations`