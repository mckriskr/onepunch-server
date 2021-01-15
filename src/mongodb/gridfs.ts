import mongodb from 'mongodb'

export type ObjectID = mongodb.ObjectID

export const createBucket = (db: mongodb.Db, 
  options?: mongodb.GridFSBucketOptions
) => new mongodb.GridFSBucket(db, options)