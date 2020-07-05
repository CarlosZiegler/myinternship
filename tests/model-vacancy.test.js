require('dotenv').config();
const mongoose = require('mongoose');
const DbConnection = require('../configs/db.config');
const Vacancy = require('../models/Vacancy')


let vacancyMockID;

beforeAll(async () => {
  await DbConnection()
});

describe('Testing Model Vacancy', () => {

  test('Creating Vacancy will return new Vacancy', async () => {

    const vacancyMock =
    {
      title: "Front End Junior",
      description: "Work with MERN Stack",
      category: "frontend",
      tags: ["React", "javascript", "node"],
      location: "Berlin",
      companyId: new mongoose.Types.ObjectId(),
      contract: "part time",
      applications: []
    }

    const vacancy = await Vacancy.create(vacancyMock)
    vacancyMockID = vacancy._id
    expect(vacancy).not.toBe(null);
  });

  test('Find Vacancy wit ID will return User', async () => {

    const vacancyMock =
    {
      title: "Front End Junior",
    }
    const vacancy = await Vacancy.findOne(vacancyMock)
    expect(vacancy.title).toBe(vacancyMock.title);
  });

  test('Update Vacancy ', async () => {

    const vacancyUpdateMock =
    {
      location: "Hamburg",

    }

    const result = await Vacancy.updateOne({ _id: vacancyMockID }, vacancyUpdateMock)
    expect(result.nModified).toBe(1);
  });

  test('Find Vacancy with ID and delete Vacancy', async () => {
    const result = await Vacancy.deleteOne({ _id: vacancyMockID })
    expect(result.deletedCount).toBe(1);
  });

});

afterAll(async () => {
  await mongoose.connection.close();
});