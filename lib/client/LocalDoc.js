'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _MutableDoc2 = require('./MutableDoc');

var _MutableDoc3 = _interopRequireDefault(_MutableDoc2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LocalDoc = function (_MutableDoc) {
  (0, _inherits3.default)(LocalDoc, _MutableDoc);

  function LocalDoc(docId, ops, collection, model) {
    (0, _classCallCheck3.default)(this, LocalDoc);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(LocalDoc).call(this, docId, ops, collection, model));
  }

  return LocalDoc;
}(_MutableDoc3.default);

exports.default = LocalDoc;
module.exports = exports['default'];