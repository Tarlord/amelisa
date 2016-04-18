'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

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

var _types = require('../types');

var _util = require('../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Doc = function (_EventEmitter) {
  (0, _inherits3.default)(Doc, _EventEmitter);

  function Doc(docId) {
    var ops = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
    (0, _classCallCheck3.default)(this, Doc);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Doc).call(this));

    _this.docId = docId;
    _this.ops = ops;
    _this.refreshState();
    return _this;
  }

  (0, _createClass3.default)(Doc, [{
    key: 'get',
    value: function get(field) {
      if (field && typeof field !== 'string') field = null;

      if (this.state && this.state._del) return;

      if (field === '_id') return this.docId;

      var value = this.getInternal(field);

      value = this.getValue(value);

      if (!field && (typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) === 'object' && !Array.isArray(value)) {
        value._id = this.docId;
      }

      return value;
    }
  }, {
    key: 'getValue',
    value: function getValue(value) {
      var _this2 = this;

      if (value instanceof _types.ArrayType) return this.getValue(value.get());
      if (value instanceof _types.BooleanType) return value.get();
      if (value instanceof _types.NumberType) return value.get();
      if (value instanceof _types.StringType) return value.get();

      if ((typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) === 'object') {
        if (Array.isArray(value)) {
          return value.map(function (item) {
            return _this2.getValue(item);
          });
        }

        var object = {};
        for (var key in value) {
          object[key] = this.getValue(value[key]);
        }
        return object;
      }

      return value;
    }
  }, {
    key: 'getForSave',
    value: function getForSave() {
      if (this.state && this.state._del) {
        return {
          _id: this.docId,
          _del: true
        };
      }

      return this.get();
    }
  }, {
    key: 'getInternal',
    value: function getInternal(field) {
      if (!field) return this.state;

      var parts = field.split('.');
      var value = this.state;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(parts), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var part = _step.value;

          if (!value) return;
          if (value instanceof _types.ArrayType) {
            value = value.getByIndex(part);
          } else {
            value = value[part];
          }
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

      return value;
    }
  }, {
    key: 'getInternalAsArrayType',
    value: function getInternalAsArrayType(field) {
      var array = this.getInternal(field);

      if (!(array instanceof _types.ArrayType)) {
        array = new _types.ArrayType();
        this.setValueToField(field, array);
      }

      return array;
    }
  }, {
    key: 'getInternalAsStringType',
    value: function getInternalAsStringType(field) {
      var string = this.getInternal(field);

      if (!(string instanceof _types.StringType)) {
        string = new _types.StringType();
        this.setValueToField(field, string);
      }

      return string;
    }
  }, {
    key: 'distillableOpType',
    value: function distillableOpType(type) {
      return type === 'add' || type === 'set' || type === 'del' || type === 'arraySet' || type === 'stringSet';
    }
  }, {
    key: 'distillOps',
    value: function distillOps() {
      var ops = this.ops.slice();

      ops.sort(sortByDate).reverse();

      var docRewrited = false;
      var fields = {};
      var opIds = {};
      var distilledOps = [];

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator3.default)(ops), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var op = _step2.value;

          // undefined op
          if (!op) continue;

          var id = op.id;
          var type = op.type;
          var field = op.field;

          // dublicate ops

          if (opIds[id]) continue;
          opIds[id] = true;

          if (!field) {
            if (docRewrited) continue;

            distilledOps.push(op);
            if (this.distillableOpType(type)) docRewrited = true;
            continue;
          }

          var parts = field.split('.');

          var current = void 0;
          var skip = false;
          for (var i = 0; i < parts.length; i++) {
            if (i === 0) {
              current = parts[i];
            } else {
              current += '.' + parts[i];
            }
            if (fields[current]) {
              skip = true;
              break;
            }
          }

          if (skip) continue;

          distilledOps.push(op);
          if (this.distillableOpType(type)) fields[field] = true;
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      distilledOps.sort(sortByDate);

      this.ops = distilledOps;
    }
  }, {
    key: 'refreshState',
    value: function refreshState() {
      var ops = this.ops;

      ops.sort(sortByDate);

      this.state = undefined;

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = (0, _getIterator3.default)(ops), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var op = _step3.value;

          this.applyOpToState(op);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  }, {
    key: 'applyOpToState',
    value: function applyOpToState(op) {
      var state = this.state;

      var type = op.type;
      var field = op.field;
      var value = op.value;
      var charId = op.charId;
      var itemId = op.itemId;
      var positionId = op.positionId;


      var fieldState = state;

      if (field) {
        var parts = field.split('.');

        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = (0, _getIterator3.default)(parts), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var part = _step4.value;

            if (fieldState) {
              if (fieldState instanceof _types.ArrayType) {
                fieldState = fieldState.getByPositionId(part);
              } else {
                fieldState = fieldState[part];
              }
            }
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }
      }

      if (state && state._del) state = undefined;

      switch (type) {
        case 'add':
          fieldState = (0, _util.deepClone)(value);
          break;

        case 'set':
          fieldState = (0, _util.deepClone)(value);

          break;

        case 'del':
          if (!field) {
            fieldState = {
              _del: true
            };
          }
          break;

        case 'push':
          if (!(fieldState instanceof _types.ArrayType)) fieldState = new _types.ArrayType();

          fieldState.push(itemId, value);
          break;

        case 'unshift':
          if (!(fieldState instanceof _types.ArrayType)) fieldState = new _types.ArrayType();

          fieldState.unshift(itemId, value);
          break;

        case 'pop':
          if (!(fieldState instanceof _types.ArrayType)) fieldState = new _types.ArrayType();

          fieldState.pop();
          break;

        case 'shift':
          if (!(fieldState instanceof _types.ArrayType)) fieldState = new _types.ArrayType();

          fieldState.shift();
          break;

        case 'insert':
          if (!(fieldState instanceof _types.ArrayType)) fieldState = new _types.ArrayType();

          fieldState.insert(positionId, itemId, value);
          break;

        case 'remove':
          if (!(fieldState instanceof _types.ArrayType)) fieldState = new _types.ArrayType();

          fieldState.remove(positionId);
          break;

        case 'move':
          if (!(fieldState instanceof _types.ArrayType)) fieldState = new _types.ArrayType();

          fieldState.move(positionId, itemId);
          break;

        case 'swap':
          if (!(fieldState instanceof _types.ArrayType)) fieldState = new _types.ArrayType();

          fieldState.swap(positionId, itemId);
          break;

        case 'arraySet':
          if (!(fieldState instanceof _types.ArrayType)) fieldState = new _types.ArrayType();

          fieldState.setArraySetValue(value);
          break;

        case 'invert':
          if (!(fieldState instanceof _types.BooleanType)) fieldState = new _types.BooleanType(fieldState);

          fieldState.invert(value);
          break;

        case 'increment':
          if (!(fieldState instanceof _types.NumberType)) fieldState = new _types.NumberType(fieldState);

          fieldState.increment(value);
          break;

        case 'stringInsert':
          if (!(fieldState instanceof _types.StringType)) fieldState = new _types.StringType();

          fieldState.insert(positionId, charId, value);
          break;

        case 'stringRemove':
          if (!(fieldState instanceof _types.StringType)) fieldState = new _types.StringType();

          fieldState.remove(positionId);
          break;

        case 'stringSet':
          if (!(fieldState instanceof _types.StringType)) fieldState = new _types.StringType();

          fieldState.setStringSetValue(value);
          break;
      }

      if (field) {
        if (!state || (typeof state === 'undefined' ? 'undefined' : (0, _typeof3.default)(state)) !== 'object') state = {};
        if (type === 'del') {
          this.applyFnToStateField(state, field, function (part, current) {
            if (current instanceof _types.ArrayType) {
              current.del(part);
            } else {
              delete current[part];
            }
          });
        } else {
          this.applyFnToStateField(state, field, function (part, current) {
            if (current instanceof _types.ArrayType) {
              current.set(part, fieldState);
            } else {
              current[part] = fieldState;
            }
          });
        }
      } else {
        state = fieldState;
      }

      this.state = state;
      this.stateDate = op.date;
    }
  }, {
    key: 'setValueToField',
    value: function setValueToField(field, value) {
      if (field) {
        if (!this.state || (0, _typeof3.default)(this.state) !== 'object') this.state = {};
        this.applyFnToStateField(this.state, field, function (part, current) {
          return current[part] = value;
        });
      } else {
        this.state = value;
      }
    }
  }, {
    key: 'applyFnToStateField',
    value: function applyFnToStateField(state, field, fn) {
      var parts = field.split('.');
      var current = state;
      parts.forEach(function (part, index) {
        if (index === parts.length - 1) {
          fn(part, current);
        } else {
          if (current instanceof _types.ArrayType) {
            var value = current.getByPositionId(part);
            if ((typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) === 'object') {
              current = value;
            } else {
              var _value = {};
              current.set(part, _value);
              current = _value;
            }
          } else {
            if ((0, _typeof3.default)(current[part]) === 'object') {
              current = current[part];
            } else {
              current[part] = {};
              current = current[part];
            }
          }
        }
      });
    }
  }, {
    key: 'applyOp',
    value: function applyOp(op) {
      this.ops.push(op);
      if (!this.distillableOpType(op.type) && this.stateDate && op.date > this.stateDate) {
        this.applyOpToState(op);
      } else {
        this.distillOps();
        this.refreshState();
      }
    }
  }, {
    key: 'applyOps',
    value: function applyOps(ops, opsType) {
      if (!ops.length) return;
      ops.sort(sortByDate);
      this.ops = this.ops.concat(ops);
      var firstOp = ops[0];
      if (!this.distillableOpType(opsType) && this.stateDate && firstOp.date > this.stateDate) {
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = (0, _getIterator3.default)(ops), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var op = _step5.value;

            this.applyOpToState(op);
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
              _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }
      } else {
        this.distillOps();
        this.refreshState();
      }
    }
  }, {
    key: 'version',
    value: function version() {
      return this.getVersionFromOps(this.ops);
    }
  }, {
    key: 'getVersionFromOps',
    value: function getVersionFromOps(ops) {
      var map = {};

      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = (0, _getIterator3.default)(ops), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var op = _step6.value;

          var source = op.source;
          var date = op.date;

          if (!map[source] || date > map[source]) {
            map[source] = date;
          }
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      return this.getVersionFromMap(map);
    }
  }, {
    key: 'getMapFromVersion',
    value: function getMapFromVersion(version) {
      var map = {};

      if (!version) return map;

      var versions = version.split('|');

      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = (0, _getIterator3.default)(versions), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var _version = _step7.value;

          var versionArray = _version.split(' ');
          var source = versionArray[0];
          var date = +versionArray[1];
          map[source] = date;
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7.return) {
            _iterator7.return();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }

      return map;
    }
  }, {
    key: 'getVersionFromMap',
    value: function getVersionFromMap() {
      var map = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var versions = [];

      for (var source in map) {
        var date = map[source];
        versions.push(source + ' ' + date);
      }

      return versions.join('|');
    }
  }, {
    key: 'getOpsToSend',
    value: function getOpsToSend(version) {
      var opsToSend = [];
      var map = this.getMapFromVersion(version);

      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = (0, _getIterator3.default)(this.ops), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var op = _step8.value;
          var date = op.date;
          var source = op.source;

          var versionDate = map[source];
          if (!versionDate || versionDate < date) {
            opsToSend.push(op);
          }
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8.return) {
            _iterator8.return();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }

      return opsToSend;
    }
  }, {
    key: 'addOpToVersion',
    value: function addOpToVersion(version, op) {
      var map = this.getMapFromVersion(version);
      var date = op.date;
      var source = op.source;

      var versionDate = map[source];

      if (!versionDate || versionDate < date) {
        map[source] = date;
      }

      return this.getVersionFromMap(map);
    }
  }, {
    key: 'addOpsToVersion',
    value: function addOpsToVersion(version, ops) {
      var map = this.getMapFromVersion(version);

      var _iteratorNormalCompletion9 = true;
      var _didIteratorError9 = false;
      var _iteratorError9 = undefined;

      try {
        for (var _iterator9 = (0, _getIterator3.default)(ops), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
          var op = _step9.value;
          var date = op.date;
          var source = op.source;

          var versionDate = map[source];

          if (!versionDate || versionDate < date) {
            map[source] = date;
          }
        }
      } catch (err) {
        _didIteratorError9 = true;
        _iteratorError9 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion9 && _iterator9.return) {
            _iterator9.return();
          }
        } finally {
          if (_didIteratorError9) {
            throw _iteratorError9;
          }
        }
      }

      return this.getVersionFromMap(map);
    }
  }, {
    key: 'bundle',
    value: function bundle() {
      return {
        ops: this.ops
      };
    }
  }]);
  return Doc;
}(_events.EventEmitter);

function sortByDate(op1, op2) {
  if (op1.date > op2.date) return 1;
  if (op1.date < op2.date) return -1;

  // even if ops have same timestamp, we should sort them
  // in predictable way, let's use source for this
  if (op1.source > op2.source) return 1;
  if (op1.source < op2.source) return -1;

  // it should never get here in normal situations
  // TODO: fix tests, so it never gets here
  return 0;
}

exports.default = Doc;
module.exports = exports['default'];