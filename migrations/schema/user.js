const userMigration = ({ db }) => {
  return { up };

  async function up() {
    const query = `
      CREATE TABLE IF NOT EXISTS user (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        email CHAR(255) NOT NULL UNIQUE,
        budget DECIMAL(8, 2) NOT NULL DEFAULT 0,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;

    const parameters = [];
    await db.run(query, parameters);
  }
};

module.exports = userMigration;
