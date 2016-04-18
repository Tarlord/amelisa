'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _events = require('events');

var _eventToPromise = require('event-to-promise');

var _eventToPromise2 = _interopRequireDefault(_eventToPromise);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _ChannelSession = require('./ChannelSession');

var _ChannelSession2 = _interopRequireDefault(_ChannelSession);

var _Projection = require('./Projection');

var _Projection2 = _interopRequireDefault(_Projection);

var _ServerDocSet = require('./ServerDocSet');

var _ServerDocSet2 = _interopRequireDefault(_ServerDocSet);

var _ServerQuerySet = require('./ServerQuerySet');

var _ServerQuerySet2 = _interopRequireDefault(_ServerQuerySet);

var _ServerChannel = require('./ServerChannel');

var _ServerChannel2 = _interopRequireDefault(_ServerChannel);

var _ServerSocketChannel = require('./ServerSocketChannel');

var _ServerSocketChannel2 = _interopRequireDefault(_ServerSocketChannel);

var _Model = require('../client/Model');

var _Model2 = _interopRequireDefault(_Model);

var _util = require('../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultOptions = {
  collections: {},
  projections: {},
  source: 'server',
  unattachTimeout: 5000,
  saveDebounceTimeout: 100,
  cuttingOpsCount: 100,
  cuttingTimeout: 2000,
  saveOps: true
};

var Store = function (_EventEmitter) {
  (0, _inherits3.default)(Store, _EventEmitter);

  function Store() {
    var _this2 = this;

    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    (0, _classCallCheck3.default)(this, Store);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Store).call(this));

    _this.onConnection = function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(socket) {
        var channel, _this$getHookParams, session, params;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                channel = new _ServerSocketChannel2.default(socket, socket.upgradeReq);

                if (!_this.clientHook) {
                  _context.next = 14;
                  break;
                }

                _this$getHookParams = _this.getHookParams(channel);
                session = _this$getHookParams.session;
                params = _this$getHookParams.params;
                _context.prev = 5;
                _context.next = 8;
                return _this.clientHook(channel, session, params);

              case 8:
                _context.next = 14;
                break;

              case 10:
                _context.prev = 10;
                _context.t0 = _context['catch'](5);

                console.trace('clientHook error', _context.t0);
                return _context.abrupt('return');

              case 14:

                _this.onChannel(channel);

              case 15:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this2, [[5, 10]]);
      }));
      return function (_x2) {
        return ref.apply(this, arguments);
      };
    }();

    _this.onChannel = function (channel) {
      channel._session = new _ChannelSession2.default();
      _this.clients.push(channel);

      channel.on('message', function (message) {
        _this.onMessage(message, channel).catch(function (err) {
          var id = message.id;
          var collectionName = message.collectionName;
          var docId = message.docId;

          var op = {
            ackId: id,
            collectionName: collectionName,
            docId: docId,
            error: 'Internal Error'
          };
          _this.sendOp(op, channel);

          console.trace('onMessage error', err);
        });
      });

      channel.on('close', function () {
        (0, _util.arrayRemove)(_this.clients, channel);
        _this.docSet.channelClose(channel);
        _this.querySet.channelClose(channel);
      });

      channel.on('error', function (err) {
        console.trace('channel error', err);
      });

      _this.emit('channel', channel);
    };

    var storage = options.storage;
    var opsStorage = options.opsStorage;
    var pubsub = options.pubsub;

    (0, _invariant2.default)(storage, 'Store.constructor storage is required for creating store');
    _this.storage = storage;
    _this.opsStorage = storage || opsStorage;
    _this.pubsub = pubsub;
    _this.dbQueries = storage.getDbQueries();
    _this.options = (0, _assign2.default)({}, defaultOptions, options);
    _this.docSet = new _ServerDocSet2.default(_this);
    _this.querySet = new _ServerQuerySet2.default(_this);
    _this.clients = [];
    _this.projections = {};
    _this.clientCollectionNames = [];
    _this.projectionHashes = {};
    _this.sentOps = {};

    if (pubsub) pubsub.on('message', _this.onPubsubOp.bind(_this));

    for (var collectionName in _this.options.collections) {
      var collectionOptions = _this.options.collections[collectionName];
      if (collectionOptions.client) _this.clientCollectionNames.push(collectionName);
    }

    for (var _collectionName in _this.options.projections) {
      var projectionOptions = _this.options.projections[_collectionName];
      var projection = new _Projection2.default(_collectionName, projectionOptions.collectionName, projectionOptions.fields);
      _this.projections[_collectionName] = projection;
      _this.projectionHashes[_collectionName] = projection.getHash();
    }
    return _this;
  }

  (0, _createClass3.default)(Store, [{
    key: 'init',
    value: function init() {
      return _promise2.default.all([this.storage.init(), this.pubsub ? this.pubsub.init() : _promise2.default.resolve()]);
    }
  }, {
    key: 'createModel',
    value: function createModel(options) {
      var channel = new _ServerChannel2.default();
      var channel2 = new _ServerChannel2.default();
      channel.pipe(channel2).pipe(channel);
      options = (0, _assign2.default)({}, this.options, options);
      var model = new _Model2.default(channel, options, this.dbQueries, this.projectionHashes);
      model.server = true;

      this.onChannel(channel2);
      channel.open();

      return model;
    }
  }, {
    key: 'connectModel',
    value: function connectModel(model) {
      var channel = model.channel;

      var channel2 = new _ServerChannel2.default();
      channel.pipe(channel2).pipe(channel);

      this.onChannel(channel2);
      channel.open();
    }
  }, {
    key: 'onDocOps',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(ackId, collectionName, docId, field, newOps, channel, opsType, index, howMany) {
        var doc, ops, prevs, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _op2, valid, _prev, op, i, _op, prev;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.docSet.getOrCreateDoc(collectionName, docId);

              case 2:
                doc = _context2.sent;
                ops = [];
                prevs = [];
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context2.prev = 8;
                _iterator = (0, _getIterator3.default)(newOps);

              case 10:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context2.next = 24;
                  break;
                }

                _op2 = _step.value;
                _context2.next = 14;
                return this.validateOp(_op2, channel);

              case 14:
                valid = _context2.sent;

                if (valid) {
                  _context2.next = 17;
                  break;
                }

                return _context2.abrupt('continue', 21);

              case 17:

                doc.onOpsOp(_op2, channel);
                ops.push(_op2);
                _prev = this.getPrev(_op2, doc);

                prevs.push(_prev);

              case 21:
                _iteratorNormalCompletion = true;
                _context2.next = 10;
                break;

              case 24:
                _context2.next = 30;
                break;

              case 26:
                _context2.prev = 26;
                _context2.t0 = _context2['catch'](8);
                _didIteratorError = true;
                _iteratorError = _context2.t0;

              case 30:
                _context2.prev = 30;
                _context2.prev = 31;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 33:
                _context2.prev = 33;

                if (!_didIteratorError) {
                  _context2.next = 36;
                  break;
                }

                throw _iteratorError;

              case 36:
                return _context2.finish(33);

              case 37:
                return _context2.finish(30);

              case 38:
                op = {
                  id: _Model2.default.prototype.id(),
                  type: 'ops',
                  collectionName: collectionName,
                  docId: docId,
                  ops: ops,
                  opsType: opsType,
                  index: index,
                  howMany: howMany
                };

                if (field) op.field = field;

                doc.broadcastOp(op, channel);

                doc.save();

                _context2.next = 44;
                return (0, _eventToPromise2.default)(doc, 'saved');

              case 44:

                if (ackId) this.sendAckOp(ackId, channel);
                this.onOp(op);

                for (i = 0; i < ops.length; i++) {
                  _op = ops[i];
                  prev = prevs[i];

                  this.afterOp(_op, channel, prev);
                }

                return _context2.abrupt('return', doc);

              case 48:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[8, 26, 30, 38], [31,, 33, 37]]);
      }));

      function onDocOps(_x3, _x4, _x5, _x6, _x7, _x8, _x9, _x10, _x11) {
        return ref.apply(this, arguments);
      }

      return onDocOps;
    }()
  }, {
    key: 'validateOp',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(op, channel) {
        var id, collectionName, docId, _getHookParams, session, params, _op3;

        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                id = op.id;
                collectionName = op.collectionName;
                docId = op.docId;

                if (!this.preHook) {
                  _context3.next = 18;
                  break;
                }

                _getHookParams = this.getHookParams(channel);
                session = _getHookParams.session;
                params = _getHookParams.params;
                _context3.prev = 7;
                _context3.next = 10;
                return this.preHook(op, session, params);

              case 10:
                return _context3.abrupt('return', true);

              case 13:
                _context3.prev = 13;
                _context3.t0 = _context3['catch'](7);
                _op3 = {
                  ackId: id,
                  collectionName: collectionName,
                  docId: docId,
                  error: _context3.t0 && _context3.t0.message
                };

                this.sendOp(_op3, channel);
                return _context3.abrupt('return', false);

              case 18:
                return _context3.abrupt('return', true);

              case 19:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[7, 13]]);
      }));

      function validateOp(_x12, _x13) {
        return ref.apply(this, arguments);
      }

      return validateOp;
    }()
  }, {
    key: 'afterOp',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(op, channel, prev) {
        var _getHookParams2, session, params;

        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _getHookParams2 = this.getHookParams(channel, prev);
                session = _getHookParams2.session;
                params = _getHookParams2.params;

                if (!this.afterHook) {
                  _context4.next = 12;
                  break;
                }

                _context4.prev = 4;
                _context4.next = 7;
                return this.afterHook(op, session, params);

              case 7:
                _context4.next = 12;
                break;

              case 9:
                _context4.prev = 9;
                _context4.t0 = _context4['catch'](4);

                this.onAfterHookError(_context4.t0, op, session, params);

              case 12:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[4, 9]]);
      }));

      function afterOp(_x14, _x15, _x16) {
        return ref.apply(this, arguments);
      }

      return afterOp;
    }()
  }, {
    key: 'getPrev',
    value: function getPrev(op, doc) {
      if (op.type !== 'del') return;

      return doc.get(op.field);
    }
  }, {
    key: 'onMessage',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(message, channel) {
        var _this3 = this;

        var type, id, collectionName, docId, field, expression, value, version, docIds, ops, opsType, index, howMany, doc, query, valid, op, syncData, docPromises, _collectionName2, collectionSyncData, _loop, _docId, queryPromises, _loop2, hash, prev;

        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                type = message.type;
                id = message.id;
                collectionName = message.collectionName;
                docId = message.docId;
                field = message.field;
                expression = message.expression;
                value = message.value;
                version = message.version;
                docIds = message.docIds;
                ops = message.ops;
                opsType = message.opsType;
                index = message.index;
                howMany = message.howMany;
                doc = void 0;
                query = void 0;
                valid = void 0;
                _context5.t0 = type;
                _context5.next = _context5.t0 === 'handshake' ? 19 : _context5.t0 === 'sync' ? 22 : _context5.t0 === 'fetch' ? 34 : _context5.t0 === 'qfetch' ? 44 : _context5.t0 === 'sub' ? 54 : _context5.t0 === 'qsub' ? 64 : _context5.t0 === 'unsub' ? 74 : _context5.t0 === 'qunsub' ? 79 : _context5.t0 === 'ops' ? 84 : _context5.t0 === 'add' ? 87 : _context5.t0 === 'set' ? 87 : _context5.t0 === 'del' ? 87 : _context5.t0 === 'push' ? 87 : _context5.t0 === 'unshift' ? 87 : _context5.t0 === 'pop' ? 87 : _context5.t0 === 'shift' ? 87 : _context5.t0 === 'insert' ? 87 : _context5.t0 === 'remove' ? 87 : _context5.t0 === 'move' ? 87 : _context5.t0 === 'swap' ? 87 : _context5.t0 === 'arraySet' ? 87 : _context5.t0 === 'invert' ? 87 : _context5.t0 === 'increment' ? 87 : _context5.t0 === 'stringInsert' ? 87 : _context5.t0 === 'stringRemove' ? 87 : _context5.t0 === 'stringSet' ? 87 : 103;
                break;

              case 19:
                op = {
                  type: 'handshake',
                  ackId: id,
                  value: {
                    collectionNames: this.clientCollectionNames,
                    date: Date.now(),
                    projectionHashes: this.projectionHashes,
                    version: this.options.version
                  }
                };

                this.sendOp(op, channel);
                return _context5.abrupt('break', 103);

              case 22:
                syncData = value;
                docPromises = [];


                for (_collectionName2 in syncData.collections) {
                  collectionSyncData = syncData.collections[_collectionName2];

                  _loop = function _loop(_docId) {
                    var _collectionSyncData$_ = collectionSyncData[_docId];
                    var ops = _collectionSyncData$_.ops;
                    var version = _collectionSyncData$_.version;

                    var docPromise = void 0;

                    if (ops.length) {
                      docPromise = _this3.onDocOps(null, _collectionName2, _docId, null, ops, channel).then(function (doc) {
                        doc.subscribe(channel, version);
                      });
                    } else {
                      docPromise = _this3.docSet.getOrCreateDoc(_collectionName2, _docId).then(function (doc) {
                        doc.subscribe(channel, version);
                      });
                    }

                    docPromises.push(docPromise);
                  };

                  for (_docId in collectionSyncData) {
                    _loop(_docId);
                  }
                }

                _context5.next = 27;
                return _promise2.default.all(docPromises);

              case 27:
                queryPromises = [];

                _loop2 = function _loop2(hash) {
                  var _syncData$queries$has = syncData.queries[hash];
                  var collectionName = _syncData$queries$has.collectionName;
                  var expression = _syncData$queries$has.expression;
                  var docIds = _syncData$queries$has.docIds;

                  var queryPromise = _this3.querySet.getOrCreateQuery(collectionName, expression).then(function (query) {
                    query.subscribe(channel, docIds);
                  });
                  queryPromises.push(queryPromise);
                };

                for (hash in syncData.queries) {
                  _loop2(hash);
                }
                _context5.next = 32;
                return _promise2.default.all(queryPromises);

              case 32:

                this.sendAckOp(id, channel);
                return _context5.abrupt('break', 103);

              case 34:
                _context5.next = 36;
                return this.validateOp(message, channel);

              case 36:
                valid = _context5.sent;

                if (valid) {
                  _context5.next = 39;
                  break;
                }

                return _context5.abrupt('break', 103);

              case 39:
                _context5.next = 41;
                return this.docSet.getOrCreateDoc(collectionName, docId);

              case 41:
                doc = _context5.sent;

                doc.fetch(channel, version, id);
                return _context5.abrupt('break', 103);

              case 44:
                _context5.next = 46;
                return this.validateOp(message, channel);

              case 46:
                valid = _context5.sent;

                if (valid) {
                  _context5.next = 49;
                  break;
                }

                return _context5.abrupt('break', 103);

              case 49:
                _context5.next = 51;
                return this.querySet.getOrCreateQuery(collectionName, expression);

              case 51:
                query = _context5.sent;

                query.fetch(channel, docIds, id);
                return _context5.abrupt('break', 103);

              case 54:
                _context5.next = 56;
                return this.validateOp(message, channel);

              case 56:
                valid = _context5.sent;

                if (valid) {
                  _context5.next = 59;
                  break;
                }

                return _context5.abrupt('break', 103);

              case 59:
                _context5.next = 61;
                return this.docSet.getOrCreateDoc(collectionName, docId);

              case 61:
                doc = _context5.sent;

                doc.subscribe(channel, version, id);
                return _context5.abrupt('break', 103);

              case 64:
                _context5.next = 66;
                return this.validateOp(message, channel);

              case 66:
                valid = _context5.sent;

                if (valid) {
                  _context5.next = 69;
                  break;
                }

                return _context5.abrupt('break', 103);

              case 69:
                _context5.next = 71;
                return this.querySet.getOrCreateQuery(collectionName, expression);

              case 71:
                query = _context5.sent;

                query.subscribe(channel, docIds, id);
                return _context5.abrupt('break', 103);

              case 74:
                _context5.next = 76;
                return this.docSet.getOrCreateDoc(collectionName, docId);

              case 76:
                doc = _context5.sent;

                doc.unsubscribe(channel);
                return _context5.abrupt('break', 103);

              case 79:
                _context5.next = 81;
                return this.querySet.getOrCreateQuery(collectionName, expression);

              case 81:
                query = _context5.sent;

                query.unsubscribe(channel);
                return _context5.abrupt('break', 103);

              case 84:
                _context5.next = 86;
                return this.onDocOps(id, collectionName, docId, field, ops, channel, opsType, index, howMany);

              case 86:
                return _context5.abrupt('break', 103);

              case 87:
                _context5.next = 89;
                return this.validateOp(message, channel);

              case 89:
                valid = _context5.sent;

                if (valid) {
                  _context5.next = 92;
                  break;
                }

                return _context5.abrupt('break', 103);

              case 92:
                _context5.next = 94;
                return this.docSet.getOrCreateDoc(collectionName, docId);

              case 94:
                doc = _context5.sent;
                prev = this.getPrev(message, doc);

                doc.onOp(message, channel);

                _context5.next = 99;
                return (0, _eventToPromise2.default)(doc, 'saved');

              case 99:

                this.sendAckOp(id, channel);
                this.onOp(message);

                this.afterOp(message, channel, prev);
                return _context5.abrupt('break', 103);

              case 103:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function onMessage(_x17, _x18) {
        return ref.apply(this, arguments);
      }

      return onMessage;
    }()
  }, {
    key: 'onAfterHookError',
    value: function onAfterHookError(err) {
      console.trace('afterHook error', err);
    }
  }, {
    key: 'getHookParams',
    value: function getHookParams(channel, prev) {
      var req = channel.req;
      var server = channel.server;

      var session = req ? req.session : undefined;
      var params = {
        prev: prev,
        server: server
      };

      return {
        session: session,
        params: params
      };
    }
  }, {
    key: 'sendAckOp',
    value: function sendAckOp(ackId, channel) {
      var ackOp = {
        ackId: ackId
      };
      this.sendOp(ackOp, channel);
    }
  }, {
    key: 'onOp',
    value: function onOp(op) {
      this.querySet.onOp(op);
      this.docSet.onOp(op);
      this.sentOps[op.id] = true;
      if (this.pubsub) this.pubsub.send(op);
    }
  }, {
    key: 'onPubsubOp',
    value: function onPubsubOp(op) {
      if (this.sentOps[op.id]) {
        delete this.sentOps[op.id];
        return;
      }
      this.querySet.onOp(op);
      this.docSet.onPubsubOp(op);
    }
  }, {
    key: 'sendOp',
    value: function sendOp(op, channel) {
      channel.send(op);
    }
  }, {
    key: 'modelMiddleware',
    value: function modelMiddleware() {
      var store = this;
      function modelMiddleware(req, res, next) {
        var requestTimeout = req.socket.server.timeout;
        var model = void 0;

        function getModel() {
          if (model) return model;
          model = store.createModel({ fetchOnly: true }, req);
          return model;
        }
        req.getModel = getModel;

        function closeModel() {
          req.getModel = function () {};
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
  }]);
  return Store;
}(_events.EventEmitter);

exports.default = Store;
module.exports = exports['default'];