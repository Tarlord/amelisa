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

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _ServerQuery2 = require('./ServerQuery');

var _ServerQuery3 = _interopRequireDefault(_ServerQuery2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ProjectedQuery = function (_ServerQuery) {
  (0, _inherits3.default)(ProjectedQuery, _ServerQuery);

  function ProjectedQuery(collectionName, projection, expression, store, querySet) {
    (0, _classCallCheck3.default)(this, ProjectedQuery);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ProjectedQuery).call(this, projection.dbCollectionName, expression, store, querySet));

    _this.projectionCollectionName = collectionName;
    _this.projection = projection;
    return _this;
  }

  (0, _createClass3.default)(ProjectedQuery, [{
    key: 'sendOp',
    value: function sendOp(op, channel) {
      var _this2 = this;

      if (op.collectionName) op.collectionName = this.projectionCollectionName;

      if ((op.type === 'q' || op.type === 'qdiff') && this.isDocs) {
        var projectedDocs = {};
        for (var docId in op.docOps) {
          var ops = op.docOps[docId];
          var projectedOps = ops.map(function (docOp) {
            return _this2.projection.projectOp(docOp);
          });
          projectedDocs[docId] = projectedOps;
        }
        op.docOps = projectedDocs;
      }

      (0, _get3.default)((0, _getPrototypeOf2.default)(ProjectedQuery.prototype), 'sendOp', this).call(this, op, channel);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.querySet.unattach(this.projectionCollectionName, this.originalExpression);
    }
  }]);
  return ProjectedQuery;
}(_ServerQuery3.default);

exports.default = ProjectedQuery;
module.exports = exports['default'];