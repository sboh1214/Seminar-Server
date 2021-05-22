import supertest from 'supertest'
import app from '../app'

test("GET /", async () => {
  const res = await supertest(app).get("/").expect(200)
  expect(res.text).toBe("Hello World")
})