'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dbName = 'amelisa';

var IndexedDbStorage = function () {
  function IndexedDbStorage(collectionNames, version) {
    (0, _classCallCheck3.default)(this, IndexedDbStorage);

    if (!collectionNames) collectionNames = JSON.parse(window.localStorage.getItem('collectionNames'));
    if (!collectionNames) throw new Error('IndexedDbStorage must has collectionNames');
    if (!version) version = window.localStorage.getItem('version');
    if (!version) throw new Error('IndexedDbStorage must has version');
    this.collectionNames = collectionNames;
    this.version = version;
  }

  (0, _createClass3.default)(IndexedDbStorage, [{
    key: 'getCollectionNames',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt('return', this.collectionNames);

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
    value: function getExistingCollectionNames() {
      return (0, _from2.default)(this.db.objectStoreNames);
    }
  }, {
    key: 'init',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        var _this = this;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt('return', new _promise2.default(function (resolve, reject) {
                  var request = window.indexedDB.open(dbName, _this.version);
                  request.onsuccess = function (event) {
                    _this.db = event.target.result;
                    var existingCollectionNames = _this.getExistingCollectionNames();
                    _this.existingCollectionNames = existingCollectionNames;
                    window.localStorage.setItem('version', _this.version);
                    window.localStorage.setItem('collectionNames', (0, _stringify2.default)(_this.collectionNames));
                    resolve(_this);
                  };
                  request.onupgradeneeded = function (event) {
                    _this.db = event.target.result;
                    var existingCollectionNames = _this.getExistingCollectionNames();
                    _this.existingCollectionNames = existingCollectionNames;
                    _this.db.onerror = function (event) {
                      console.trace('onerror upgrage', event);
                    };

                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                      for (var _iterator = (0, _getIterator3.default)(_this.collectionNames), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var collectionName = _step.value;

                        if (existingCollectionNames.indexOf(collectionName) > -1) continue;

                        var objectStore = _this.db.createObjectStore(collectionName, { keyPath: '_id' });
                        objectStore.transaction.oncomplete = function (e) {
                          // TODO: handle it
                        };
                        objectStore.transaction.onerror = function (e) {
                          console.trace('onerror', e);
                        };
                      }
                    } catch (err) {
                      _didIteratorError = true;
                      _iteratorError = err;
                    } finally {
                      try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                          _iterator.return();
                        }
                      } finally {
                        if (_didIteratorError) {
                          throw _iteratorError;
                        }
                      }
                    }
                  };
                  request.onerror = function (event) {
                    reject(event.target.webkitErrorMessage || event.target.error);
                  };
                }));

              case 1:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function init() {
        return ref.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: 'getObjectStore',
    value: function getObjectStore(collectionName, transactionType) {
      if ((0, _from2.default)(this.db.objectStoreNames).indexOf(collectionName) === -1) {
        console.trace('No colleciton ' + collectionName + ' in IndexedDB');
      }
      var transaction = this.db.transaction(collectionName, transactionType);
      return transaction.objectStore(collectionName);
    }
  }, {
    key: 'getAllDocs',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(collectionName) {
        var _this2 = this;

        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt('return', new _promise2.default(function (resolve, reject) {
                  var docs = [];
                  var objectStore = _this2.getObjectStore(collectionName, 'readonly');

                  var request = objectStore.openCursor();
                  request.onsuccess = function (event) {
                    var cursor = event.target.result;
                    if (cursor) {
                      docs.push(cursor.value);
                      cursor.continue();
                    } else {
                      resolve(docs);
                    }
                  };
                  request.onerror = function (event) {
                    reject(event.target.webkitErrorMessage || event.target.error);
                  };
                }));

              case 1:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getAllDocs(_x) {
        return ref.apply(this, arguments);
      }

      return getAllDocs;
    }()
  }, {
    key: 'clearCollection',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(collectionName) {
        var _this3 = this;

        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt('return', new _promise2.default(function (resolve, reject) {
                  var objectStore = _this3.getObjectStore(collectionName, 'readwrite');
                  var request = objectStore.clear();
                  request.onsuccess = function (event) {
                    resolve();
                  };
                  request.onerror = function (event) {
                    reject(event.target.webkitErrorMessage || event.target.error);
                  };
                }));

              case 1:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function clearCollection(_x2) {
        return ref.apply(this, arguments);
      }

      return clearCollection;
    }()
  }, {
    key: 'clear',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {
        var promises, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, collectionName;

        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                promises = [];
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context5.prev = 4;


                for (_iterator2 = (0, _getIterator3.default)(this.collectionNames); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  collectionName = _step2.value;

                  promises.push(this.clearCollection(collectionName));
                }

                _context5.next = 12;
                break;

              case 8:
                _context5.prev = 8;
                _context5.t0 = _context5['catch'](4);
                _didIteratorError2 = true;
                _iteratorError2 = _context5.t0;

              case 12:
                _context5.prev = 12;
                _context5.prev = 13;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }

              case 15:
                _context5.prev = 15;

                if (!_didIteratorError2) {
                  _context5.next = 18;
                  break;
                }

                throw _iteratorError2;

              case 18:
                return _context5.finish(15);

              case 19:
                return _context5.finish(12);

              case 20:
                return _context5.abrupt('return', _promise2.default.all(promises));

              case 21:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[4, 8, 12, 20], [13,, 15, 19]]);
      }));

      function clear() {
        return ref.apply(this, arguments);
      }

      return clear;
    }()
  }, {
    key: 'close',
    value: function close() {
      this.db.close();
    }
  }, {
    key: 'saveDoc',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(collectionName, docId, ops, serverVersion) {
        var _this4 = this;

        var doc;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                doc = {
                  _id: docId,
                  _ops: ops,
                  _sv: serverVersion
                };
                return _context6.abrupt('return', new _promise2.default(function (resolve, reject) {
                  var objectStore = _this4.getObjectStore(collectionName, 'readwrite');
                  var updateRequest = objectStore.put(doc);
                  updateRequest.onsuccess = function (event) {
                    resolve();
                  };
                  updateRequest.onerror = function (event) {
                    reject(event.target.webkitErrorMessage || event.target.error);
                  };
                }));

              case 2:
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
  return IndexedDbStorage;
}();

exports.default = IndexedDbStorage;
module.exports = exports['default'];