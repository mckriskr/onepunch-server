import jwt, { SignOptions, Secret, VerifyOptions, VerifyErrors} from 'jsonwebtoken'

const secret = 'secret'

export const jwtSign = (
  payload: string | Buffer | object,
  options: SignOptions = {}
) => new Promise<string>((resolve, reject) => {
    jwt.sign(payload, secret, options, (err?: any, signingKey?: Secret) => {
      if (err) reject(err)
      else resolve(signingKey as string)
    })
  })

export const jwtVerify = (token: string, options: VerifyOptions = {}) =>
  new Promise<object>((resolve, reject) => {
    jwt.verify(token, secret, options, 
      (err: VerifyErrors | null, decoded: object | undefined) => {
        if (err) reject(err)
        else if(decoded) {
          resolve(decoded)
        }
      }
    )
  })

  export const jwtTest = () => {
    jwtSign({password: '1234'}, {expiresIn: '1s'})
    .then((signingKey: string) => {
      console.log('signingKey', signingKey)
      setTimeout(() => {
        jwtVerify(signingKey)
          .then((decoded: object) => console.log('decode', decoded))
          .catch((err) => console.log('err', err.message))
      }, 2000)
    })
    .catch((err: Error) => console.log('err', err.message))
  }