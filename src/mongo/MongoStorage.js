import { MongoClient } from 'mongodb'
import MongoQueries from './MongoQueries'

class MongoStorage extends MongoQueries {
  constructor (url) {
    super()
    this.url = url
  }

  async init () {
    return new Promise((resolve, reject) => {
      MongoClient.connect(this.url, (err, db) => {
        if (err) return reject(err)

        this.db = db
        resolve()
      })
    })
  }

  async clear () {
    return new Promise((resolve, reject) => {
      this.db.dropDatabase((err, result) => {
        if (err) return reject(err)

        resolve()
      })
    })
  }

  async getDocById (collectionName, docId) {
    let query = {
      _id: docId
    }

    return new Promise((resolve, reject) => {
      this.db
        .collection(collectionName)
        .find(query)
        .limit(1)
        .next((err, doc) => {
          if (err) return reject(err)

          resolve(doc)
        })
    })
  }

  async getDocsByQuery (collectionName, expression) {
    let query = this.normalizeQuery(expression)
    let projection = {}
    let collection = this.db.collection(collectionName)

    return new Promise((resolve, reject) => {
      if (query.$count) {
        collection.count(query.$query || {}, (err, extra) => {
          if (err) return reject(err)
          resolve(extra)
        })
        return
      }

      if (query.$distinct) {
        collection.distinct(query.$field, query.$query || {}, (err, extra) => {
          if (err) return reject(err)
          resolve(extra)
        })
        return
      }

      if (query.$aggregate) {
        collection.aggregate(query.$aggregate, (err, extra) => {
          if (err) return reject(err)
          resolve(extra)
        })
        return
      }

      if (query.$mapReduce) {
        let mapReduceOptions = {
          query: query.$query || {},
          out: {inline: 1},
          scope: query.$scope || {}
        }
        collection.mapReduce(query.$map, query.$reduce, mapReduceOptions, (err, extra) => {
          if (err) return reject(err)
          resolve(extra)
        })
        return
      }

      let cursor = collection.find(query.$query).project(projection)

      if (query.$orderby) cursor = cursor.sort(query.$orderby)
      if (query.$skip) cursor = cursor.skip(query.$skip)
      if (query.$limit) cursor = cursor.limit(query.$limit)

      cursor.toArray((err, docs) => {
        if (err) return reject(err)

        resolve(docs)
      })
    })
  }

  async saveDoc (collectionName, docId, state, prevVersion, version, ops) {
    let query = {
      _id: docId,
      _v: prevVersion
    }

    let update = {
      $set: {
        _ops: ops,
        _v: version
      }
    }

    for (let key in state) {
      update.$set[key] = state[key]
    }

    let options = {
      new: true
    }

    if (!prevVersion) {
      options.upsert = true
    }

    return new Promise((resolve, reject) => {
      this.db
        .collection(collectionName)
        .findAndModify(query, [], update, options, (err, doc) => {
          if (err) {
            // if E11000 duplicate key error on _id field,
            // it means that we inserted two docs with same _id.
            // let's load saved doc from db, merge with current and save again
            if (err.code === 11000 && err.message.indexOf('index: _id_ dup key') !== -1) {
              return reject('stale data')
            }
            return reject(err)
          }

          // if there was no doc with previous version,
          // it means that version changed and our data is stale
          // let's load it, merge with current doc and save one more time
          if (!doc) return reject('stale data')

          resolve()
        })
    })
  }
}

export default MongoStorage
