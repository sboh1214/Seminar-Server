import e from 'express'
import { sign } from 'jsonwebtoken'
import { Configs } from '../configs'

type TokenSet = {
  accessToken: string
  refreshToken: string
}

export function createToken(email: string): TokenSet {
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

export function setCookies(res: e.Response, tokenSet: TokenSet) {
  res
    .cookie('accessToken', tokenSet.accessToken, {
      maxAge: 1000 * 3600,
      signed: true,
      httpOnly: true,
      sameSite: 'none',
    })
    .cookie('refreshToken', tokenSet.refreshToken, {
      maxAge: 1000 * 3600 * 24 * 14,
      signed: true,
      httpOnly: true,
      sameSite: 'none',
    })
}
