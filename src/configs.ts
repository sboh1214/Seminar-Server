const isTest = process.env.NODE_ENV === 'test'

export const Configs = {
  isTest: isTest,
  port: isTest ? 8000 : 58000,
  database: 'postgres',
  username: 'postgres',
  password: isTest ? 'password' : process.env.PASSWORD,
  host: isTest ? 'localhost' : 'ssal.sparcs.org',
  dbPort: isTest ? 5432 : 55432,
  jwtSecret: isTest ? 'secret' : process.env.SECRET,
  corsOrigin: isTest
    ? 'http://localhost:3000'
    : 'https://sparcs-seminar.sboh.dev',
}

export const Code = {
  Ok: 200,
  Created: 201,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  InternalServerError: 500,
  NotImplemented: 501,
}
