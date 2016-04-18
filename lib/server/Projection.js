'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _util = require('../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Projection = function () {
  function Projection(collectionName, dbCollectionName) {
    var fields = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
    (0, _classCallCheck3.default)(this, Projection);

    this.collectionName = collectionName;
    this.dbCollectionName = dbCollectionName;
    this.inclusive = this.validate(fields);
    this.fields = fields;
  }

  (0, _createClass3.default)(Projection, [{
    key: 'getHash',
    value: function getHash() {
      var _this = this;

      var fieldList = (0, _keys2.default)(this.fields);

      fieldList.sort();
      return fieldList.map(function (field) {
        return field + ':' + _this.fields[field];
      }).join(',');
    }
  }, {
    key: 'validate',
    value: function validate(fields) {
      (0, _invariant2.default)(fields, 'Fields are required');
      (0, _invariant2.default)((typeof fields === 'undefined' ? 'undefined' : (0, _typeof3.default)(fields)) === 'object', 'Fields should be an object');
      (0, _invariant2.default)((0, _keys2.default)(fields).length, 'Fields object can not be empty');

      var inclusive = void 0;

      for (var field in fields) {
        var value = fields[field];
        if (inclusive !== undefined) {
          (0, _invariant2.default)(inclusive === value, 'All fields should be true or all fields should be false');
        } else {
          inclusive = value;
        }
      }

      if (inclusive) (0, _invariant2.default)(fields['_id'], 'Inclusive projection should has field _id');
      if (!inclusive) (0, _invariant2.default)(fields['_id'] === undefined, 'Exclusive projection should not has field _id');

      return inclusive;
    }
  }, {
    key: 'projectDoc',
    value: function projectDoc(doc) {
      var projectedDoc = {
        _id: doc._id
      };

      if (this.inclusive) {
        for (var field in this.fields) {
          projectedDoc[field] = doc[field];
        }
        for (var _field in _util.dbFields) {
          if (doc[_field]) projectedDoc[_field] = doc[_field];
        }
      } else {
        for (var _field2 in doc) {
          if (this.fields[_field2] !== false || _util.dbFields[_field2]) {
            projectedDoc[_field2] = doc[_field2];
          }
        }
      }

      var projectedOps = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(doc._ops), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var op = _step.value;

          var projectedOp = this.projectOp(op);
          if (projectedOp) projectedOps.push(projectedOp);
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

      projectedDoc._ops = projectedOps;

      return projectedDoc;
    }
  }, {
    key: 'projectOp',
    value: function projectOp(op) {
      var projectedOp = (0, _util.deepClone)(op);

      if (projectedOp.collectionName) projectedOp.collectionName = this.collectionName;

      if (op.type === 'add') {
        for (var field in op.value) {
          if (this.inclusive) {
            if (!this.fields[field] && !_util.dbFields[field]) delete projectedOp.value[field];
          } else {
            if (this.fields[field] === false && !_util.dbFields[field]) delete projectedOp.value[field];
          }
        }
      }

      var parentField = op.field ? op.field.split('.')[0] : null;

      if (op.type === 'set') {
        if (this.inclusive) {
          if (!this.fields[parentField]) return;
        } else {
          if (this.fields[parentField] === false) return;
        }
      }

      if (op.type === 'del' && parentField) {
        if (this.inclusive) {
          if (!this.fields[parentField]) return;
        } else {
          if (this.fields[parentField] === false) return;
        }
      }

      return projectedOp;
    }
  }, {
    key: 'validateOp',
    value: function validateOp(op) {
      var collectionName = this.collectionName;
      function error(field) {
        return 'Op on field "' + field + '" is restricted in projection "' + collectionName + '"';
      }

      if (op.type === 'add') {
        for (var field in op.value) {
          if (this.inclusive) {
            if (!this.fields[field]) return error(field);
          } else {
            if (this.fields[field] === false) return error(field);
          }
        }
      }

      var parentField = op.field ? op.field.split('.')[0] : null;

      if (op.type === 'set') {
        if (this.inclusive) {
          if (!this.fields[parentField]) return error(op.field);
        } else {
          if (this.fields[parentField] === false) return error(op.field);
        }
      }

      if (op.type === 'del' && parentField) {
        if (this.inclusive) {
          if (!this.fields[parentField]) return error(op.field);
        } else {
          if (this.fields[parentField] === false) return error(op.field);
        }
      }
    }
  }]);
  return Projection;
}();

exports.default = Projection;
module.exports = exports['default'];