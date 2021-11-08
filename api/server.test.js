// Write your tests here

const server = require("./server.js")
const db = require("../data/dbConfig.js")
const supertest = require("supertest")

beforeEach(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

afterAll(async () => {
  await db.destroy()
})

test('sanity', () => {
  expect(true).toBe(true)
})

describe("user tests", () => {

  it("checks if it possible to register a new user", async () => {
    const res = await supertest(server).post("/api/auth/register").send({ username: 'testUser', password: 'testPassword' })
    expect(res.statusCode).toBe(201)
    expect(res.body.id).toBe(1)
    expect(res.body.username).toBe("testUser")
  })

  it("checks if the username is unique", async () => {
    const res = await supertest(server).post("/api/auth/register").send({ username: 'uniqueUsername', password: 'testPassword' })
    expect(res.statusCode).toBe(201)
    expect(res.body.id).toBe(1)
    expect(res.body.username).toBe("uniqueUsername")
    
    const res2 = await supertest(server).post("/api/auth/register").send({ username: 'uniqueUsername', password: 'testPassword' })
    expect(res2.statusCode).toBe(400)
    expect(res2.body.message).toBe("username taken")
  })

  it("checks if the user already exists", 
  
  async () => {
    const res = await supertest(server).post("/api/auth/register").send({ username: 'testUser', password: 'testPassword' })
    expect(res.statusCode).toBe(201)
    expect(res.body.id).toBe(1)
    expect(res.body.username).toBe('testUser')
    
    const res3 = await supertest(server).post("/api/auth/login").send({ username: 'userNotInDb', password: 'testPassword' })
    expect(res3.statusCode).toBe(401)
    expect(res3.body.message).toBe('invalid credentials')

  })

  it("checks if existing user is logged in", 
  
  async () => {
    const res = await supertest(server).post("/api/auth/register").send({ username: 'testUser', password: 'testPassword' })
    expect(res.statusCode).toBe(201)
    expect(res.body.id).toBe(1)
    expect(res.body.username).toBe('testUser')

    const res4 = await supertest(server).post("/api/auth/login").send({ username: 'testUser', password: 'testPassword' })
    expect(res4.statusCode).toBe(200)
    expect(res4.body.message).toBe("welcome, testUser")

  })
})
