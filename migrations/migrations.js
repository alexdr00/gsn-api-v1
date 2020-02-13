/* eslint-disable */
const logger = require('../src/lib/logger');

const migrations = ({ db, migrationNames, migrationsDirectory }) => {
  return { run };

  async function run() {
    await init();

    const migrationProcesses = migrationNames.map((migrationName) => {
      const migrationIdentifier = `${migrationsDirectory}-${migrationName}`;

      return () => new Promise(async (resolve, reject) => {
        const hasMigrationBeenExecuted = await checkMigrationHasBeenExecuted(migrationIdentifier);
        if (hasMigrationBeenExecuted) {
          resolve();
        }

        const migrationPath = `./${migrationsDirectory}/${migrationName}`;

        try {
          await executeMigration(migrationPath);
          await markMigrationAsExecuted(migrationIdentifier);
          logger.info(`${migrationIdentifier} has been executed successfully.`);

          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });

    for (const migrationProcess of migrationProcesses) {
      await migrationProcess();
    }

    logger.info(`All scripts in "${migrationsDirectory}" have been executed successfully.`);
    process.exit(0);
  }

  async function init() {
    const query = `
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        migration_name VARCHAR(50),
        executed_on DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const parameters = [];
    try {
      await db.run(query, parameters);
    } catch (error) {
      logger.error(error);
      process.exit(1);
    }
  }

  async function executeMigration(migrationPath) {
    try {
      const migration = require(migrationPath)({ db });
      await migration.up();
    } catch (error) {
      logger.error(`Failed to run: ${migrationPath}`);
      logger.error(error);
      process.exit(1);
    }
  }

  async function markMigrationAsExecuted(migrationIdentifier) {
    const query = `
      INSERT INTO migrations (migration_name)
      VALUES (?);
    `;

    const parameters = [migrationIdentifier];
    try {
      await db.run(query, parameters);
    } catch (error) {
      logger.error(`Failed to mark as executed: ${migrationIdentifier}`);
      logger.error(error);
      process.exit(1);
    }
  }

  async function checkMigrationHasBeenExecuted(migrationIdentifier) {
    const query = `
      SELECT '_' FROM migrations WHERE migration_name = ?
    `;

    const parameters = [migrationIdentifier];

    try {
      const result = await db.run(query, parameters);
      return result.length > 0;
    } catch (error) {
      logger.error(error);
      process.exit(1);
      return null;
    }
  }
};

module.exports = migrations;
