require('dotenv').config();
const db = require('../../src/db');
const migrations = require('../migrations');

// Order matters.
// Execution order depends on array order.
const migrationNames = [
  'user',
];

const migrationsDirectory = 'schema';

const schemaMigrations = migrations({
  db,
  migrationNames,
  migrationsDirectory,
});

schemaMigrations.run();
