'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _LocalCollection = require('./LocalCollection');

var _LocalCollection2 = _interopRequireDefault(_LocalCollection);

var _RemoteCollection = require('./RemoteCollection');

var _RemoteCollection2 = _interopRequireDefault(_RemoteCollection);

var _util = require('../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CollectionSet = function () {
  function CollectionSet(model) {
    var data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    (0, _classCallCheck3.default)(this, CollectionSet);

    this.model = model;
    this.data = data;
  }

  (0, _createClass3.default)(CollectionSet, [{
    key: 'get',
    value: function get(collectionName, docId, field) {
      if (!collectionName) {
        var state = {};
        for (var _collectionName in this.data) {
          state[_collectionName] = this.data[_collectionName].get();
        }
        return state;
      }

      var collection = this.data[collectionName];
      if (collection) return collection.get(docId, field);
    }
  }, {
    key: 'getCollection',
    value: function getCollection(collectionName) {
      var collection = this.data[collectionName];

      return collection;
    }
  }, {
    key: 'getOrCreateCollection',
    value: function getOrCreateCollection(collectionName) {
      var collection = this.data[collectionName];

      if (!collection) {
        if ((0, _util.isLocalCollection)(collectionName)) {
          collection = new _LocalCollection2.default(collectionName, undefined, this.model);
        } else {
          collection = new _RemoteCollection2.default(collectionName, undefined, this.model);
        }
        this.data[collectionName] = collection;
      }

      return collection;
    }
  }, {
    key: 'getDoc',
    value: function getDoc(collectionName, docId) {
      var collection = this.getCollection(collectionName);
      if (collection) {
        return collection.getDoc(docId);
      }
    }
  }, {
    key: 'getOrCreateDoc',
    value: function getOrCreateDoc(collectionName, docId) {
      var doc = this.getDoc(collectionName, docId);
      if (!doc) {
        var collection = this.getOrCreateCollection(collectionName);
        doc = collection.attach(docId, []);
      }
      return doc;
    }
  }, {
    key: 'clearCollection',
    value: function clearCollection(collectionName) {
      delete this.data[collectionName];
    }
  }, {
    key: 'fillLocalCollectionsFromClientStorage',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var collectionNames, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, collectionName, collection;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (this.model.storage) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt('return');

              case 2:
                _context.next = 4;
                return this.model.storage.getCollectionNames();

              case 4:
                collectionNames = _context.sent;
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context.prev = 8;
                _iterator = (0, _getIterator3.default)(collectionNames);

              case 10:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context.next = 20;
                  break;
                }

                collectionName = _step.value;

                if ((0, _util.isLocalCollection)(collectionName)) {
                  _context.next = 14;
                  break;
                }

                return _context.abrupt('continue', 17);

              case 14:
                collection = this.getOrCreateCollection(collectionName);
                _context.next = 17;
                return collection.fillFromClientStorage();

              case 17:
                _iteratorNormalCompletion = true;
                _context.next = 10;
                break;

              case 20:
                _context.next = 26;
                break;

              case 22:
                _context.prev = 22;
                _context.t0 = _context['catch'](8);
                _didIteratorError = true;
                _iteratorError = _context.t0;

              case 26:
                _context.prev = 26;
                _context.prev = 27;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 29:
                _context.prev = 29;

                if (!_didIteratorError) {
                  _context.next = 32;
                  break;
                }

                throw _iteratorError;

              case 32:
                return _context.finish(29);

              case 33:
                return _context.finish(26);

              case 34:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[8, 22, 26, 34], [27,, 29, 33]]);
      }));

      function fillLocalCollectionsFromClientStorage() {
        return ref.apply(this, arguments);
      }

      return fillLocalCollectionsFromClientStorage;
    }()
  }, {
    key: 'fillFromClientStorage',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        var collectionNames, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, collectionName, collection;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (this.model.storage) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt('return');

              case 2:
                _context2.next = 4;
                return this.model.storage.getCollectionNames();

              case 4:
                collectionNames = _context2.sent;
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context2.prev = 8;
                _iterator2 = (0, _getIterator3.default)(collectionNames);

              case 10:
                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                  _context2.next = 18;
                  break;
                }

                collectionName = _step2.value;
                collection = this.getOrCreateCollection(collectionName);
                _context2.next = 15;
                return collection.fillFromClientStorage();

              case 15:
                _iteratorNormalCompletion2 = true;
                _context2.next = 10;
                break;

              case 18:
                _context2.next = 24;
                break;

              case 20:
                _context2.prev = 20;
                _context2.t0 = _context2['catch'](8);
                _didIteratorError2 = true;
                _iteratorError2 = _context2.t0;

              case 24:
                _context2.prev = 24;
                _context2.prev = 25;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }

              case 27:
                _context2.prev = 27;

                if (!_didIteratorError2) {
                  _context2.next = 30;
                  break;
                }

                throw _iteratorError2;

              case 30:
                return _context2.finish(27);

              case 31:
                return _context2.finish(24);

              case 32:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[8, 20, 24, 32], [25,, 27, 31]]);
      }));

      function fillFromClientStorage() {
        return ref.apply(this, arguments);
      }

      return fillFromClientStorage;
    }()
  }, {
    key: 'rejectOp',
    value: function rejectOp(collectionName, docId, opId) {
      var doc = this.getOrCreateDoc(collectionName, docId);
      doc.rejectOp(opId);
    }
  }, {
    key: 'getSyncData',
    value: function getSyncData() {
      var data = {};

      for (var collectionName in this.data) {
        if ((0, _util.isLocalCollection)(collectionName)) continue;
        var collection = this.data[collectionName];
        data[collectionName] = collection.getSyncData();
      }

      return data;
    }
  }, {
    key: 'bundle',
    value: function bundle() {
      var data = {};

      for (var collectionName in this.data) {
        var collection = this.data[collectionName];
        data[collectionName] = collection.bundle();
      }

      return data;
    }
  }, {
    key: 'unbundle',
    value: function unbundle(data) {
      for (var collectionName in data) {
        var collection = this.getOrCreateCollection(collectionName);
        var collectionBundle = data[collectionName];
        collection.unbundle(collectionBundle);
      }
    }
  }]);
  return CollectionSet;
}();

exports.default = CollectionSet;
module.exports = exports['default'];