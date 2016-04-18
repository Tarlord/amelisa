'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

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

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _arraydiff = require('arraydiff');

var _arraydiff2 = _interopRequireDefault(_arraydiff);

var _Doc2 = require('./Doc');

var _Doc3 = _interopRequireDefault(_Doc2);

var _types = require('../types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MutableDoc = function (_Doc) {
  (0, _inherits3.default)(MutableDoc, _Doc);

  function MutableDoc(docId, ops, collection, model) {
    (0, _classCallCheck3.default)(this, MutableDoc);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(MutableDoc).call(this, docId, ops));

    _this.collection = collection;
    _this.model = model;
    return _this;
  }

  (0, _createClass3.default)(MutableDoc, [{
    key: 'fetch',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function fetch() {
        return ref.apply(this, arguments);
      }

      return fetch;
    }()
  }, {
    key: 'subscribe',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function subscribe() {
        return ref.apply(this, arguments);
      }

      return subscribe;
    }()
  }, {
    key: 'unsubscribe',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function unsubscribe() {
        return ref.apply(this, arguments);
      }

      return unsubscribe;
    }()
  }, {
    key: 'fetchAndGet',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.fetch();

              case 2:
                return _context4.abrupt('return', this.get());

              case 3:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function fetchAndGet() {
        return ref.apply(this, arguments);
      }

      return fetchAndGet;
    }()
  }, {
    key: 'getFieldConsideringArrays',
    value: function getFieldConsideringArrays(field) {
      if (field) {
        var parts = field.split('.');
        var currentField = '';
        var currentState = void 0;
        var newParts = [];

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _getIterator3.default)(parts), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var part = _step.value;

            if (currentState instanceof _types.ArrayType) {
              var positionId = currentState.getSetPositionIdByIndex(part);
              if (!positionId) throw new Error('No item on index while mutating field: ' + field);
              newParts.push(positionId);
            } else {
              newParts.push(part);
            }
            if (currentField) currentField = currentField + '.' + part;else currentField = part;
            currentState = this.getInternal(currentField);
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

        field = newParts.join('.');
      }
      return field;
    }
  }, {
    key: 'set',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(field, value) {
        var op;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                field = this.getFieldConsideringArrays(field);

                op = this.model.createOp({
                  type: 'set',
                  collectionName: this.collection.name,
                  docId: this.docId,
                  field: field,
                  value: value
                });
                return _context5.abrupt('return', this.onOp(op));

              case 3:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function set(_x, _x2) {
        return ref.apply(this, arguments);
      }

      return set;
    }()
  }, {
    key: 'del',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(field) {
        var op;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                field = this.getFieldConsideringArrays(field);

                op = this.model.createOp({
                  type: 'del',
                  collectionName: this.collection.name,
                  docId: this.docId
                });


                if (field) op.field = field;

                return _context6.abrupt('return', this.onOp(op));

              case 4:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function del(_x3) {
        return ref.apply(this, arguments);
      }

      return del;
    }()
  }, {
    key: 'push',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(field, value) {
        var itemId, op;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                this.arraySetIfValueIsArray(field);
                field = this.getFieldConsideringArrays(field);

                itemId = this.model.id();
                op = this.model.createOp({
                  type: 'push',
                  collectionName: this.collection.name,
                  docId: this.docId,
                  field: field,
                  itemId: itemId,
                  value: value
                });
                return _context7.abrupt('return', this.onOp(op));

              case 5:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function push(_x4, _x5) {
        return ref.apply(this, arguments);
      }

      return push;
    }()
  }, {
    key: 'unshift',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(field, value) {
        var itemId, op;
        return _regenerator2.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                this.arraySetIfValueIsArray(field);
                field = this.getFieldConsideringArrays(field);

                itemId = this.model.id();
                op = this.model.createOp({
                  type: 'unshift',
                  collectionName: this.collection.name,
                  docId: this.docId,
                  field: field,
                  itemId: itemId,
                  value: value
                });
                return _context8.abrupt('return', this.onOp(op));

              case 5:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function unshift(_x6, _x7) {
        return ref.apply(this, arguments);
      }

      return unshift;
    }()
  }, {
    key: 'pop',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(field) {
        var op;
        return _regenerator2.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                this.arraySetIfValueIsArray(field);
                field = this.getFieldConsideringArrays(field);

                op = this.model.createOp({
                  type: 'pop',
                  collectionName: this.collection.name,
                  docId: this.docId,
                  field: field
                });
                return _context9.abrupt('return', this.onOp(op));

              case 4:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function pop(_x8) {
        return ref.apply(this, arguments);
      }

      return pop;
    }()
  }, {
    key: 'shift',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(field) {
        var op;
        return _regenerator2.default.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                this.arraySetIfValueIsArray(field);
                field = this.getFieldConsideringArrays(field);

                op = this.model.createOp({
                  type: 'shift',
                  collectionName: this.collection.name,
                  docId: this.docId,
                  field: field
                });
                return _context10.abrupt('return', this.onOp(op));

              case 4:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function shift(_x9) {
        return ref.apply(this, arguments);
      }

      return shift;
    }()
  }, {
    key: 'insert',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11(field, index, values) {
        var array, positionId, ops, type, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, value, itemId, _op, op;

        return _regenerator2.default.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                this.arraySetIfValueIsArray(field);

                if (!Array.isArray(values)) values = [values];
                array = this.getInternalAsArrayType(field);
                positionId = array.getInsertPositionIdByIndex(index);
                ops = [];
                type = 'insert';

                field = this.getFieldConsideringArrays(field);

                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context11.prev = 10;
                for (_iterator2 = (0, _getIterator3.default)(values); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  value = _step2.value;
                  itemId = this.model.id();
                  _op = this.model.createOp({
                    type: type,
                    collectionName: this.collection.name,
                    docId: this.docId,
                    itemId: itemId,
                    value: value
                  });


                  if (field) _op.field = field;
                  if (positionId) _op.positionId = positionId;

                  ops.push(_op);
                  positionId = itemId;
                }

                _context11.next = 18;
                break;

              case 14:
                _context11.prev = 14;
                _context11.t0 = _context11['catch'](10);
                _didIteratorError2 = true;
                _iteratorError2 = _context11.t0;

              case 18:
                _context11.prev = 18;
                _context11.prev = 19;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }

              case 21:
                _context11.prev = 21;

                if (!_didIteratorError2) {
                  _context11.next = 24;
                  break;
                }

                throw _iteratorError2;

              case 24:
                return _context11.finish(21);

              case 25:
                return _context11.finish(18);

              case 26:
                this.applyOps(ops);

                this.emit('change');
                this.collection.emit('change');
                this.save();

                op = this.model.createOp({
                  type: 'ops',
                  opsType: type,
                  collectionName: this.collection.name,
                  docId: this.docId,
                  field: field,
                  ops: ops
                });
                return _context11.abrupt('return', this.model.send(op));

              case 32:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this, [[10, 14, 18, 26], [19,, 21, 25]]);
      }));

      function insert(_x10, _x11, _x12) {
        return ref.apply(this, arguments);
      }

      return insert;
    }()
  }, {
    key: 'remove',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12(field, index) {
        var howMany = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

        var array, ops, type, positionId, i, _op2, op;

        return _regenerator2.default.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                this.arraySetIfValueIsArray(field);

                array = this.getInternalAsArrayType(field);
                ops = [];
                type = 'remove';

                field = this.getFieldConsideringArrays(field);

                positionId = array.getRemovePositionIdByIndex(index);

                if (positionId) {
                  _context12.next = 8;
                  break;
                }

                return _context12.abrupt('return');

              case 8:

                for (i = index; i < index + howMany; i++) {
                  if (i !== index) positionId = array.getNextRemovePositionId(positionId);

                  _op2 = this.model.createOp({
                    type: type,
                    collectionName: this.collection.name,
                    docId: this.docId
                  });


                  if (field) _op2.field = field;
                  if (positionId) _op2.positionId = positionId;

                  ops.push(_op2);
                }

                this.applyOps(ops);

                this.emit('change');
                this.collection.emit('change');
                this.save();

                op = this.model.createOp({
                  type: 'ops',
                  opsType: type,
                  collectionName: this.collection.name,
                  docId: this.docId,
                  field: field,
                  ops: ops
                });
                return _context12.abrupt('return', this.model.send(op));

              case 15:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function remove(_x13, _x14, _x15) {
        return ref.apply(this, arguments);
      }

      return remove;
    }()
  }, {
    key: 'move',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee13(field, from, to) {
        var howMany = arguments.length <= 3 || arguments[3] === undefined ? 1 : arguments[3];

        var array, ops, type, positionId, itemId, i, _op3, op;

        return _regenerator2.default.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                this.arraySetIfValueIsArray(field);

                array = this.getInternalAsArrayType(field);
                ops = [];
                type = 'move';

                field = this.getFieldConsideringArrays(field);

                positionId = array.getRemovePositionIdByIndex(from);

                if (positionId) {
                  _context13.next = 8;
                  break;
                }

                return _context13.abrupt('return');

              case 8:
                itemId = array.getSetPositionIdByIndex(to);


                for (i = 0; i < howMany; i++) {
                  if (i !== 0) {
                    positionId = array.getNextRemovePositionId(positionId);
                    itemId = array.getNextSetPositionId(itemId);
                  }

                  _op3 = this.model.createOp({
                    type: type,
                    collectionName: this.collection.name,
                    docId: this.docId,
                    positionId: positionId
                  });


                  if (itemId) _op3.itemId = itemId;
                  if (field) _op3.field = field;

                  ops.push(_op3);
                }

                this.applyOps(ops);

                this.emit('change');
                this.collection.emit('change');
                this.save();

                op = this.model.createOp({
                  type: 'ops',
                  opsType: type,
                  collectionName: this.collection.name,
                  docId: this.docId,
                  field: field,
                  ops: ops
                });
                return _context13.abrupt('return', this.model.send(op));

              case 16:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function move(_x17, _x18, _x19, _x20) {
        return ref.apply(this, arguments);
      }

      return move;
    }()
  }, {
    key: 'swap',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee14(field, from, to) {
        var array, positionId, itemId, op;
        return _regenerator2.default.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                this.arraySetIfValueIsArray(field);

                array = this.getInternalAsArrayType(field);

                field = this.getFieldConsideringArrays(field);

                positionId = array.getRemovePositionIdByIndex(from);

                if (positionId) {
                  _context14.next = 6;
                  break;
                }

                return _context14.abrupt('return');

              case 6:
                itemId = array.getSetPositionIdByIndex(to);

                if (itemId) {
                  _context14.next = 9;
                  break;
                }

                return _context14.abrupt('return');

              case 9:
                op = this.model.createOp({
                  type: 'swap',
                  collectionName: this.collection.name,
                  docId: this.docId,
                  positionId: positionId,
                  itemId: itemId
                });


                if (field) op.field = field;

                return _context14.abrupt('return', this.onOp(op));

              case 12:
              case 'end':
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function swap(_x22, _x23, _x24) {
        return ref.apply(this, arguments);
      }

      return swap;
    }()
  }, {
    key: 'arraySet',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee15(field, value) {
        var array, op;
        return _regenerator2.default.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                array = new _types.ArrayType();

                array.setValue(value, this.model.id);
                field = this.getFieldConsideringArrays(field);

                op = this.model.createOp({
                  type: 'arraySet',
                  collectionName: this.collection.name,
                  docId: this.docId,
                  value: array.getArraySetValue()
                });


                if (field) op.field = field;

                return _context15.abrupt('return', this.onOp(op));

              case 6:
              case 'end':
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function arraySet(_x25, _x26) {
        return ref.apply(this, arguments);
      }

      return arraySet;
    }()
  }, {
    key: 'arrayDiff',
    value: function arrayDiff(field, value) {
      var previous = this.get(field);
      if (!Array.isArray(previous)) previous = [];

      var diffs = (0, _arraydiff2.default)(previous, value);

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = (0, _getIterator3.default)(diffs), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var diff = _step3.value;

          switch (diff.type) {
            case 'insert':
              this.insert(field, diff.index, diff.values);
              break;
            case 'remove':
              this.remove(field, diff.index, diff.howMany);
              break;
            case 'move':
              this.move(field, diff.from, diff.to, diff.howMany);
              break;
          }
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
    key: 'invert',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee16(field) {
        var op;
        return _regenerator2.default.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                field = this.getFieldConsideringArrays(field);

                op = this.model.createOp({
                  type: 'invert',
                  collectionName: this.collection.name,
                  docId: this.docId
                });


                if (field) op.field = field;

                return _context16.abrupt('return', this.onOp(op));

              case 4:
              case 'end':
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function invert(_x27) {
        return ref.apply(this, arguments);
      }

      return invert;
    }()
  }, {
    key: 'increment',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee17(field, value) {
        var op;
        return _regenerator2.default.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                field = this.getFieldConsideringArrays(field);

                op = this.model.createOp({
                  type: 'increment',
                  collectionName: this.collection.name,
                  docId: this.docId,
                  value: value
                });


                if (field) op.field = field;

                return _context17.abrupt('return', this.onOp(op));

              case 4:
              case 'end':
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));

      function increment(_x28, _x29) {
        return ref.apply(this, arguments);
      }

      return increment;
    }()
  }, {
    key: 'stringInsert',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee18(field, index, value) {
        var howMany, string, positionId, ops, type, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _value, charId, _op4, op;

        return _regenerator2.default.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                howMany = value.length;
                string = this.getInternal(field);

                if (!(string instanceof _types.StringType)) {
                  if (typeof string === 'string') {
                    this.stringSet(field, string);
                    string = this.getInternal(field);
                  } else {
                    this.stringSet(field, '');
                    string = this.getInternal(field);
                  }
                }

                positionId = string.getInsertPositionIdByIndex(index);
                ops = [];
                type = 'stringInsert';

                field = this.getFieldConsideringArrays(field);

                _iteratorNormalCompletion4 = true;
                _didIteratorError4 = false;
                _iteratorError4 = undefined;
                _context18.prev = 10;
                for (_iterator4 = (0, _getIterator3.default)(value.split('')); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                  _value = _step4.value;
                  charId = this.model.id();
                  _op4 = this.model.createOp({
                    type: type,
                    collectionName: this.collection.name,
                    docId: this.docId,
                    charId: charId,
                    value: _value
                  });


                  if (field) _op4.field = field;
                  if (positionId) _op4.positionId = positionId;

                  ops.push(_op4);
                  positionId = charId;
                }

                _context18.next = 18;
                break;

              case 14:
                _context18.prev = 14;
                _context18.t0 = _context18['catch'](10);
                _didIteratorError4 = true;
                _iteratorError4 = _context18.t0;

              case 18:
                _context18.prev = 18;
                _context18.prev = 19;

                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                  _iterator4.return();
                }

              case 21:
                _context18.prev = 21;

                if (!_didIteratorError4) {
                  _context18.next = 24;
                  break;
                }

                throw _iteratorError4;

              case 24:
                return _context18.finish(21);

              case 25:
                return _context18.finish(18);

              case 26:
                this.applyOps(ops);

                this.emit(type, field, index, howMany);

                this.emit('change');
                this.collection.emit('change');
                this.save();

                op = this.model.createOp({
                  type: 'ops',
                  opsType: type,
                  collectionName: this.collection.name,
                  docId: this.docId,
                  field: field,
                  ops: ops,
                  index: index,
                  howMany: howMany
                });
                return _context18.abrupt('return', this.model.send(op));

              case 33:
              case 'end':
                return _context18.stop();
            }
          }
        }, _callee18, this, [[10, 14, 18, 26], [19,, 21, 25]]);
      }));

      function stringInsert(_x30, _x31, _x32) {
        return ref.apply(this, arguments);
      }

      return stringInsert;
    }()
  }, {
    key: 'stringRemove',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee19(field, index) {
        var howMany = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

        var string, ops, type, positionId, i, _op5, op;

        return _regenerator2.default.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                string = this.getInternal(field);

                if (!(string instanceof _types.StringType)) {
                  if (typeof string === 'string') {
                    this.stringSet(field, string);
                    string = this.getInternal(field);
                  } else {
                    this.stringSet(field, '');
                    string = this.getInternal(field);
                  }
                }

                ops = [];
                type = 'stringRemove';

                field = this.getFieldConsideringArrays(field);

                positionId = string.getRemovePositionIdByIndex(index);

                if (positionId) {
                  _context19.next = 8;
                  break;
                }

                return _context19.abrupt('return');

              case 8:

                for (i = index; i < index + howMany; i++) {
                  if (i !== index) positionId = string.getNextRemovePositionId(positionId);

                  _op5 = this.model.createOp({
                    type: type,
                    collectionName: this.collection.name,
                    docId: this.docId
                  });


                  if (field) _op5.field = field;
                  if (positionId) _op5.positionId = positionId;

                  ops.push(_op5);
                }

                this.applyOps(ops);

                this.emit(type, field, index, howMany);

                this.emit('change');
                this.collection.emit('change');
                this.save();

                op = this.model.createOp({
                  type: 'ops',
                  opsType: type,
                  collectionName: this.collection.name,
                  docId: this.docId,
                  field: field,
                  ops: ops,
                  index: index,
                  howMany: howMany
                });
                return _context19.abrupt('return', this.model.send(op));

              case 16:
              case 'end':
                return _context19.stop();
            }
          }
        }, _callee19, this);
      }));

      function stringRemove(_x33, _x34, _x35) {
        return ref.apply(this, arguments);
      }

      return stringRemove;
    }()
  }, {
    key: 'stringSet',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee20(field, value) {
        var string, op;
        return _regenerator2.default.wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                string = new _types.StringType();

                string.setValue(value, this.model.id);
                field = this.getFieldConsideringArrays(field);

                op = this.model.createOp({
                  type: 'stringSet',
                  collectionName: this.collection.name,
                  docId: this.docId,
                  value: string.getStringSetValue()
                });


                if (field) op.field = field;

                return _context20.abrupt('return', this.onOp(op));

              case 6:
              case 'end':
                return _context20.stop();
            }
          }
        }, _callee20, this);
      }));

      function stringSet(_x37, _x38) {
        return ref.apply(this, arguments);
      }

      return stringSet;
    }()
  }, {
    key: 'stringDiff',
    value: function stringDiff(field, value) {
      var previous = this.get(field);
      if (typeof previous !== 'string') previous = '';

      if (previous === value) return;
      var start = 0;
      while (previous.charAt(start) === value.charAt(start)) {
        start++;
      }
      var end = 0;
      while (previous.charAt(previous.length - 1 - end) === value.charAt(value.length - 1 - end) && end + start < previous.length && end + start < value.length) {
        end++;
      }

      if (previous.length !== start + end) {
        var howMany = previous.length - start - end;
        this.stringRemove(field, start, howMany);
      }
      if (value.length !== start + end) {
        var inserted = value.slice(start, value.length - end);
        this.stringInsert(field, start, inserted);
      }
    }
  }, {
    key: 'richDiff',
    value: function richDiff(field, value) {
      var previous = this.get(field);
      if (!Array.isArray(previous)) previous = [];

      var prevKeys = previous.map(function (block) {
        return block.key;
      });
      var keys = value.map(function (block) {
        return block.key;
      });

      var diffs = (0, _arraydiff2.default)(prevKeys, keys);
      var insertKeys = [];

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = (0, _getIterator3.default)(diffs), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var diff = _step5.value;

          switch (diff.type) {
            case 'insert':
              var values = diff.values.map(function (key) {
                insertKeys.push(key);
                return value.find(function (block) {
                  return block.key === key;
                });
              });
              this.insert(field, diff.index, values);
              break;
            case 'remove':
              this.remove(field, diff.index, diff.howMany);
              break;
            case 'move':
              this.move(field, diff.from, diff.to, diff.howMany);
              break;
          }
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

      previous = this.get(field);

      for (var i = 0; i < previous.length; i++) {
        var prevBlock = previous[i];
        var block = value[i];
        if (insertKeys.indexOf(block.key) !== -1) continue;

        this.stringDiff(field + '.' + i + '.text', block.text);

        var prevChatacterList = prevBlock.characterList;
        var characterList = block.characterList;

        for (var k = 0; k < characterList.length; k++) {
          var prevChar = prevChatacterList[k];
          var char = characterList[k];

          if (!prevChar) {
            this.set(field + '.' + i + '.characterList.' + k, char);
            continue;
          }

          if (prevChar.style.length === 0 && char.style.length === 0) continue;
          if (prevChar.style.length === 1 && char.style.length === 1 && prevChar.style[0] === char.style[0]) continue;
          if (prevChar.style.length === 2 && char.style.length === 2 && prevChar.style[0] === char.style[0] && prevChar.style[1] === char.style[1]) continue;
          if ((0, _stringify2.default)(prevChar.style) === (0, _stringify2.default)(char.style)) continue;

          this.set(field + '.' + i + '.characterList.' + k + '.style', char.style);
        }
      }
    }
  }, {
    key: 'arraySetIfValueIsArray',
    value: function arraySetIfValueIsArray(field) {
      var previous = this.getInternal(field);
      if (!(previous instanceof _types.ArrayType)) {
        if (Array.isArray(previous)) {
          this.arraySet(field, previous);
        }
      }
    }
  }, {
    key: 'refresh',
    value: function refresh() {
      this.refreshState();
      this.emit('change');
    }
  }, {
    key: 'onOp',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee21(op) {
        return _regenerator2.default.wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                this.applyOp(op);
                this.emit('change');
                this.collection.emit('change', op);
                return _context21.abrupt('return', this.save());

              case 4:
              case 'end':
                return _context21.stop();
            }
          }
        }, _callee21, this);
      }));

      function onOp(_x39) {
        return ref.apply(this, arguments);
      }

      return onOp;
    }()
  }, {
    key: 'save',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee22() {
        var _this2 = this;

        return _regenerator2.default.wrap(function _callee22$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                if (!(!this.model.storage || !this.ops.length)) {
                  _context22.next = 2;
                  break;
                }

                return _context22.abrupt('return');

              case 2:

                if (this.timeout) clearTimeout(this.timeout);
                this.timeout = setTimeout(function () {
                  return _this2.saveToStorage();
                }, this.model.options.clientSaveDebounceTimeout);

              case 4:
              case 'end':
                return _context22.stop();
            }
          }
        }, _callee22, this);
      }));

      function save() {
        return ref.apply(this, arguments);
      }

      return save;
    }()
  }, {
    key: 'saveToStorage',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee23() {
        var _this3 = this;

        return _regenerator2.default.wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                return _context23.abrupt('return', this.model.storage.saveDoc(this.collection.name, this.docId, this.ops, this.serverVersion).catch(function (err) {
                  console.error('MutableDoc.save', _this3.collection.name, err);
                  console.log('Probably, you have not added collection ' + _this3.collection.name + '\n          to store options. For IndexedDB app version should be increased also');
                }));

              case 1:
              case 'end':
                return _context23.stop();
            }
          }
        }, _callee23, this);
      }));

      function saveToStorage() {
        return ref.apply(this, arguments);
      }

      return saveToStorage;
    }()
  }]);
  return MutableDoc;
}(_Doc3.default);

exports.default = MutableDoc;
module.exports = exports['default'];