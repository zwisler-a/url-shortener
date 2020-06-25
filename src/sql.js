module.exports = {
  CREATE: `CREATE TABLE IF NOT EXISTS redirects (slug varchar(10) NOT NULL PRIMARY KEY, url varchar(255) NOT NULL )`,
  INSERT: 'INSERT INTO redirects value (?, ?)',
  GET: 'SELECT * FROM redirects WHERE slug = ?',
};
