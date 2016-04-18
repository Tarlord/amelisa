'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

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

var _Doc = require('./Doc');

var _Doc2 = _interopRequireDefault(_Doc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Collection = function (_EventEmitter) {
  (0, _inherits3.default)(Collection, _EventEmitter);

  function Collection(name) {
    var data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var model = arguments[2];
    (0, _classCallCheck3.default)(this, Collection);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Collection).call(this));

    _this.name = name;
    _this.data = data;
    _this.model = model;

    // all collection queries listen to collection change event
    _this.setMaxListeners(0);
    return _this;
  }

  (0, _createClass3.default)(Collection, [{
    key: 'get',
    value: function get(docId, field) {
      if (!docId) {
        var state = {};
        for (var _docId in this.data) {
          state[_docId] = this.data[_docId].get();
        }
        return state;
      }

      var doc = this.data[docId];
      if (doc) return doc.get(field);
    }
  }, {
    key: 'getDoc',
    value: function getDoc(docId) {
      return this.data[docId];
    }
  }, {
    key: 'getDocs',
    value: function getDocs() {
      var docs = [];
      for (var docId in this.data) {
        var doc = this.data[docId].get();
        if (doc) docs.push(doc);
      }
      return docs;
    }
  }, {
    key: 'add',
    value: function add(docId, docData) {
      var op = this.model.createOp({
        type: 'add',
        collectionName: this.name,
        docId: docId,
        value: docData
      });

      var doc = this.getDoc(docId);
      if (!doc) doc = this.attach(docId, []);
      doc.applyOp(op);

      doc.emit('change');
      this.emit('change', op);
      return doc;
    }
  }, {
    key: 'unattach',
    value: function unattach(docId) {
      delete this.data[docId];
    }
  }, {
    key: 'bundle',
    value: function bundle() {
      var data = {};

      for (var docId in this.data) {
        var doc = this.data[docId];
        data[docId] = doc.bundle();
      }

      return data;
    }
  }, {
    key: 'unbundle',
    value: function unbundle(data) {
      for (var docId in data) {
        var ops = data[docId].ops;

        var serverVersion = _Doc2.default.prototype.getVersionFromOps(ops);
        var doc = this.applyOpsOrAttach(docId, ops, serverVersion);
        doc.save();
      }
    }
  }, {
    key: 'fillFromClientStorage',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var _this2 = this;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt('return', new _promise2.default(function (resolve, reject) {
                  _this2.model.storage.getAllDocs(_this2.name).then(function (docs) {
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                      for (var _iterator = (0, _getIterator3.default)(docs), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var doc = _step.value;

                        _this2.applyOpsOrAttach(doc._id, doc._ops, doc._sv);
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

                    resolve();
                  }).catch(function (err) {
                    console.error('Collection.fillFromClientStorage', _this2.name, err);

                    // TODO: remove collection if was not able to read from it
                    // Resolve anyway
                    resolve();
                  });
                }));

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function fillFromClientStorage() {
        return ref.apply(this, arguments);
      }

      return fillFromClientStorage;
    }()
  }, {
    key: 'applyOpsOrAttach',
    value: function applyOpsOrAttach(docId, ops, serverVersion) {
      var doc = this.getDoc(docId);
      if (doc) {
        doc.applyOps(ops);
        doc.serverVersion = serverVersion;
      } else {
        doc = this.attach(docId, ops, serverVersion);
      }
      return doc;
    }
  }]);
  return Collection;
}(_events.EventEmitter);

exports.default = Collection;
module.exports = exports['default'];