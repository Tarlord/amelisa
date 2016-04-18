'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _ProjectedQuery = require('./ProjectedQuery');

var _ProjectedQuery2 = _interopRequireDefault(_ProjectedQuery);

var _ServerJoinQuery2 = require('./ServerJoinQuery');

var _ServerJoinQuery3 = _interopRequireDefault(_ServerJoinQuery2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ProjectedJoinQuery = function (_ServerJoinQuery) {
  (0, _inherits3.default)(ProjectedJoinQuery, _ServerJoinQuery);

  function ProjectedJoinQuery(collectionName, projection, expression, store, querySet, joinFields) {
    (0, _classCallCheck3.default)(this, ProjectedJoinQuery);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ProjectedJoinQuery).call(this, projection.dbCollectionName, expression, store, querySet, joinFields));

    _this.projectionCollectionName = collectionName;
    _this.projection = projection;
    return _this;
  }

  (0, _createClass3.default)(ProjectedJoinQuery, [{
    key: 'sendOp',
    value: function sendOp(op, channel) {
      _ProjectedQuery2.default.prototype.sendOp.call(this, op, channel);
    }
  }, {
    key: 'maybeUnattach',
    value: function maybeUnattach() {
      _ProjectedQuery2.default.prototype.maybeUnattach.call(this);
    }
  }]);
  return ProjectedJoinQuery;
}(_ServerJoinQuery3.default);

exports.default = ProjectedJoinQuery;
module.exports = exports['default'];