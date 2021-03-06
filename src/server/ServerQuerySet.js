import eventToPromise from 'event-to-promise'
import ProjectedQuery from './ProjectedQuery'
import ProjectedJoinQuery from './ProjectedJoinQuery'
import ServerJoinQuery from './ServerJoinQuery'
import ServerQuery from './ServerQuery'

class ServerQuerySet {
  constructor (store) {
    this.store = store
    this.data = {}
  }

  async getOrCreateQuery (collectionName, expression) {
    let hash = this.getQueryHash(collectionName, expression)
    let query = this.data[hash]

    if (!query) {
      let isJoinQuery = this.store.dbQueries.isJoinQuery(expression)
      let projection = this.store.projections[collectionName]
      if (projection && !isJoinQuery) {
        query = new ProjectedQuery(collectionName, projection, expression, this.store, this)
      } else if (projection && isJoinQuery) {
        let joinFields = this.store.dbQueries.getJoinFields(expression)
        query = new ProjectedJoinQuery(collectionName, projection, expression, this.store, this, joinFields)
      } else if (isJoinQuery) {
        let joinFields = this.store.dbQueries.getJoinFields(expression)
        query = new ServerJoinQuery(collectionName, expression, this.store, this, joinFields)
      } else {
        query = new ServerQuery(collectionName, expression, this.store, this)
      }

      this.data[hash] = query
    }

    if (query.loaded) return query

    await eventToPromise(query, 'loaded')

    return query
  }

  unattach (collectionName, expression) {
    let hash = this.getQueryHash(collectionName, expression)
    delete this.data[hash]
  }

  channelClose (channel) {
    for (let hash in this.data) {
      let query = this.data[hash]

      query.unsubscribe(channel)
    }
  }

  onOp (op) {
    for (let hash in this.data) {
      let query = this.data[hash]
      if (query.collectionName === op.collectionName ||
        query.projectionCollectionName === op.collectionName) {
        // if query is loading now, we need to load it one more time with new data
        if (query.loading) {
          query.once('loaded', () => {
            query.load()
          })
        } else {
          query.load()
        }
      }
    }
  }

  getQueryHash (collectionName, expression) {
    let args = [collectionName, expression]
    return JSON.stringify(args).replace(/\./g, '|')
  }
}

export default ServerQuerySet
