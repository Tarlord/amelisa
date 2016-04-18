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

var _ClientQuery2 = require('./ClientQuery');

var _ClientQuery3 = _interopRequireDefault(_ClientQuery2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LocalQuery = function (_ClientQuery) {
  (0, _inherits3.default)(LocalQuery, _ClientQuery);

  function LocalQuery(collectionName, expression, model, collection, querySet) {
    (0, _classCallCheck3.default)(this, LocalQuery);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(LocalQuery).call(this, collectionName, expression, model, collection, querySet));
  }

  return LocalQuery;
}(_ClientQuery3.default);

exports.default = LocalQuery;
module.exports = exports['default'];