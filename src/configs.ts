export const Configs = {
  production: false,
  port: 8000,
  database: 'postgres',
  username: 'postgres',
  password: 'password',
  host: 'localhost',
  jwtSecret: 'secret',
}

export const Code = {
  Ok: 200,
  Created: 201,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  InternalServerError: 500,
  NotImplemented: 501,
}
