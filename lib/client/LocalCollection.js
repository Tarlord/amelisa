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

var _LocalDoc = require('./LocalDoc');

var _LocalDoc2 = _interopRequireDefault(_LocalDoc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LocalCollection = function (_Collection) {
  (0, _inherits3.default)(LocalCollection, _Collection);

  function LocalCollection(name, data, model) {
    (0, _classCallCheck3.default)(this, LocalCollection);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(LocalCollection).call(this, name, data, model));
  }

  (0, _createClass3.default)(LocalCollection, [{
    key: 'add',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(docId, docData) {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                (0, _get3.default)((0, _getPrototypeOf2.default)(LocalCollection.prototype), 'add', this).call(this, docId, docData);

              case 1:
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
    value: function attach(docId, ops) {
      var doc = new _LocalDoc2.default(docId, ops, this, this.model);

      this.data[docId] = doc;
      return doc;
    }
  }]);
  return LocalCollection;
}(_Collection3.default);

exports.default = LocalCollection;
module.exports = exports['default'];