const DbConnection = require('../configs/db.config');

test('Connecting to Db and returning connection true', async () => {
  const connection = await DbConnection()
  expect(connection).toBe(true);
});