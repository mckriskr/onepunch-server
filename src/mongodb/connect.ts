import mongodb from 'mongodb'

export type MongoClient = mongodb.MongoClient
export type Db = mongodb.Db

export const connect = (mongoUrl: string = 'mongodb://localhost:27017') =>
  mongodb.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
