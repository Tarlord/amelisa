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

var _MongoQueries2 = require('./MongoQueries');

var _MongoQueries3 = _interopRequireDefault(_MongoQueries2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MemoryStorage = function (_MongoQueries) {
  (0, _inherits3.default)(MemoryStorage, _MongoQueries);

  function MemoryStorage() {
    (0, _classCallCheck3.default)(this, MemoryStorage);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(MemoryStorage).call(this));

    _this.data = {};
    return _this;
  }

  (0, _createClass3.default)(MemoryStorage, [{
    key: 'init',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
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
    key: 'getOrCreateCollection',
    value: function getOrCreateCollection(collectionName) {
      var collection = this.data[collectionName];
      if (!collection) {
        collection = this.data[collectionName] = {};
      }

      return collection;
    }
  }, {
    key: 'clear',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.data = {};

              case 1:
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
        var collection;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                collection = this.getOrCreateCollection(collectionName);
                return _context3.abrupt('return', collection[docId]);

              case 2:
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
        var collection, allDocs, docId, docs;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                collection = this.getOrCreateCollection(collectionName);
                allDocs = [];

                for (docId in collection) {
                  allDocs.push(collection[docId]);
                }

                docs = this.getQueryResultFromArray(allDocs, expression);
                return _context4.abrupt('return', docs);

              case 5:
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
    key: 'saveOp',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(op) {
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function saveOp(_x5) {
        return ref.apply(this, arguments);
      }

      return saveOp;
    }()
  }, {
    key: 'saveDoc',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(collectionName, docId, state, prevVersion, version, ops) {
        var doc, key, collection;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                doc = {
                  _id: docId,
                  _v: version,
                  _ops: ops
                };


                for (key in state) {
                  doc[key] = state[key];
                }

                collection = this.getOrCreateCollection(collectionName);

                collection[docId] = doc;

              case 4:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function saveDoc(_x6, _x7, _x8, _x9, _x10, _x11) {
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
  return MemoryStorage;
}(_MongoQueries3.default);

exports.default = MemoryStorage;
module.exports = exports['default'];