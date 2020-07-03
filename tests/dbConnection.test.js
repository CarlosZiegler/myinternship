require('dotenv').config();
const mongoose = require('mongoose');
const DbConnection = require('../configs/db.config');


describe('Testing DB', () => {
  test('Connecting to Db and returning connection true', async () => {
    const connection = await DbConnection()
    expect(connection).toBe(true);
  });
});
afterAll(async () => {

  await mongoose.connection.close();
});