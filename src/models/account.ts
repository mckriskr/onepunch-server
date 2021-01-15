import mongoose from 'mongoose'
import type {Model} from 'mongoose'
var Schema = mongoose.Schema
import passportLocal from 'passport-local'
import passportLocalMongoose from 'passport-local-mongoose'
/*
export interface AuthenticationResult {
  user: any
  error: any
}
interface AuthenticateMethod<T> {
  (username: string, password: string): Promise<AuthenticationResult>
  (
    username: string,
    password: string,
    cb: (err: any, user: T | boolean, error: any) => void
  ): void
}
interface PassportLocalModel<T> {
  authenticate(): AuthenticateMethod<T>
  serializeUser(): (
    user: PassportLocalModel<T>,
    cb: (err: any, id?: any) => void
  ) => void
  deserializeUser(): (
    username: string,
    cb: (err: any, user?: any) => void
  ) => void

  register(user: T, password: string): Promise<T>
  register(
    user: T,
    password: string,
    cb: (err: any, account: any) => void
  ): void
  findByUsername(username: string, selectHashSaltFields: boolean): Query<T>
  findByUsername(
    username: string,
    selectHashSaltFields: boolean,
    cb: (err: any, account: any) => void
  ): any
  createStrategy(): passportLocal.Strategy
}
*/
const Account = new Schema({
  username: String,
  password: String
})

Account.plugin(passportLocalMongoose)

export default mongoose.model('Account', Account)
