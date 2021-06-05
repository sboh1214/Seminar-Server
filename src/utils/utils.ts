import { sign } from 'jsonwebtoken'
import { Configs } from '../configs'

export function createToken(email: string) {
  const accessToken = sign(
    {
      email: email,
    },
    Configs.jwtSecret,
    { expiresIn: '1h' },
  )
  const refreshToken = sign(
    {
      email: email,
    },
    Configs.jwtSecret,
    { expiresIn: '2week' },
  )
  return { accessToken, refreshToken }
}
