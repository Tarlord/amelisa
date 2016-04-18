'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

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

var _ServerDoc2 = require('./ServerDoc');

var _ServerDoc3 = _interopRequireDefault(_ServerDoc2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ProjectedDoc = function (_ServerDoc) {
  (0, _inherits3.default)(ProjectedDoc, _ServerDoc);

  function ProjectedDoc(collectionName, projection, docId, ops, store, docSet) {
    (0, _classCallCheck3.default)(this, ProjectedDoc);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ProjectedDoc).call(this, projection.dbCollectionName, docId, ops, store, docSet));

    _this.projectionCollectionName = collectionName;
    _this.projection = projection;
    return _this;
  }

  (0, _createClass3.default)(ProjectedDoc, [{
    key: 'onOp',
    value: function onOp(op, channel) {
      op = (0, _assign2.default)({}, op);

      var error = this.projection.validateOp(op);
      if (error) {
        op = {
          ackId: op.id,
          collectionName: this.projectionCollectionName,
          docId: this.docId,
          error: error
        };
        return this.sendOp(op, channel);
      }

      if (op.collectionName) op.collectionName = this.collectionName;

      (0, _get3.default)((0, _getPrototypeOf2.default)(ProjectedDoc.prototype), 'onOp', this).call(this, op, channel);
    }
  }, {
    key: 'receiveOp',
    value: function receiveOp(op) {
      op = this.projection.projectOp(op);
      (0, _get3.default)((0, _getPrototypeOf2.default)(ProjectedDoc.prototype), 'receiveOp', this).call(this, op);
    }
  }, {
    key: 'sendOp',
    value: function sendOp(op, channel) {
      var _this2 = this;

      if (op.collectionName) op.collectionName = this.projectionCollectionName;

      if (op.type === 'add' || op.type === 'set' || op.type === 'del') {
        op = this.projection.projectOp(op);
      } else if (op.type === 'fetch' || op.type === 'sub') {
        op.ops = op.ops.map(function (docOp) {
          return _this2.projection.projectOp(docOp);
        });
      }

      if (op) (0, _get3.default)((0, _getPrototypeOf2.default)(ProjectedDoc.prototype), 'sendOp', this).call(this, op, channel);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.docSet.unattach(this.projectionCollectionName, this.docId);
    }
  }]);
  return ProjectedDoc;
}(_ServerDoc3.default);

exports.default = ProjectedDoc;
module.exports = exports['default'];