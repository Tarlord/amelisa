let debug = require('debug')('Store');
import ChannelSession from './ChannelSession';
import Projection from './Projection';
import ServerDocSet from './ServerDocSet';
import ServerQuerySet from './ServerQuerySet';
import ServerChannel from './ServerChannel';
import Model from './Model';
import util from './util';

class Store {
  constructor(storage, redis, pubsub, options = {}) {
    this.storage = storage;
    this.redis = redis;
    this.pubsub = pubsub;
    this.name = 'server1';
    this.docSet = new ServerDocSet(this, storage);
    this.querySet = new ServerQuerySet(this, storage);
    this.clients = [];
    this.projections = {};
    this.sentOps = {};

    pubsub.on('message', this.onPubSubOp.bind(this));

    if (options.projections) {
      for (let collectionName in options.projections) {
        let projectionOptions = options.projections[collectionName];
        let projection = new Projection(collectionName,
          projectionOptions.collectionName, projectionOptions.fields);
        this.projections[collectionName] = projection;
      }
    }
  }

  createModel() {
    let channel = new ServerChannel();
    let channel2 = new ServerChannel();
    channel.pipe(channel2).pipe(channel);
    let model = new Model(channel, this.name);

    this.client(channel2);
    model.online = true;

    return model;
  }

  client(channel) {
    debug('client');
    channel._session = new ChannelSession();
    this.clients.push(channel);

    channel.on('message', (message) => {
      //debug('message', message);
      this.validateMessage(message, channel);
    });

    channel.on('close', () => {
      debug('close');
      util.arrayRemove(this.clients, channel);
      this.docSet.channelClose(channel);
      this.querySet.channelClose(channel);
    });

    channel.on('error', (err) => {
      debug('error', err);
    });
  }

  validateMessage(message, channel) {
    if (this.hook) {
      let { req, isServer } = channel;
      let session = req ? req.session : undefined;
      let params = {
        isServer: isServer
      }
      this.hook(message, session, params, (err) => {
        if (err) {
          let op = {
            id: message.id,
            type: 'ack',
            collectionName: message.collectionName,
            docId: message.docId,
            error: err
          }
          this.sendOp(op, channel);
        } else {
          this.onMessage(message, channel);
        }
      });
    } else {
      this.onMessage(message, channel);
    }
  }

  onMessage(message, channel) {
    let { type, id, collectionName, docId, expression, version } = message;
    let doc;
    let query;
    let op;
    let projection = this.projections[collectionName];

    debug(type, id, collectionName, docId, expression);

    switch (type) {
      case 'date':
        this.sendOp({
          id: id,
          type: 'ackdate',
          value: Date.now()
        }, channel);
        break;

      case 'fetch':
        this.docSet
          .getOrCreateDoc(collectionName, docId)
          .then((doc) => {
            doc.fetch(channel, id);
          });
        break;

      case 'qfetch':
        this.querySet
          .getOrCreateQuery(collectionName, expression)
          .then((query) => {
            query.fetch(channel, id);
          });
        break;

      case 'sub':
        this.docSet
          .getOrCreateDoc(collectionName, docId)
          .then((doc) => {
            doc.subscribe(channel, version);
          });
        break;

      case 'unsub':
        this.docSet
          .getOrCreateDoc(collectionName, docId)
          .then((doc) => {
            doc.unsubscribe(channel);
          });
        break;

      case 'qsub':
        this.querySet
          .getOrCreateQuery(collectionName, expression)
          .then((query) => {
            query.subscribe(channel);
          });
        break;

      case 'qunsub':
        this.querySet
          .getOrCreateQuery(collectionName, expression)
          .then((query) => {
            query.unsubscribe(channel);
          });
        break;

      case 'qsync':
        this.querySet
          .getOrCreateQuery(collectionName, expression)
          .then((query) => {
            query.sync(channel);
          });
        break;

      case 'sync':
        this.docSet
          .getOrCreateDoc(collectionName, docId)
          .then((doc) => {
            doc.sync(channel, version, value);
          });
        break;

      case 'add':
      case 'set':
      case 'del':
        this.docSet
          .getOrCreateDoc(collectionName, docId)
          .then((doc) => {
            doc.onOp(message, channel);

            // FIXME: remove listener if reject
            doc.once('saved', () => {
              op = {
                id: id,
                type: 'ack'
              }
              this.sendOp(op, channel);
              this.querySet.onOp(message);
              this.docSet.onOp(message);
              this.sentOps[message.id] = true;
              this.redis.send(message);
            });
          });
        break;

      default:
    }
  }

  onPubSubOp(op) {
    if (this.sentOps[op.id]) {
      delete this.sentOps[op.id];
      return;
    }
    this.querySet.onOp(op);
    this.docSet.onOp(op);
  }

  sendOp(op, channel) {
    // debug('sendOp', op.type);

    channel.send(op);
  }

  modelMiddleware() {
    let store = this;
    function modelMiddleware(req, res, next) {
      let requestTimeout = req.socket.server.timeout;
      let model;

      function getModel() {
        if (model) return model;
        model = store.createModel({fetchOnly: true}, req);
        return model;
      }
      req.getModel = getModel;

      function closeModel() {
        req.getModel = () => {};
        res.removeListener('finish', closeModel);
        res.removeListener('close', closeModel);
        model && model.close();
        model = null;
      }
      function closeModelAfterTimeout() {
        setTimeout(closeModel, requestTimeout);
      }
      res.on('finish', closeModel);
      res.on('close', closeModelAfterTimeout);

      next();
    }
    return modelMiddleware;
  }
}

export default Store;