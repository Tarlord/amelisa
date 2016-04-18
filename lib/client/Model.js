'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _toArray2 = require('babel-runtime/helpers/toArray');

var _toArray3 = _interopRequireDefault(_toArray2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

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

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _events = require('events');

var _CollectionSet = require('./CollectionSet');

var _CollectionSet2 = _interopRequireDefault(_CollectionSet);

var _ClientQuerySet = require('./ClientQuerySet');

var _ClientQuerySet2 = _interopRequireDefault(_ClientQuerySet);

var _Subscription = require('./Subscription');

var _Subscription2 = _interopRequireDefault(_Subscription);

var _util = require('../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultOptions = {
  clientSaveDebounceTimeout: 1000
};

var Model = function (_EventEmitter) {
  (0, _inherits3.default)(Model, _EventEmitter);

  function Model(channel) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var dbQueries = arguments[2];
    var projectionHashes = arguments[3];
    (0, _classCallCheck3.default)(this, Model);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Model).call(this));

    _this.channel = channel;
    _this.options = (0, _assign2.default)({}, defaultOptions, options);
    _this.source = _this.options.source;
    _this.dbQueries = dbQueries;
    _this.projectionHashes = projectionHashes;
    _this.initing = false;
    _this.inited = false;
    _this.ready = false;
    _this.online = false;
    _this.collectionSet = new _CollectionSet2.default(_this);
    _this.querySet = new _ClientQuerySet2.default(_this);
    _this.callbacks = {};

    channel.on('message', function (message) {
      _this.onMessage(message).catch(function (err) {
        console.error('Error on processing message', message, err);
      });
    });

    channel.on('open', function () {
      if (_util.isServer && !_this.options.isClient) {
        _this.inited = true;
        _this.setOnline();
        return;
      }
      _this.handshake().catch(function (err) {
        console.error('Error while model.handshake', err);
      });
    });

    channel.on('close', function () {
      _this.onChannelClose();
    });

    channel.on('error', function () {
      _this.onChannelClose();
    });
    return _this;
  }

  (0, _createClass3.default)(Model, [{
    key: 'onChannelClose',
    value: function onChannelClose() {
      if (!this.inited && !this.initing) {
        this.init().catch(function (err) {
          console.error('Error while model.init', err, err.stack);
        });
      } else if (this.online) {
        this.setOffline();
      }
    }
  }, {
    key: 'init',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var source;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.initing = true;

                this.storage = this.getStorage && this.getStorage();

                if (!this.storage) {
                  _context.next = 7;
                  break;
                }

                _context.next = 5;
                return this.storage.init();

              case 5:
                _context.next = 7;
                return this.collectionSet.fillFromClientStorage();

              case 7:

                this.set('_session.online', false);

                source = this.get('_app.source');

                if (!source) {
                  source = this.id();
                  this.source = source;
                  this.set('_app.source', source);
                } else {
                  this.source = source;
                }

                this.inited = true;
                this.setReady();

              case 12:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function init() {
        return ref.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: 'handshake',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        var start, op, _ref, collectionNames, date, projectionHashes, version, source;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.initing = true;

                start = Date.now();
                op = {
                  id: this.id(),
                  type: 'handshake'
                };
                _context2.next = 5;
                return this.send(op, true);

              case 5:
                _ref = _context2.sent;
                collectionNames = _ref.collectionNames;
                date = _ref.date;
                projectionHashes = _ref.projectionHashes;
                version = _ref.version;

                this.syncDate(start, date);

                collectionNames = collectionNames.concat(['_app', '_session']);
                this.storage = this.getStorage && this.getStorage(collectionNames, version);

                if (!this.storage) {
                  _context2.next = 20;
                  break;
                }

                _context2.next = 16;
                return this.storage.init();

              case 16:
                _context2.next = 18;
                return this.onProjections(projectionHashes);

              case 18:
                _context2.next = 20;
                return this.collectionSet.fillFromClientStorage();

              case 20:

                if (version !== this.get('_app.version')) this.emit('version', version);
                this.set('_app.version', version);

                source = this.get('_app.source');

                if (!source) {
                  source = this.id();
                  this.source = source;
                  this.set('_app.source', source);
                } else {
                  this.source = source;
                }

                _context2.next = 26;
                return this.unbundleData();

              case 26:

                op = {
                  id: this.id(),
                  type: 'sync',
                  value: {
                    collections: this.collectionSet.getSyncData(),
                    queries: this.querySet.getSyncData()
                  }
                };
                _context2.next = 29;
                return this.send(op, true);

              case 29:

                this.inited = true;
                this.setOnline();
                this.setReady();

              case 32:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function handshake() {
        return ref.apply(this, arguments);
      }

      return handshake;
    }()
  }, {
    key: 'onReady',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
        var _this2 = this;

        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!this.ready) {
                  _context3.next = 2;
                  break;
                }

                return _context3.abrupt('return');

              case 2:
                return _context3.abrupt('return', new _promise2.default(function (resolve, reject) {
                  _this2.once('ready', function () {
                    resolve();
                  });
                }));

              case 3:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function onReady() {
        return ref.apply(this, arguments);
      }

      return onReady;
    }()
  }, {
    key: 'fetch',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
        for (var _len = arguments.length, rawSubscribes = Array(_len), _key = 0; _key < _len; _key++) {
          rawSubscribes[_key] = arguments[_key];
        }

        var subscription;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                subscription = new _Subscription2.default(rawSubscribes, this.collectionSet, this.querySet);
                _context4.next = 3;
                return subscription.fetch();

              case 3:
                return _context4.abrupt('return', subscription);

              case 4:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function fetch(_x2) {
        return ref.apply(this, arguments);
      }

      return fetch;
    }()
  }, {
    key: 'subscribe',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {
        for (var _len2 = arguments.length, rawSubscribes = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          rawSubscribes[_key2] = arguments[_key2];
        }

        var subscription;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!this.options.fetchOnly) {
                  _context5.next = 2;
                  break;
                }

                return _context5.abrupt('return', this.fetch.apply(this, rawSubscribes));

              case 2:
                subscription = new _Subscription2.default(rawSubscribes, this.collectionSet, this.querySet);
                _context5.next = 5;
                return subscription.subscribe();

              case 5:
                return _context5.abrupt('return', subscription);

              case 6:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function subscribe(_x3) {
        return ref.apply(this, arguments);
      }

      return subscribe;
    }()
  }, {
    key: 'fetchAndGet',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(collectionName, docIdOrExpression) {
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (!(typeof docIdOrExpression === 'string')) {
                  _context6.next = 4;
                  break;
                }

                return _context6.abrupt('return', this.doc(collectionName, docIdOrExpression).fetchAndGet());

              case 4:
                return _context6.abrupt('return', this.query(collectionName, docIdOrExpression).fetchAndGet());

              case 5:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function fetchAndGet(_x4, _x5) {
        return ref.apply(this, arguments);
      }

      return fetchAndGet;
    }()
  }, {
    key: 'setReady',
    value: function setReady() {
      this.ready = true;
      this.emit('ready');
    }
  }, {
    key: 'setOnline',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7() {
        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                this.online = true;

                this.set('_session.online', true);
                this.emit('online');

              case 3:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function setOnline() {
        return ref.apply(this, arguments);
      }

      return setOnline;
    }()
  }, {
    key: 'setOffline',
    value: function setOffline() {
      this.online = false;
      this.set('_session.online', false);
      this.emit('offline');
    }
  }, {
    key: 'onMessage',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(message) {
        var type, collectionName, docId, expression, value, version, diffs, docOps, ops, ackId, error, doc, query, collection, callbacks, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, callback;

        return _regenerator2.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                type = message.type;
                collectionName = message.collectionName;
                docId = message.docId;
                expression = message.expression;
                value = message.value;
                version = message.version;
                diffs = message.diffs;
                docOps = message.docOps;
                ops = message.ops;
                ackId = message.ackId;
                error = message.error;
                doc = void 0;
                query = void 0;
                collection = void 0;
                _context8.t0 = type;
                _context8.next = _context8.t0 === 'fetch' ? 17 : _context8.t0 === 'sub' ? 20 : _context8.t0 === 'q' ? 23 : _context8.t0 === 'qdiff' ? 26 : _context8.t0 === 'ops' ? 29 : _context8.t0 === 'add' ? 32 : _context8.t0 === 'set' ? 32 : _context8.t0 === 'del' ? 32 : _context8.t0 === 'push' ? 32 : _context8.t0 === 'unshift' ? 32 : _context8.t0 === 'pop' ? 32 : _context8.t0 === 'shift' ? 32 : _context8.t0 === 'insert' ? 32 : _context8.t0 === 'remove' ? 32 : _context8.t0 === 'move' ? 32 : _context8.t0 === 'swap' ? 32 : _context8.t0 === 'arraySet' ? 32 : _context8.t0 === 'invert' ? 32 : _context8.t0 === 'increment' ? 32 : _context8.t0 === 'stringInsert' ? 32 : _context8.t0 === 'stringRemove' ? 32 : _context8.t0 === 'stringSet' ? 32 : 36;
                break;

              case 17:
                doc = this.collectionSet.getDoc(collectionName, docId);
                if (doc) {
                  doc.onDataFromServer(version, ops);
                }
                return _context8.abrupt('break', 36);

              case 20:
                doc = this.collectionSet.getDoc(collectionName, docId);
                if (doc) {
                  doc.onDataFromServer(version, ops);
                }
                return _context8.abrupt('break', 36);

              case 23:
                query = this.querySet.getOrCreateQuery(collectionName, expression);
                query.onSnapshotNotDocs(value);
                return _context8.abrupt('break', 36);

              case 26:
                query = this.querySet.getOrCreateQuery(collectionName, expression);
                query.onDiff(diffs, docOps);
                return _context8.abrupt('break', 36);

              case 29:
                doc = this.collectionSet.getDoc(collectionName, docId);
                if (doc) {
                  doc.receiveOps(ops, message.opsType, message.field, message.index, message.howMany);
                }
                return _context8.abrupt('break', 36);

              case 32:
                collection = this.collectionSet.getOrCreateCollection(collectionName);
                doc = collection.getDoc(docId);

                if (doc) {
                  doc.receiveOp(message);
                } else {
                  collection.attach(docId, [message]);
                }
                return _context8.abrupt('break', 36);

              case 36:
                if (!ackId) {
                  _context8.next = 60;
                  break;
                }

                if (error) this.collectionSet.rejectOp(collectionName, docId, ackId);

                callbacks = this.callbacks[ackId];

                if (!callbacks) {
                  _context8.next = 60;
                  break;
                }

                delete this.callbacks[ackId];
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context8.prev = 44;
                for (_iterator = (0, _getIterator3.default)(callbacks); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  callback = _step.value;

                  if (error) {
                    callback(new Error(error));
                  } else {
                    callback(null, value);
                  }
                }
                _context8.next = 52;
                break;

              case 48:
                _context8.prev = 48;
                _context8.t1 = _context8['catch'](44);
                _didIteratorError = true;
                _iteratorError = _context8.t1;

              case 52:
                _context8.prev = 52;
                _context8.prev = 53;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 55:
                _context8.prev = 55;

                if (!_didIteratorError) {
                  _context8.next = 58;
                  break;
                }

                throw _iteratorError;

              case 58:
                return _context8.finish(55);

              case 59:
                return _context8.finish(52);

              case 60:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this, [[44, 48, 52, 60], [53,, 55, 59]]);
      }));

      function onMessage(_x6) {
        return ref.apply(this, arguments);
      }

      return onMessage;
    }()
  }, {
    key: 'get',
    value: function get() {
      var _parseArguments = (0, _util.parseArguments)(arguments);

      var _parseArguments2 = (0, _toArray3.default)(_parseArguments);

      var collectionName = _parseArguments2[0];
      var docId = _parseArguments2[1];

      var field = _parseArguments2.slice(2);

      return this.collectionSet.get(collectionName, docId, field);
    }
  }, {
    key: 'add',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(collectionName, docData) {
        var docId, collection;
        return _regenerator2.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                (0, _invariant2.default)(collectionName && typeof collectionName === 'string', 'Model.add collectionName is required and should be a string');
                (0, _invariant2.default)(docData && (typeof docData === 'undefined' ? 'undefined' : (0, _typeof3.default)(docData)) === 'object', 'Model.add docData is required and should be an object');

                docData = (0, _util.deepClone)(docData);
                docId = docData._id;

                if (!docId) docId = this.id();else delete docData._id;

                collection = this.collectionSet.getOrCreateCollection(collectionName);
                return _context9.abrupt('return', collection.add(docId, docData));

              case 7:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function add(_x7, _x8) {
        return ref.apply(this, arguments);
      }

      return add;
    }()
  }, {
    key: 'set',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(path, value) {
        var parsedPath, collectionName, docId, pathParams, field, _parsePath, _parsePath2, _parsePath3, _parsePath4, doc;

        return _regenerator2.default.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                parsedPath = (0, _util.parsePath)(path);
                collectionName = void 0, docId = void 0, pathParams = void 0, field = void 0;

                if (parsedPath.length > 2) {
                  _parsePath = (0, _util.parsePath)(path);
                  _parsePath2 = (0, _toArray3.default)(_parsePath);
                  collectionName = _parsePath2[0];
                  docId = _parsePath2[1];
                  pathParams = _parsePath2.slice(2);

                  field = pathParams.join('.');
                } else {
                  _parsePath3 = (0, _util.parsePath)(path);
                  _parsePath4 = (0, _slicedToArray3.default)(_parsePath3, 2);
                  collectionName = _parsePath4[0];
                  docId = _parsePath4[1];
                }

                (0, _invariant2.default)(collectionName && typeof collectionName === 'string', 'Model.set collectionName is required and should be a string');
                (0, _invariant2.default)(docId && typeof docId === 'string', 'Model.set docId is required and should be a string');
                (0, _invariant2.default)(!field || typeof field === 'string', 'Model.set field should be a string');

                doc = this.collectionSet.getOrCreateDoc(collectionName, docId);
                return _context10.abrupt('return', doc.set(field, value));

              case 8:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function set(_x9, _x10) {
        return ref.apply(this, arguments);
      }

      return set;
    }()
  }, {
    key: 'del',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11() {
        for (var _len3 = arguments.length, path = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          path[_key3] = arguments[_key3];
        }

        var parsedPath, collectionName, docId, pathParams, field, _parsePath5, _parsePath6, _parsePath7, _parsePath8, doc;

        return _regenerator2.default.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                parsedPath = (0, _util.parsePath)(path);
                collectionName = void 0, docId = void 0, pathParams = void 0, field = void 0;

                if (parsedPath.length > 2) {
                  _parsePath5 = (0, _util.parsePath)(path);
                  _parsePath6 = (0, _toArray3.default)(_parsePath5);
                  collectionName = _parsePath6[0];
                  docId = _parsePath6[1];
                  pathParams = _parsePath6.slice(2);

                  field = pathParams.join('.');
                } else {
                  _parsePath7 = (0, _util.parsePath)(path);
                  _parsePath8 = (0, _slicedToArray3.default)(_parsePath7, 2);
                  collectionName = _parsePath8[0];
                  docId = _parsePath8[1];
                }

                (0, _invariant2.default)(collectionName && typeof collectionName === 'string', 'Model.del collectionName is required and should be a string');
                (0, _invariant2.default)(docId && typeof docId === 'string', 'Model.del docId is required and should be a string');
                (0, _invariant2.default)(!field || typeof field === 'string', 'Model.del field should be a string');

                doc = this.collectionSet.getOrCreateDoc(collectionName, docId);
                return _context11.abrupt('return', doc.del(field));

              case 8:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function del(_x11) {
        return ref.apply(this, arguments);
      }

      return del;
    }()
  }, {
    key: 'push',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12(path, value) {
        var parsedPath, collectionName, docId, pathParams, field, _parsePath9, _parsePath10, _parsePath11, _parsePath12, doc;

        return _regenerator2.default.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                parsedPath = (0, _util.parsePath)(path);
                collectionName = void 0, docId = void 0, pathParams = void 0, field = void 0;

                if (parsedPath.length > 2) {
                  _parsePath9 = (0, _util.parsePath)(path);
                  _parsePath10 = (0, _toArray3.default)(_parsePath9);
                  collectionName = _parsePath10[0];
                  docId = _parsePath10[1];
                  pathParams = _parsePath10.slice(2);

                  field = pathParams.join('.');
                } else {
                  _parsePath11 = (0, _util.parsePath)(path);
                  _parsePath12 = (0, _slicedToArray3.default)(_parsePath11, 2);
                  collectionName = _parsePath12[0];
                  docId = _parsePath12[1];
                }

                (0, _invariant2.default)(collectionName && typeof collectionName === 'string', 'Model.push collectionName is required and should be a string');
                (0, _invariant2.default)(docId && typeof docId === 'string', 'Model.push docId is required and should be a string');
                (0, _invariant2.default)(!field || typeof field === 'string', 'Model.push field should be a string');

                doc = this.collectionSet.getOrCreateDoc(collectionName, docId);
                return _context12.abrupt('return', doc.push(field, value));

              case 8:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function push(_x12, _x13) {
        return ref.apply(this, arguments);
      }

      return push;
    }()
  }, {
    key: 'unshift',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee13(path, value) {
        var parsedPath, collectionName, docId, pathParams, field, _parsePath13, _parsePath14, _parsePath15, _parsePath16, doc;

        return _regenerator2.default.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                parsedPath = (0, _util.parsePath)(path);
                collectionName = void 0, docId = void 0, pathParams = void 0, field = void 0;

                if (parsedPath.length > 2) {
                  _parsePath13 = (0, _util.parsePath)(path);
                  _parsePath14 = (0, _toArray3.default)(_parsePath13);
                  collectionName = _parsePath14[0];
                  docId = _parsePath14[1];
                  pathParams = _parsePath14.slice(2);

                  field = pathParams.join('.');
                } else {
                  _parsePath15 = (0, _util.parsePath)(path);
                  _parsePath16 = (0, _slicedToArray3.default)(_parsePath15, 2);
                  collectionName = _parsePath16[0];
                  docId = _parsePath16[1];
                }

                (0, _invariant2.default)(collectionName && typeof collectionName === 'string', 'Model.unshift collectionName is required and should be a string');
                (0, _invariant2.default)(docId && typeof docId === 'string', 'Model.unshift docId is required and should be a string');
                (0, _invariant2.default)(!field || typeof field === 'string', 'Model.unshift field should be a string');

                doc = this.collectionSet.getOrCreateDoc(collectionName, docId);
                return _context13.abrupt('return', doc.unshift(field, value));

              case 8:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function unshift(_x14, _x15) {
        return ref.apply(this, arguments);
      }

      return unshift;
    }()
  }, {
    key: 'pop',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee14(path) {
        var parsedPath, collectionName, docId, pathParams, field, _parsePath17, _parsePath18, _parsePath19, _parsePath20, doc;

        return _regenerator2.default.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                parsedPath = (0, _util.parsePath)(path);
                collectionName = void 0, docId = void 0, pathParams = void 0, field = void 0;

                if (parsedPath.length > 2) {
                  _parsePath17 = (0, _util.parsePath)(path);
                  _parsePath18 = (0, _toArray3.default)(_parsePath17);
                  collectionName = _parsePath18[0];
                  docId = _parsePath18[1];
                  pathParams = _parsePath18.slice(2);

                  field = pathParams.join('.');
                } else {
                  _parsePath19 = (0, _util.parsePath)(path);
                  _parsePath20 = (0, _slicedToArray3.default)(_parsePath19, 2);
                  collectionName = _parsePath20[0];
                  docId = _parsePath20[1];
                }

                (0, _invariant2.default)(collectionName && typeof collectionName === 'string', 'Model.pop collectionName is required and should be a string');
                (0, _invariant2.default)(docId && typeof docId === 'string', 'Model.pop docId is required and should be a string');
                (0, _invariant2.default)(!field || typeof field === 'string', 'Model.pop field should be a string');

                doc = this.collectionSet.getOrCreateDoc(collectionName, docId);
                return _context14.abrupt('return', doc.pop(field));

              case 8:
              case 'end':
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function pop(_x16) {
        return ref.apply(this, arguments);
      }

      return pop;
    }()
  }, {
    key: 'shift',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee15(path) {
        var parsedPath, collectionName, docId, pathParams, field, _parsePath21, _parsePath22, _parsePath23, _parsePath24, doc;

        return _regenerator2.default.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                parsedPath = (0, _util.parsePath)(path);
                collectionName = void 0, docId = void 0, pathParams = void 0, field = void 0;

                if (parsedPath.length > 2) {
                  _parsePath21 = (0, _util.parsePath)(path);
                  _parsePath22 = (0, _toArray3.default)(_parsePath21);
                  collectionName = _parsePath22[0];
                  docId = _parsePath22[1];
                  pathParams = _parsePath22.slice(2);

                  field = pathParams.join('.');
                } else {
                  _parsePath23 = (0, _util.parsePath)(path);
                  _parsePath24 = (0, _slicedToArray3.default)(_parsePath23, 2);
                  collectionName = _parsePath24[0];
                  docId = _parsePath24[1];
                }

                (0, _invariant2.default)(collectionName && typeof collectionName === 'string', 'Model.shift collectionName is required and should be a string');
                (0, _invariant2.default)(docId && typeof docId === 'string', 'Model.shift docId is required and should be a string');
                (0, _invariant2.default)(!field || typeof field === 'string', 'Model.shift field should be a string');

                doc = this.collectionSet.getOrCreateDoc(collectionName, docId);
                return _context15.abrupt('return', doc.shift(field));

              case 8:
              case 'end':
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function shift(_x17) {
        return ref.apply(this, arguments);
      }

      return shift;
    }()
  }, {
    key: 'insert',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee16(path, index, values) {
        var parsedPath, collectionName, docId, pathParams, field, _parsePath25, _parsePath26, _parsePath27, _parsePath28, doc;

        return _regenerator2.default.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                parsedPath = (0, _util.parsePath)(path);
                collectionName = void 0, docId = void 0, pathParams = void 0, field = void 0;

                if (parsedPath.length > 2) {
                  _parsePath25 = (0, _util.parsePath)(path);
                  _parsePath26 = (0, _toArray3.default)(_parsePath25);
                  collectionName = _parsePath26[0];
                  docId = _parsePath26[1];
                  pathParams = _parsePath26.slice(2);

                  field = pathParams.join('.');
                } else {
                  _parsePath27 = (0, _util.parsePath)(path);
                  _parsePath28 = (0, _slicedToArray3.default)(_parsePath27, 2);
                  collectionName = _parsePath28[0];
                  docId = _parsePath28[1];
                }

                (0, _invariant2.default)(collectionName && typeof collectionName === 'string', 'Model.insert collectionName is required and should be a string');
                (0, _invariant2.default)(docId && typeof docId === 'string', 'Model.insert docId is required and should be a string');
                (0, _invariant2.default)(!field || typeof field === 'string', 'Model.insert field should be a string');
                (0, _invariant2.default)(typeof index === 'number', 'Model.insert index should be a number');

                doc = this.collectionSet.getOrCreateDoc(collectionName, docId);
                return _context16.abrupt('return', doc.insert(field, index, values));

              case 9:
              case 'end':
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function insert(_x18, _x19, _x20) {
        return ref.apply(this, arguments);
      }

      return insert;
    }()
  }, {
    key: 'remove',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee17(path, index, howMany) {
        var parsedPath, collectionName, docId, pathParams, field, _parsePath29, _parsePath30, _parsePath31, _parsePath32, doc;

        return _regenerator2.default.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                parsedPath = (0, _util.parsePath)(path);
                collectionName = void 0, docId = void 0, pathParams = void 0, field = void 0;

                if (parsedPath.length > 2) {
                  _parsePath29 = (0, _util.parsePath)(path);
                  _parsePath30 = (0, _toArray3.default)(_parsePath29);
                  collectionName = _parsePath30[0];
                  docId = _parsePath30[1];
                  pathParams = _parsePath30.slice(2);

                  field = pathParams.join('.');
                } else {
                  _parsePath31 = (0, _util.parsePath)(path);
                  _parsePath32 = (0, _slicedToArray3.default)(_parsePath31, 2);
                  collectionName = _parsePath32[0];
                  docId = _parsePath32[1];
                }

                (0, _invariant2.default)(collectionName && typeof collectionName === 'string', 'Model.remove collectionName is required and should be a string');
                (0, _invariant2.default)(docId && typeof docId === 'string', 'Model.remove docId is required and should be a string');
                (0, _invariant2.default)(!field || typeof field === 'string', 'Model.remove field should be a string');
                (0, _invariant2.default)(typeof index === 'number', 'Model.remove index should be a number');
                (0, _invariant2.default)(typeof howMany === 'number', 'Model.remove howMany should be a number');

                doc = this.collectionSet.getOrCreateDoc(collectionName, docId);
                return _context17.abrupt('return', doc.remove(field, index, howMany));

              case 10:
              case 'end':
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));

      function remove(_x21, _x22, _x23) {
        return ref.apply(this, arguments);
      }

      return remove;
    }()
  }, {
    key: 'move',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee18(path, from, to, howMany) {
        var parsedPath, collectionName, docId, pathParams, field, _parsePath33, _parsePath34, _parsePath35, _parsePath36, doc;

        return _regenerator2.default.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                parsedPath = (0, _util.parsePath)(path);
                collectionName = void 0, docId = void 0, pathParams = void 0, field = void 0;

                if (parsedPath.length > 2) {
                  _parsePath33 = (0, _util.parsePath)(path);
                  _parsePath34 = (0, _toArray3.default)(_parsePath33);
                  collectionName = _parsePath34[0];
                  docId = _parsePath34[1];
                  pathParams = _parsePath34.slice(2);

                  field = pathParams.join('.');
                } else {
                  _parsePath35 = (0, _util.parsePath)(path);
                  _parsePath36 = (0, _slicedToArray3.default)(_parsePath35, 2);
                  collectionName = _parsePath36[0];
                  docId = _parsePath36[1];
                }

                (0, _invariant2.default)(collectionName && typeof collectionName === 'string', 'Model.move collectionName is required and should be a string');
                (0, _invariant2.default)(docId && typeof docId === 'string', 'Model.move docId is required and should be a string');
                (0, _invariant2.default)(!field || typeof field === 'string', 'Model.move field should be a string');
                (0, _invariant2.default)(typeof from === 'number', 'Model.move from should be a number');
                (0, _invariant2.default)(typeof to === 'number', 'Model.move to should be a number');
                (0, _invariant2.default)(!howMany || typeof howMany === 'number', 'Model.move howMany should be a number');

                doc = this.collectionSet.getOrCreateDoc(collectionName, docId);
                return _context18.abrupt('return', doc.move(field, from, to, howMany));

              case 11:
              case 'end':
                return _context18.stop();
            }
          }
        }, _callee18, this);
      }));

      function move(_x24, _x25, _x26, _x27) {
        return ref.apply(this, arguments);
      }

      return move;
    }()
  }, {
    key: 'swap',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee19(path, from, to) {
        var parsedPath, collectionName, docId, pathParams, field, _parsePath37, _parsePath38, _parsePath39, _parsePath40, doc;

        return _regenerator2.default.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                parsedPath = (0, _util.parsePath)(path);
                collectionName = void 0, docId = void 0, pathParams = void 0, field = void 0;

                if (parsedPath.length > 2) {
                  _parsePath37 = (0, _util.parsePath)(path);
                  _parsePath38 = (0, _toArray3.default)(_parsePath37);
                  collectionName = _parsePath38[0];
                  docId = _parsePath38[1];
                  pathParams = _parsePath38.slice(2);

                  field = pathParams.join('.');
                } else {
                  _parsePath39 = (0, _util.parsePath)(path);
                  _parsePath40 = (0, _slicedToArray3.default)(_parsePath39, 2);
                  collectionName = _parsePath40[0];
                  docId = _parsePath40[1];
                }

                (0, _invariant2.default)(collectionName && typeof collectionName === 'string', 'Model.swap collectionName is required and should be a string');
                (0, _invariant2.default)(docId && typeof docId === 'string', 'Model.swap docId is required and should be a string');
                (0, _invariant2.default)(!field || typeof field === 'string', 'Model.swap field should be a string');
                (0, _invariant2.default)(typeof from === 'number', 'Model.swap from should be a number');
                (0, _invariant2.default)(typeof to === 'number', 'Model.swap to should be a number');

                doc = this.collectionSet.getOrCreateDoc(collectionName, docId);
                return _context19.abrupt('return', doc.swap(field, from, to));

              case 10:
              case 'end':
                return _context19.stop();
            }
          }
        }, _callee19, this);
      }));

      function swap(_x28, _x29, _x30) {
        return ref.apply(this, arguments);
      }

      return swap;
    }()
  }, {
    key: 'arrayDiff',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee20(path, value) {
        var parsedPath, collectionName, docId, pathParams, field, _parsePath41, _parsePath42, _parsePath43, _parsePath44, doc;

        return _regenerator2.default.wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                parsedPath = (0, _util.parsePath)(path);
                collectionName = void 0, docId = void 0, pathParams = void 0, field = void 0;

                if (parsedPath.length > 2) {
                  _parsePath41 = (0, _util.parsePath)(path);
                  _parsePath42 = (0, _toArray3.default)(_parsePath41);
                  collectionName = _parsePath42[0];
                  docId = _parsePath42[1];
                  pathParams = _parsePath42.slice(2);

                  field = pathParams.join('.');
                } else {
                  _parsePath43 = (0, _util.parsePath)(path);
                  _parsePath44 = (0, _slicedToArray3.default)(_parsePath43, 2);
                  collectionName = _parsePath44[0];
                  docId = _parsePath44[1];
                }

                (0, _invariant2.default)(collectionName && typeof collectionName === 'string', 'Model.arrayDiff collectionName is required and should be a string');
                (0, _invariant2.default)(docId && typeof docId === 'string', 'Model.arrayDiff docId is required and should be a string');
                (0, _invariant2.default)(!field || typeof field === 'string', 'Model.arrayDiff field should be a string');
                (0, _invariant2.default)(Array.isArray(value), 'Model.arrayDiff value should be a array');

                doc = this.collectionSet.getOrCreateDoc(collectionName, docId);
                return _context20.abrupt('return', doc.arrayDiff(field, value));

              case 9:
              case 'end':
                return _context20.stop();
            }
          }
        }, _callee20, this);
      }));

      function arrayDiff(_x31, _x32) {
        return ref.apply(this, arguments);
      }

      return arrayDiff;
    }()
  }, {
    key: 'invert',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee21(path) {
        var parsedPath, collectionName, docId, pathParams, field, _parsePath45, _parsePath46, _parsePath47, _parsePath48, doc;

        return _regenerator2.default.wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                parsedPath = (0, _util.parsePath)(path);
                collectionName = void 0, docId = void 0, pathParams = void 0, field = void 0;

                if (parsedPath.length > 2) {
                  _parsePath45 = (0, _util.parsePath)(path);
                  _parsePath46 = (0, _toArray3.default)(_parsePath45);
                  collectionName = _parsePath46[0];
                  docId = _parsePath46[1];
                  pathParams = _parsePath46.slice(2);

                  field = pathParams.join('.');
                } else {
                  _parsePath47 = (0, _util.parsePath)(path);
                  _parsePath48 = (0, _slicedToArray3.default)(_parsePath47, 2);
                  collectionName = _parsePath48[0];
                  docId = _parsePath48[1];
                }

                (0, _invariant2.default)(collectionName && typeof collectionName === 'string', 'Model.invert collectionName is required and should be a string');
                (0, _invariant2.default)(docId && typeof docId === 'string', 'Model.invert docId is required and should be a string');
                (0, _invariant2.default)(!field || typeof field === 'string', 'Model.invert field should be a string');

                doc = this.collectionSet.getOrCreateDoc(collectionName, docId);
                return _context21.abrupt('return', doc.invert(field));

              case 8:
              case 'end':
                return _context21.stop();
            }
          }
        }, _callee21, this);
      }));

      function invert(_x33) {
        return ref.apply(this, arguments);
      }

      return invert;
    }()
  }, {
    key: 'increment',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee22(path, value) {
        var parsedPath, collectionName, docId, pathParams, field, _parsePath49, _parsePath50, _parsePath51, _parsePath52, doc;

        return _regenerator2.default.wrap(function _callee22$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                parsedPath = (0, _util.parsePath)(path);
                collectionName = void 0, docId = void 0, pathParams = void 0, field = void 0;

                if (parsedPath.length > 2) {
                  _parsePath49 = (0, _util.parsePath)(path);
                  _parsePath50 = (0, _toArray3.default)(_parsePath49);
                  collectionName = _parsePath50[0];
                  docId = _parsePath50[1];
                  pathParams = _parsePath50.slice(2);

                  field = pathParams.join('.');
                } else {
                  _parsePath51 = (0, _util.parsePath)(path);
                  _parsePath52 = (0, _slicedToArray3.default)(_parsePath51, 2);
                  collectionName = _parsePath52[0];
                  docId = _parsePath52[1];
                }

                (0, _invariant2.default)(collectionName && typeof collectionName === 'string', 'Model.increment collectionName is required and should be a string');
                (0, _invariant2.default)(docId && typeof docId === 'string', 'Model.increment docId is required and should be a string');
                (0, _invariant2.default)(!field || typeof field === 'string', 'Model.increment field should be a string');
                (0, _invariant2.default)(value === undefined || typeof value === 'number', 'Model.increment value should be a number');

                doc = this.collectionSet.getOrCreateDoc(collectionName, docId);
                return _context22.abrupt('return', doc.increment(field, value));

              case 9:
              case 'end':
                return _context22.stop();
            }
          }
        }, _callee22, this);
      }));

      function increment(_x34, _x35) {
        return ref.apply(this, arguments);
      }

      return increment;
    }()
  }, {
    key: 'stringInsert',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee23(path, index, value) {
        var parsedPath, collectionName, docId, pathParams, field, _parsePath53, _parsePath54, _parsePath55, _parsePath56, doc;

        return _regenerator2.default.wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                parsedPath = (0, _util.parsePath)(path);
                collectionName = void 0, docId = void 0, pathParams = void 0, field = void 0;

                if (parsedPath.length > 2) {
                  _parsePath53 = (0, _util.parsePath)(path);
                  _parsePath54 = (0, _toArray3.default)(_parsePath53);
                  collectionName = _parsePath54[0];
                  docId = _parsePath54[1];
                  pathParams = _parsePath54.slice(2);

                  field = pathParams.join('.');
                } else {
                  _parsePath55 = (0, _util.parsePath)(path);
                  _parsePath56 = (0, _slicedToArray3.default)(_parsePath55, 2);
                  collectionName = _parsePath56[0];
                  docId = _parsePath56[1];
                }

                (0, _invariant2.default)(collectionName && typeof collectionName === 'string', 'Model.stringInsert collectionName is required and should be a string');
                (0, _invariant2.default)(docId && typeof docId === 'string', 'Model.stringInsert docId is required and should be a string');
                (0, _invariant2.default)(!field || typeof field === 'string', 'Model.stringInsert field should be a string');
                (0, _invariant2.default)(typeof index === 'number', 'Model.stringInsert index should be a number');
                (0, _invariant2.default)(typeof value === 'string', 'Model.stringInsert value should be a string');

                doc = this.collectionSet.getOrCreateDoc(collectionName, docId);
                return _context23.abrupt('return', doc.stringInsert(field, index, value));

              case 10:
              case 'end':
                return _context23.stop();
            }
          }
        }, _callee23, this);
      }));

      function stringInsert(_x36, _x37, _x38) {
        return ref.apply(this, arguments);
      }

      return stringInsert;
    }()
  }, {
    key: 'stringRemove',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee24(path, index, howMany) {
        var parsedPath, collectionName, docId, pathParams, field, _parsePath57, _parsePath58, _parsePath59, _parsePath60, doc;

        return _regenerator2.default.wrap(function _callee24$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                parsedPath = (0, _util.parsePath)(path);
                collectionName = void 0, docId = void 0, pathParams = void 0, field = void 0;

                if (parsedPath.length > 2) {
                  _parsePath57 = (0, _util.parsePath)(path);
                  _parsePath58 = (0, _toArray3.default)(_parsePath57);
                  collectionName = _parsePath58[0];
                  docId = _parsePath58[1];
                  pathParams = _parsePath58.slice(2);

                  field = pathParams.join('.');
                } else {
                  _parsePath59 = (0, _util.parsePath)(path);
                  _parsePath60 = (0, _slicedToArray3.default)(_parsePath59, 2);
                  collectionName = _parsePath60[0];
                  docId = _parsePath60[1];
                }

                (0, _invariant2.default)(collectionName && typeof collectionName === 'string', 'Model.stringRemove collectionName is required and should be a string');
                (0, _invariant2.default)(docId && typeof docId === 'string', 'Model.stringRemove docId is required and should be a string');
                (0, _invariant2.default)(!field || typeof field === 'string', 'Model.stringRemove field should be a string');
                (0, _invariant2.default)(typeof index === 'number', 'Model.stringRemove index should be a number');
                (0, _invariant2.default)(typeof howMany === 'number', 'Model.stringRemove howMany should be a number');

                doc = this.collectionSet.getOrCreateDoc(collectionName, docId);
                return _context24.abrupt('return', doc.stringRemove(field, index, howMany));

              case 10:
              case 'end':
                return _context24.stop();
            }
          }
        }, _callee24, this);
      }));

      function stringRemove(_x39, _x40, _x41) {
        return ref.apply(this, arguments);
      }

      return stringRemove;
    }()
  }, {
    key: 'stringDiff',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee25(path, value) {
        var parsedPath, collectionName, docId, pathParams, field, _parsePath61, _parsePath62, _parsePath63, _parsePath64, doc;

        return _regenerator2.default.wrap(function _callee25$(_context25) {
          while (1) {
            switch (_context25.prev = _context25.next) {
              case 0:
                parsedPath = (0, _util.parsePath)(path);
                collectionName = void 0, docId = void 0, pathParams = void 0, field = void 0;

                if (parsedPath.length > 2) {
                  _parsePath61 = (0, _util.parsePath)(path);
                  _parsePath62 = (0, _toArray3.default)(_parsePath61);
                  collectionName = _parsePath62[0];
                  docId = _parsePath62[1];
                  pathParams = _parsePath62.slice(2);

                  field = pathParams.join('.');
                } else {
                  _parsePath63 = (0, _util.parsePath)(path);
                  _parsePath64 = (0, _slicedToArray3.default)(_parsePath63, 2);
                  collectionName = _parsePath64[0];
                  docId = _parsePath64[1];
                }

                (0, _invariant2.default)(collectionName && typeof collectionName === 'string', 'Model.stringDiff collectionName is required and should be a string');
                (0, _invariant2.default)(docId && typeof docId === 'string', 'Model.stringDiff docId is required and should be a string');
                (0, _invariant2.default)(!field || typeof field === 'string', 'Model.stringDiff field should be a string');
                (0, _invariant2.default)(typeof value === 'string', 'Model.stringDiff value should be a string');

                doc = this.collectionSet.getOrCreateDoc(collectionName, docId);
                return _context25.abrupt('return', doc.stringDiff(field, value));

              case 9:
              case 'end':
                return _context25.stop();
            }
          }
        }, _callee25, this);
      }));

      function stringDiff(_x42, _x43) {
        return ref.apply(this, arguments);
      }

      return stringDiff;
    }()
  }, {
    key: 'richDiff',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee26(path, value) {
        var parsedPath, collectionName, docId, pathParams, field, _parsePath65, _parsePath66, _parsePath67, _parsePath68, doc;

        return _regenerator2.default.wrap(function _callee26$(_context26) {
          while (1) {
            switch (_context26.prev = _context26.next) {
              case 0:
                parsedPath = (0, _util.parsePath)(path);
                collectionName = void 0, docId = void 0, pathParams = void 0, field = void 0;

                if (parsedPath.length > 2) {
                  _parsePath65 = (0, _util.parsePath)(path);
                  _parsePath66 = (0, _toArray3.default)(_parsePath65);
                  collectionName = _parsePath66[0];
                  docId = _parsePath66[1];
                  pathParams = _parsePath66.slice(2);

                  field = pathParams.join('.');
                } else {
                  _parsePath67 = (0, _util.parsePath)(path);
                  _parsePath68 = (0, _slicedToArray3.default)(_parsePath67, 2);
                  collectionName = _parsePath68[0];
                  docId = _parsePath68[1];
                }

                (0, _invariant2.default)(collectionName && typeof collectionName === 'string', 'Model.richDiff collectionName is required and should be a string');
                (0, _invariant2.default)(docId && typeof docId === 'string', 'Model.richDiff docId is required and should be a string');
                (0, _invariant2.default)(!field || typeof field === 'string', 'Model.richDiff field should be a string');
                (0, _invariant2.default)(Array.isArray(value), 'Model.richDiff value should be a array');

                doc = this.collectionSet.getOrCreateDoc(collectionName, docId);
                return _context26.abrupt('return', doc.richDiff(field, value));

              case 9:
              case 'end':
                return _context26.stop();
            }
          }
        }, _callee26, this);
      }));

      function richDiff(_x44, _x45) {
        return ref.apply(this, arguments);
      }

      return richDiff;
    }()
  }, {
    key: 'doc',
    value: function doc(collectionName, docId) {
      return this.collectionSet.getOrCreateDoc(collectionName, docId);
    }
  }, {
    key: 'query',
    value: function query(collectionName, expression) {
      return this.querySet.getOrCreateQuery(collectionName, expression);
    }
  }, {
    key: 'onProjections',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee27(newProjectionHashes) {
        var _this3 = this;

        var prevProjectionHashes, collectionNames;
        return _regenerator2.default.wrap(function _callee27$(_context27) {
          while (1) {
            switch (_context27.prev = _context27.next) {
              case 0:
                prevProjectionHashes = this.get('_app.projectionHashes');
                collectionNames = this.getCollectionNamesToClear(prevProjectionHashes, newProjectionHashes);

                if (this.storage) {
                  _context27.next = 4;
                  break;
                }

                return _context27.abrupt('return');

              case 4:
                return _context27.abrupt('return', _promise2.default.all(collectionNames.map(function (collectionName) {
                  return _this3.storage.clearCollection(collectionName);
                })));

              case 5:
              case 'end':
                return _context27.stop();
            }
          }
        }, _callee27, this);
      }));

      function onProjections(_x46) {
        return ref.apply(this, arguments);
      }

      return onProjections;
    }()
  }, {
    key: 'getCollectionNamesToClear',
    value: function getCollectionNamesToClear(prevProjectionHashes, newProjectionHashes) {
      var collectionNames = [];

      for (var collectionName in prevProjectionHashes) {
        if (collectionName === '_id') continue;

        var hash = prevProjectionHashes[collectionName];
        var newHash = newProjectionHashes[collectionName];

        if (!newHash || hash !== newHash) {
          collectionNames.push(collectionName);
        }
      }

      return collectionNames;
    }
  }, {
    key: 'send',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee28(message, forceSend) {
        var _this4 = this;

        return _regenerator2.default.wrap(function _callee28$(_context28) {
          while (1) {
            switch (_context28.prev = _context28.next) {
              case 0:
                if (!(!forceSend && (!this.inited || !this.online || !message.id))) {
                  _context28.next = 2;
                  break;
                }

                return _context28.abrupt('return');

              case 2:
                return _context28.abrupt('return', new _promise2.default(function (resolve, reject) {
                  var callback = function callback(err, value) {
                    if (err) return reject(err);

                    resolve(value);
                  };
                  var callbacks = _this4.callbacks[message.id];
                  if (!callbacks) callbacks = _this4.callbacks[message.id] = [];
                  callbacks.push(callback);

                  try {
                    _this4.channel.send(message);
                  } catch (err) {
                    console.error('Error while sending message', message, err);
                    // TODO: probably we should not reject here
                    reject(err);
                  }
                }));

              case 3:
              case 'end':
                return _context28.stop();
            }
          }
        }, _callee28, this);
      }));

      function send(_x47, _x48) {
        return ref.apply(this, arguments);
      }

      return send;
    }()
  }, {
    key: 'createOp',
    value: function createOp(opData) {
      var date = this.date();
      if (this.lastOpDate && this.lastOpDate >= date) date = this.lastOpDate + 1;
      this.lastOpDate = date;

      var op = {
        id: this.id(),
        source: this.source,
        date: date
      };

      return (0, _assign2.default)({}, opData, op);
    }
  }, {
    key: 'sendOp',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee29(opData) {
        var op;
        return _regenerator2.default.wrap(function _callee29$(_context29) {
          while (1) {
            switch (_context29.prev = _context29.next) {
              case 0:
                op = this.createOp(opData);
                return _context29.abrupt('return', this.send(op));

              case 2:
              case 'end':
                return _context29.stop();
            }
          }
        }, _callee29, this);
      }));

      function sendOp(_x49) {
        return ref.apply(this, arguments);
      }

      return sendOp;
    }()
  }, {
    key: 'syncDate',
    value: function syncDate(start, serverDate) {
      if (!serverDate) return;
      // TODO: could it be better?
      var now = Date.now();
      var requestTime = now - start;
      var halfRequestTime = Math.floor(requestTime / 2);
      var serverNow = serverDate + halfRequestTime;
      var dateDiff = serverNow - now;
      this.set('_app.dateDiff', dateDiff);
    }
  }, {
    key: 'date',
    value: function date() {
      return Date.now() + (this.get('_app.dateDiff') || 0);
    }
  }, {
    key: 'id',
    value: function id() {
      return _uuid2.default.v4();
    }
  }, {
    key: 'close',
    value: function close() {
      this.channel.close();
      if (this.storage && this.storage.close) this.storage.close();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.close();
    }
  }, {
    key: 'bundleJsonFromDom',
    value: function bundleJsonFromDom() {
      if (!this.getBundleJsonFromDom) return (0, _stringify2.default)({ collections: {} });

      try {
        return this.getBundleJsonFromDom();
      } catch (err) {
        console.error('Error while reading bundle from dom', err);
        return (0, _stringify2.default)({ collections: {} });
      }
    }
  }, {
    key: 'getBundleJson',
    value: function getBundleJson() {
      if (!_util.isServer) return this.bundleJsonFromDom();

      var bundle = {
        collections: this.collectionSet.bundle()
      };

      var json = (0, _stringify2.default)(bundle);
      json = json && json.replace(/<\//g, '<\\/');
      return json;
    }
  }, {
    key: 'unbundleData',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee30() {
        var json, bundle;
        return _regenerator2.default.wrap(function _callee30$(_context30) {
          while (1) {
            switch (_context30.prev = _context30.next) {
              case 0:
                if (!this.onBundleReady) {
                  _context30.next = 3;
                  break;
                }

                _context30.next = 3;
                return this.onBundleReady();

              case 3:
                if (this.getBundleJsonFromDom) {
                  _context30.next = 5;
                  break;
                }

                return _context30.abrupt('return');

              case 5:
                json = this.bundleJsonFromDom();
                bundle = JSON.parse(json);

                this.collectionSet.unbundle(bundle.collections);

              case 8:
              case 'end':
                return _context30.stop();
            }
          }
        }, _callee30, this);
      }));

      function unbundleData() {
        return ref.apply(this, arguments);
      }

      return unbundleData;
    }()
  }, {
    key: 'prepareBundle',
    value: function prepareBundle() {
      var options = this.options;
      var state = this.collectionSet.get();
      for (var collectionName in state) {
        var collectionOptions = options.collections[collectionName];
        if (!(0, _util.isLocalCollection)(collectionName) && (!collectionOptions || !collectionOptions.client)) {
          this.collectionSet.clearCollection(collectionName);
        }
      }
    }
  }]);
  return Model;
}(_events.EventEmitter);

exports.default = Model;
module.exports = exports['default'];