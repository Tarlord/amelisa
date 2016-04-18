'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _eventToPromise = require('event-to-promise');

var _eventToPromise2 = _interopRequireDefault(_eventToPromise);

var _ProjectedQuery = require('./ProjectedQuery');

var _ProjectedQuery2 = _interopRequireDefault(_ProjectedQuery);

var _ProjectedJoinQuery = require('./ProjectedJoinQuery');

var _ProjectedJoinQuery2 = _interopRequireDefault(_ProjectedJoinQuery);

var _ServerJoinQuery = require('./ServerJoinQuery');

var _ServerJoinQuery2 = _interopRequireDefault(_ServerJoinQuery);

var _ServerQuery = require('./ServerQuery');

var _ServerQuery2 = _interopRequireDefault(_ServerQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ServerQuerySet = function () {
  function ServerQuerySet(store) {
    (0, _classCallCheck3.default)(this, ServerQuerySet);

    this.store = store;
    this.data = {};
  }

  (0, _createClass3.default)(ServerQuerySet, [{
    key: 'getOrCreateQuery',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(collectionName, expression) {
        var hash, query, isJoinQuery, projection, joinFields, _joinFields;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                hash = this.getQueryHash(collectionName, expression);
                query = this.data[hash];


                if (!query) {
                  isJoinQuery = this.store.dbQueries.isJoinQuery(expression);
                  projection = this.store.projections[collectionName];

                  if (projection && !isJoinQuery) {
                    query = new _ProjectedQuery2.default(collectionName, projection, expression, this.store, this);
                  } else if (projection && isJoinQuery) {
                    joinFields = this.store.dbQueries.getJoinFields(expression);

                    query = new _ProjectedJoinQuery2.default(collectionName, projection, expression, this.store, this, joinFields);
                  } else if (isJoinQuery) {
                    _joinFields = this.store.dbQueries.getJoinFields(expression);

                    query = new _ServerJoinQuery2.default(collectionName, expression, this.store, this, _joinFields);
                  } else {
                    query = new _ServerQuery2.default(collectionName, expression, this.store, this);
                  }

                  this.data[hash] = query;
                }

                if (!query.loaded) {
                  _context.next = 5;
                  break;
                }

                return _context.abrupt('return', query);

              case 5:
                _context.next = 7;
                return (0, _eventToPromise2.default)(query, 'loaded');

              case 7:
                return _context.abrupt('return', query);

              case 8:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getOrCreateQuery(_x, _x2) {
        return ref.apply(this, arguments);
      }

      return getOrCreateQuery;
    }()
  }, {
    key: 'unattach',
    value: function unattach(collectionName, expression) {
      var hash = this.getQueryHash(collectionName, expression);
      delete this.data[hash];
    }
  }, {
    key: 'channelClose',
    value: function channelClose(channel) {
      for (var hash in this.data) {
        var query = this.data[hash];

        query.unsubscribe(channel);
      }
    }
  }, {
    key: 'onOp',
    value: function onOp(op) {
      var _this = this;

      var _loop = function _loop(hash) {
        var query = _this.data[hash];
        if (query.collectionName === op.collectionName || query.projectionCollectionName === op.collectionName) {
          // if query is loading now, we need to load it one more time with new data
          if (query.loading) {
            query.once('loaded', function () {
              query.load();
            });
          } else {
            query.load();
          }
        }
      };

      for (var hash in this.data) {
        _loop(hash);
      }
    }
  }, {
    key: 'getQueryHash',
    value: function getQueryHash(collectionName, expression) {
      var args = [collectionName, expression];
      return (0, _stringify2.default)(args).replace(/\./g, '|');
    }
  }]);
  return ServerQuerySet;
}();

exports.default = ServerQuerySet;
module.exports = exports['default'];