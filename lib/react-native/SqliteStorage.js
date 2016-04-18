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

var _reactNativeSqliteStorage = require('react-native-sqlite-storage');

var _reactNativeSqliteStorage2 = _interopRequireDefault(_reactNativeSqliteStorage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dbName = 'amelisa';

_reactNativeSqliteStorage2.default.enablePromise(true);

var SqliteStorage = function () {
  function SqliteStorage() {
    var collectionNames = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
    (0, _classCallCheck3.default)(this, SqliteStorage);

    this.collectionNames = collectionNames;
  }

  (0, _createClass3.default)(SqliteStorage, [{
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
    key: 'getQueryRows',
    value: function getQueryRows(args) {
      var results = args[0];
      var rows = [];
      for (var i = 0; i < results.rows.length; i++) {
        var row = results.rows.item(i);
        rows.push(row);
      }
      return rows;
    }
  }, {
    key: 'getExistingCollectionNames',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        var args, rows, collectionNames;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.db.executeSql('SELECT name FROM sqlite_master WHERE type=\'table\';');

              case 2:
                args = _context2.sent;
                rows = this.getQueryRows(args);
                collectionNames = rows.map(function (row) {
                  return row.name;
                }).filter(function (row) {
                  return row !== 'android_metadata';
                });
                return _context2.abrupt('return', collectionNames);

              case 6:
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
    key: 'createCollection',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(collectionName) {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt('return', this.db.executeSql('CREATE TABLE ' + collectionName + ' (_id TEXT PRIMARY KEY, data TEXT);'));

              case 1:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function createCollection(_x2) {
        return ref.apply(this, arguments);
      }

      return createCollection;
    }()
  }, {
    key: 'removeCollection',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(collectionName) {
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt('return', this.db.executeSql('DROP TABLE ' + collectionName));

              case 1:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function removeCollection(_x3) {
        return ref.apply(this, arguments);
      }

      return removeCollection;
    }()
  }, {
    key: 'init',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {
        var db, existingCollectionNames, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, collectionName;

        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return _reactNativeSqliteStorage2.default.openDatabase(dbName, '1.0', 'Amelisa Database', 200000);

              case 2:
                db = _context5.sent;

                this.db = db;

                _context5.next = 6;
                return this.getExistingCollectionNames();

              case 6:
                existingCollectionNames = _context5.sent;
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context5.prev = 10;
                _iterator = (0, _getIterator3.default)(this.collectionNames);

              case 12:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context5.next = 22;
                  break;
                }

                collectionName = _step.value;

                if (!(existingCollectionNames.indexOf(collectionName) > -1)) {
                  _context5.next = 16;
                  break;
                }

                return _context5.abrupt('continue', 19);

              case 16:
                _context5.next = 18;
                return this.createCollection(collectionName);

              case 18:
                existingCollectionNames.push(collectionName);

              case 19:
                _iteratorNormalCompletion = true;
                _context5.next = 12;
                break;

              case 22:
                _context5.next = 28;
                break;

              case 24:
                _context5.prev = 24;
                _context5.t0 = _context5['catch'](10);
                _didIteratorError = true;
                _iteratorError = _context5.t0;

              case 28:
                _context5.prev = 28;
                _context5.prev = 29;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 31:
                _context5.prev = 31;

                if (!_didIteratorError) {
                  _context5.next = 34;
                  break;
                }

                throw _iteratorError;

              case 34:
                return _context5.finish(31);

              case 35:
                return _context5.finish(28);

              case 36:

                this.existingCollectionNames = existingCollectionNames;

                // for (let collectionName of existingCollectionNames) {
                //   if (this.collectionNames.indexOf(collectionName) > -1) continue
                //   await this.removeCollection(collectionName)
                // }

              case 37:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[10, 24, 28, 36], [29,, 31, 35]]);
      }));

      function init() {
        return ref.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: 'clear',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6() {
        var existingCollectionNames, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, collectionName;

        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return this.getExistingCollectionNames();

              case 2:
                existingCollectionNames = _context6.sent;
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context6.prev = 6;
                _iterator2 = (0, _getIterator3.default)(existingCollectionNames);

              case 8:
                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                  _context6.next = 15;
                  break;
                }

                collectionName = _step2.value;
                _context6.next = 12;
                return this.removeCollection(collectionName);

              case 12:
                _iteratorNormalCompletion2 = true;
                _context6.next = 8;
                break;

              case 15:
                _context6.next = 21;
                break;

              case 17:
                _context6.prev = 17;
                _context6.t0 = _context6['catch'](6);
                _didIteratorError2 = true;
                _iteratorError2 = _context6.t0;

              case 21:
                _context6.prev = 21;
                _context6.prev = 22;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }

              case 24:
                _context6.prev = 24;

                if (!_didIteratorError2) {
                  _context6.next = 27;
                  break;
                }

                throw _iteratorError2;

              case 27:
                return _context6.finish(24);

              case 28:
                return _context6.finish(21);

              case 29:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this, [[6, 17, 21, 29], [22,, 24, 28]]);
      }));

      function clear() {
        return ref.apply(this, arguments);
      }

      return clear;
    }()
  }, {
    key: 'getAllDocs',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(collectionName) {
        var args, rows, docs, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, row, doc;

        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this.db.executeSql('SELECT * FROM ' + collectionName);

              case 2:
                args = _context7.sent;
                rows = this.getQueryRows(args);
                docs = [];
                _iteratorNormalCompletion3 = true;
                _didIteratorError3 = false;
                _iteratorError3 = undefined;
                _context7.prev = 8;
                _iterator3 = (0, _getIterator3.default)(rows);

              case 10:
                if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                  _context7.next = 19;
                  break;
                }

                row = _step3.value;

                if (row.data) {
                  _context7.next = 14;
                  break;
                }

                return _context7.abrupt('continue', 16);

              case 14:
                doc = JSON.parse(row.data);

                docs.push(doc);

              case 16:
                _iteratorNormalCompletion3 = true;
                _context7.next = 10;
                break;

              case 19:
                _context7.next = 25;
                break;

              case 21:
                _context7.prev = 21;
                _context7.t0 = _context7['catch'](8);
                _didIteratorError3 = true;
                _iteratorError3 = _context7.t0;

              case 25:
                _context7.prev = 25;
                _context7.prev = 26;

                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }

              case 28:
                _context7.prev = 28;

                if (!_didIteratorError3) {
                  _context7.next = 31;
                  break;
                }

                throw _iteratorError3;

              case 31:
                return _context7.finish(28);

              case 32:
                return _context7.finish(25);

              case 33:
                return _context7.abrupt('return', docs);

              case 34:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this, [[8, 21, 25, 33], [26,, 28, 32]]);
      }));

      function getAllDocs(_x4) {
        return ref.apply(this, arguments);
      }

      return getAllDocs;
    }()
  }, {
    key: 'saveDoc',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(collectionName, docId, ops, serverVersion) {
        var doc, data;
        return _regenerator2.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                doc = {
                  _id: docId,
                  _ops: ops,
                  _sv: serverVersion
                };
                data = (0, _stringify2.default)(doc);

                // escape single quote character in SQL by doubling it

                data = data.replace(/'/g, "''");

                _context8.next = 5;
                return this.db.executeSql('INSERT OR REPLACE INTO ' + collectionName + ' (_id, data) VALUES (\'' + docId + '\', \'' + data + '\')');

              case 5:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function saveDoc(_x5, _x6, _x7, _x8) {
        return ref.apply(this, arguments);
      }

      return saveDoc;
    }()
  }]);
  return SqliteStorage;
}();

exports.default = SqliteStorage;
module.exports = exports['default'];