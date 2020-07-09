require('dotenv').config();
const mongoose = require('mongoose');
const DbConnection = require('../configs/db.config');
const User = require('../models/User')


let userMockID;


beforeAll(async () => {
  await DbConnection()
});

describe('Testing Model User', () => {

  test('Creating user will return new User', async () => {

    const userMock =
    {
      username: "Carlos Ziegler",
      password: "123123",
      email: "car@example",
      githubId: "1233ewwe11212",
      googleId: "fgfgfgffgssd",
      role: "professional",
      avatarUrl: "https://localhost/images/",
      vacancies: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()]
    }

    const user = await User.create(userMock)
    userMockID = user._id
    expect(user).not.toBe(null);
  });

  test('Find user wit ID will return User', async () => {

    const userMock =
    {
      username: "Carlos Ziegler",
    }
    const user = await User.findOne(userMock)
    expect(user._id).not.toBe(userMockID);
  });

  test('Update user ', async () => {

    const userUpdateMock =
    {
      username: "Carlos Ziegler",
      password: "22222222",
      email: "carlos.ziegler@example.com",
      role: "company",
      avatarUrl: "https://localhost/images/"
    }


    const result = await User.updateOne({ _id: userMockID }, userUpdateMock)
    expect(result.nModified).toBe(1);
  });

  test('Find user with ID and delete User', async () => {
    const result = await User.deleteOne({ _id: userMockID })
    expect(result.deletedCount).toBe(1);
  });

});

afterAll(async () => {
  await mongoose.connection.close();
});