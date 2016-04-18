'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _reactNative = require('react-native');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AsyncStorage = function () {
  function AsyncStorage() {
    var collectionNames = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
    (0, _classCallCheck3.default)(this, AsyncStorage);

    this.data = {};
    this.collectionNames = collectionNames;
  }

  (0, _createClass3.default)(AsyncStorage, [{
    key: 'getCollectionNames',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt('return', this.existingCollectionNames);

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getCollectionNames() {
        return ref.apply(this, arguments);
      }

      return getCollectionNames;
    }()
  }, {
    key: 'getExistingCollectionNames',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt('return', _reactNative.AsyncStorage.getAllKeys());

              case 1:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getExistingCollectionNames() {
        return ref.apply(this, arguments);
      }

      return getExistingCollectionNames;
    }()
  }, {
    key: 'init',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, collectionName, collection, existingCollectionNames;

        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context3.prev = 3;
                _iterator = (0, _getIterator3.default)(this.collectionNames);

              case 5:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context3.next = 15;
                  break;
                }

                collectionName = _step.value;
                _context3.next = 9;
                return _reactNative.AsyncStorage.getItem(collectionName);

              case 9:
                collection = _context3.sent;

                if (collection) collection = JSON.parse(collection);
                this.data[collectionName] = collection || {};

              case 12:
                _iteratorNormalCompletion = true;
                _context3.next = 5;
                break;

              case 15:
                _context3.next = 21;
                break;

              case 17:
                _context3.prev = 17;
                _context3.t0 = _context3['catch'](3);
                _didIteratorError = true;
                _iteratorError = _context3.t0;

              case 21:
                _context3.prev = 21;
                _context3.prev = 22;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 24:
                _context3.prev = 24;

                if (!_didIteratorError) {
                  _context3.next = 27;
                  break;
                }

                throw _iteratorError;

              case 27:
                return _context3.finish(24);

              case 28:
                return _context3.finish(21);

              case 29:
                _context3.next = 31;
                return this.getExistingCollectionNames();

              case 31:
                existingCollectionNames = _context3.sent;

                this.existingCollectionNames = existingCollectionNames;

                // for (let collectionName of existingCollectionNames) {
                //   if (this.collectionNames.indexOf(collectionName) > -1) continue
                //   await this.removeCollection(collectionName)
                // }

              case 33:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[3, 17, 21, 29], [22,, 24, 28]]);
      }));

      function init() {
        return ref.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: 'clear',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return _reactNative.AsyncStorage.clear();

              case 2:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function clear() {
        return ref.apply(this, arguments);
      }

      return clear;
    }()
  }, {
    key: 'getOrCreateCollection',
    value: function getOrCreateCollection(collectionName) {
      var collection = this.data[collectionName];
      if (!collection) collection = this.data[collectionName] = {};
      return collection;
    }
  }, {
    key: 'getAllDocs',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(collectionName) {
        var collection, docs, docId;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                collection = this.getOrCreateCollection(collectionName);
                docs = [];

                for (docId in collection) {
                  docs.push(collection[docId]);
                }

                return _context5.abrupt('return', docs);

              case 4:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function getAllDocs(_x2) {
        return ref.apply(this, arguments);
      }

      return getAllDocs;
    }()
  }, {
    key: 'saveDoc',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(collectionName, docId, ops, serverVersion) {
        var doc, collection;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                doc = {
                  _id: docId,
                  _ops: ops,
                  _sv: serverVersion
                };
                collection = this.getOrCreateCollection(collectionName);

                collection[docId] = doc;

                collection = (0, _stringify2.default)(collection);
                _context6.next = 6;
                return _reactNative.AsyncStorage.setItem(collectionName, collection);

              case 6:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function saveDoc(_x3, _x4, _x5, _x6) {
        return ref.apply(this, arguments);
      }

      return saveDoc;
    }()
  }]);
  return AsyncStorage;
}();

exports.default = AsyncStorage;
module.exports = exports['default'];