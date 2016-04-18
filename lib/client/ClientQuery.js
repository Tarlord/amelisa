'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

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

var _Query2 = require('./Query');

var _Query3 = _interopRequireDefault(_Query2);

var _RemoteDoc = require('./RemoteDoc');

var _RemoteDoc2 = _interopRequireDefault(_RemoteDoc);

var _util = require('../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ClientQuery = function (_Query) {
  (0, _inherits3.default)(ClientQuery, _Query);

  function ClientQuery(collectionName, expression, model, collection, querySet) {
    (0, _classCallCheck3.default)(this, ClientQuery);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ClientQuery).call(this, collectionName, expression));

    _this.onCollectionChange = function (op) {
      if (!_this.subscribing) _this.refresh(op);
    };

    if (!expression) expression = _this.model.dbQueries.getAllSelector();
    _this.expression = expression;
    _this.model = model;
    _this.collection = collection;
    _this.querySet = querySet;
    _this.isDocs = _this.model.dbQueries.isDocsQuery(expression);

    _this.refresh();
    return _this;
  }

  (0, _createClass3.default)(ClientQuery, [{
    key: 'fetch',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.refresh();

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function fetch() {
        return ref.apply(this, arguments);
      }

      return fetch;
    }()
  }, {
    key: 'subscribe',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.refresh();
                this.collection.on('change', this.onCollectionChange);

              case 2:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function subscribe() {
        return ref.apply(this, arguments);
      }

      return subscribe;
    }()
  }, {
    key: 'unsubscribe',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                this.collection.removeListener('change', this.onCollectionChange);

              case 1:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function unsubscribe() {
        return ref.apply(this, arguments);
      }

      return unsubscribe;
    }()
  }, {
    key: 'fetchAndGet',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.fetch();

              case 2:
                return _context4.abrupt('return', this.get());

              case 3:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function fetchAndGet() {
        return ref.apply(this, arguments);
      }

      return fetchAndGet;
    }()
  }, {
    key: 'getStateFromDocData',
    value: function getStateFromDocData(doc) {
      var state = {};
      for (var field in doc) {
        if (!_util.dbFields[field]) state[field] = doc[field];
      }
      return state;
    }
  }, {
    key: 'getStatesFromDocs',
    value: function getStatesFromDocs(docs) {
      var _this2 = this;

      if (!this.isDocs) return docs;
      return docs.map(function (doc) {
        return _this2.getStateFromDocData(doc);
      });
    }
  }, {
    key: 'attachDocsToCollection',
    value: function attachDocsToCollection(docs) {
      for (var docId in docs) {
        var ops = docs[docId];
        var serverVersion = _RemoteDoc2.default.prototype.getVersionFromOps(ops);
        var doc = this.collection.getDoc(docId);
        if (doc) {
          doc.applyOps(ops);
          doc.distillOps();
          doc.serverVersion = serverVersion;
        } else {
          doc = this.collection.attach(docId, ops, serverVersion);
        }
        doc.save();
      }
    }
  }, {
    key: 'refresh',
    value: function refresh() {
      var prevData = this.data;

      var docs = this.collection.getDocs();
      var docDatas = this.model.dbQueries.getQueryResultFromArray(docs, this.expression);
      if (this.isDocs) {
        this.data = docDatas.map(function (docData) {
          return docData._id;
        });
      } else {
        this.data = docDatas;
      }

      if (this.dataHasChanged(prevData, this.data)) {
        this.emit('change');
      }
    }
  }, {
    key: 'dataHasChanged',
    value: function dataHasChanged(prev, data) {
      if ((typeof prev === 'undefined' ? 'undefined' : (0, _typeof3.default)(prev)) !== (typeof data === 'undefined' ? 'undefined' : (0, _typeof3.default)(data))) return true;

      if (this.model.dbQueries.isDocsQuery) {
        // there is no cheap way to compare all query docs, so for now
        // we always emit change
        return true;
      } else {
        // count query
        if (typeof prev === 'number' && typeof data === 'number') {
          return prev !== data;
        }
        // aggregation
        if ((typeof prev === 'undefined' ? 'undefined' : (0, _typeof3.default)(prev)) === 'object' && (typeof data === 'undefined' ? 'undefined' : (0, _typeof3.default)(data)) === 'object') {
          // cheap keys comparison
          if ((0, _keys2.default)(prev).length !== (0, _keys2.default)(data).length) return true;
        }
      }
      // expensive deep comparison
      return !(0, _util.fastEqual)(prev, data);
    }
  }]);
  return ClientQuery;
}(_Query3.default);

exports.default = ClientQuery;
module.exports = exports['default'];