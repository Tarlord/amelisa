'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _mongodb = require('mongodb');

var _MongoQueries2 = require('./MongoQueries');

var _MongoQueries3 = _interopRequireDefault(_MongoQueries2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MongoStorage = function (_MongoQueries) {
  (0, _inherits3.default)(MongoStorage, _MongoQueries);

  function MongoStorage(url) {
    (0, _classCallCheck3.default)(this, MongoStorage);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(MongoStorage).call(this));

    _this.url = url;
    return _this;
  }

  (0, _createClass3.default)(MongoStorage, [{
    key: 'init',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _mongodb.MongoClient.connect(this.url);

              case 2:
                this.db = _context.sent;

              case 3:
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
    key: 'clear',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.db.dropDatabase();

              case 2:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function clear() {
        return ref.apply(this, arguments);
      }

      return clear;
    }()
  }, {
    key: 'getDocById',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(collectionName, docId) {
        var query, collection;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                query = {
                  _id: docId
                };
                collection = this.db.collection(collectionName);
                return _context3.abrupt('return', collection.find(query).limit(1).next());

              case 3:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getDocById(_x, _x2) {
        return ref.apply(this, arguments);
      }

      return getDocById;
    }()
  }, {
    key: 'getDocsByQuery',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(collectionName, expression) {
        var query, collection, mapReduceOptions, cursor;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                query = this.normalizeQuery(expression);
                collection = this.db.collection(collectionName);

                if (!query.$count) {
                  _context4.next = 4;
                  break;
                }

                return _context4.abrupt('return', collection.count(query.$query || {}));

              case 4:
                if (!query.$distinct) {
                  _context4.next = 6;
                  break;
                }

                return _context4.abrupt('return', collection.distinct(query.$field, query.$query || {}));

              case 6:
                if (!query.$aggregate) {
                  _context4.next = 8;
                  break;
                }

                return _context4.abrupt('return', collection.aggregate(query.$aggregate).toArray());

              case 8:
                if (!query.$mapReduce) {
                  _context4.next = 11;
                  break;
                }

                mapReduceOptions = {
                  query: query.$query || {},
                  out: { inline: 1 },
                  scope: query.$scope || {}
                };
                return _context4.abrupt('return', collection.mapReduce(query.$map, query.$reduce, mapReduceOptions));

              case 11:
                cursor = collection.find(query.$query);


                if (query.$orderby) cursor = cursor.sort(query.$orderby);
                if (query.$skip) cursor = cursor.skip(query.$skip);
                if (query.$limit) cursor = cursor.limit(query.$limit);

                return _context4.abrupt('return', cursor.toArray());

              case 16:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getDocsByQuery(_x3, _x4) {
        return ref.apply(this, arguments);
      }

      return getDocsByQuery;
    }()
  }, {
    key: 'getOpsByQuery',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(collectionName) {
        var opsCollectionName;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                opsCollectionName = this.getOpsCollection(collectionName);
                return _context5.abrupt('return', this.db.collection(opsCollectionName).find({}).toArray());

              case 2:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function getOpsByQuery(_x5) {
        return ref.apply(this, arguments);
      }

      return getOpsByQuery;
    }()
  }, {
    key: 'saveOp',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(op) {
        var opsCollectionName;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                opsCollectionName = this.getOpsCollection(op.collectionName);
                return _context6.abrupt('return', this.db.collection(opsCollectionName).insert(op));

              case 2:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function saveOp(_x6) {
        return ref.apply(this, arguments);
      }

      return saveOp;
    }()
  }, {
    key: 'getOpsCollection',
    value: function getOpsCollection(collectionName) {
      return collectionName + '_ops';
    }
  }, {
    key: 'saveDoc',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(collectionName, docId, state, prevVersion, version, ops) {
        var query, update, key, options;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                query = {
                  _id: docId,
                  _v: prevVersion
                };
                update = {
                  $set: {
                    _ops: ops,
                    _v: version
                  }
                };


                for (key in state) {
                  update.$set[key] = state[key];
                }

                options = {
                  new: true
                };


                if (!prevVersion) {
                  options.upsert = true;
                }

                return _context7.abrupt('return', this.db.collection(collectionName).findAndModify(query, [], update, options).then(function (result) {
                  var doc = result.value;

                  // if there was no doc with previous version,
                  // it means that version changed and our data is stale
                  // let's load it, merge with current doc and save one more time
                  if (!doc) throw new Error('stale data');

                  return doc;
                }).catch(function (err) {
                  // if E11000 duplicate key error on _id field,
                  // it means that we inserted two docs with same _id.
                  // let's load saved doc from db, merge with current and save again
                  if (err.code === 11000 && err.message.indexOf('index: _id_ dup key') !== -1) {
                    throw new Error('stale data');
                  }

                  throw err;
                }));

              case 6:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function saveDoc(_x7, _x8, _x9, _x10, _x11, _x12) {
        return ref.apply(this, arguments);
      }

      return saveDoc;
    }()
  }, {
    key: 'getDbQueries',
    value: function getDbQueries() {
      return new _MongoQueries3.default();
    }
  }]);
  return MongoStorage;
}(_MongoQueries3.default);

exports.default = MongoStorage;
module.exports = exports['default'];