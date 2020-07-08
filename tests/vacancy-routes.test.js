const request = require("supertest");
const app = require("../app");
const mongoose = require('mongoose');

let MOCK_VACANCY_ID;

beforeAll(() => {
  MOCK_VACANCY_ID = new mongoose.Types.ObjectId("5f042ce2595af728203548fb")
});
beforeEach(() => {
  jest.setTimeout(4000);

});
const MOCK_VACANCY = {
  _id: MOCK_VACANCY_ID,
  title: "Front End ReactJs",
  description: "Frontend Developer focused in Reactjs",
  category: "frontend",
  tags: ["Reactjs", "Frontend", "Javascript"],
  location: "Berlin",
  contract: "full time"
}
describe("GET / ", () => {
  test("It should respond with an Ok", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });
});
describe("GET /vacancy/create ", () => {
  test("It should respond with an Ok", async () => {
    const response = await request(app).get("/vacancy/create");
    expect(response.statusCode).toBe(302);
  });
});
describe("GET /vacancies", () => {
  test("It should respond with an Ok", async () => {
    const response = await request(app).get("/vacancies");
    expect(response.statusCode).toBe(302);
  });
});
describe("GET /vacancy/details/:id", () => {
  test(`It should respond with not found Vacancy status code`, async () => {
    const unexpectedId = 99;
    const response = await request(app).get(`//vacancy/details/${unexpectedId}`);
    expect(response.statusCode).toBe(404);
  });
});
describe("GET /vacancy/details/:id", () => {
  test(`It should respond with found Vacancy status code`, async () => {
    const unexpectedId = "5f042ce3595af728203548fc";
    const response = await request(app).get(`/vacancy/details/${unexpectedId}`);
    expect(response.statusCode).toBe(302);
  });
});
describe('Post and Delete Endpoints', () => {
  it('should create a new Vacancy', async () => {
    console.log("create", MOCK_VACANCY_ID)
    const res = await request(app)
      .post('/vacancy/create')
      .send(MOCK_VACANCY)
    expect(res.statusCode).toEqual(302)
  })
  // it('should delete a Vacancy', async () => {
  //   console.log("delete", MOCK_VACANCY_ID)
  //   const res = await request(app)
  //     .delete(`/vacancy/delete/${MOCK_VACANCY_ID}`)
  //   expect(res.statusCode).toEqual(302)
  // })
})

afterAll(async () => await mongoose.disconnect());