const userMigration = ({ db }) => {
  return { up };

  async function up() {
    const query = `
      CREATE TABLE IF NOT EXISTS user (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name CHAR(255) NOT NULL,
        email CHAR(255) NOT NULL UNIQUE,
        password CHAR(255) NOT NULL,
        budget DECIMAL(8, 2) NOT NULL DEFAULT 0,
        deleted_at datetime,
        updated_at datetime
      );
    `;

    const parameters = [];
    await db.run(query, parameters);
  }
};

module.exports = userMigration;
