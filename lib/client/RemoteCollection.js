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

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _Collection2 = require('./Collection');

var _Collection3 = _interopRequireDefault(_Collection2);

var _RemoteDoc = require('./RemoteDoc');

var _RemoteDoc2 = _interopRequireDefault(_RemoteDoc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RemoteCollection = function (_Collection) {
  (0, _inherits3.default)(RemoteCollection, _Collection);

  function RemoteCollection(name, data, model) {
    (0, _classCallCheck3.default)(this, RemoteCollection);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(RemoteCollection).call(this, name, data, model));
  }

  (0, _createClass3.default)(RemoteCollection, [{
    key: 'add',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(docId, docData) {
        var doc, op;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                doc = (0, _get3.default)((0, _getPrototypeOf2.default)(RemoteCollection.prototype), 'add', this).call(this, docId, docData);

                doc.save();
                op = doc.ops[doc.ops.length - 1];
                _context.next = 5;
                return this.model.send(op);

              case 5:
                if (this.model.online) {
                  _context.next = 7;
                  break;
                }

                return _context.abrupt('return');

              case 7:
                doc.serverVersion = doc.addOpToVersion(doc.serverVersion, op);

              case 8:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function add(_x, _x2) {
        return ref.apply(this, arguments);
      }

      return add;
    }()
  }, {
    key: 'attach',
    value: function attach(docId, ops, serverVersion) {
      var doc = new _RemoteDoc2.default(docId, ops, this, this.model, serverVersion);

      this.data[docId] = doc;
      return doc;
    }
  }, {
    key: 'getSyncData',
    value: function getSyncData() {
      var data = {};

      for (var docId in this.data) {
        var doc = this.data[docId];
        var syncDocData = doc.getSyncData();
        if (syncDocData.version !== undefined || syncDocData.ops.length) {
          data[docId] = syncDocData;
        }
      }

      return data;
    }
  }]);
  return RemoteCollection;
}(_Collection3.default);

exports.default = RemoteCollection;
module.exports = exports['default'];