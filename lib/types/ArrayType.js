'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _Item = require('./Item');

var _Item2 = _interopRequireDefault(_Item);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ArrayType is doubly linked list data structure with O(1) inserts

var ArrayType = function () {
  function ArrayType() {
    var items = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    (0, _classCallCheck3.default)(this, ArrayType);

    this.items = items;
    this.firstItemId = null;
    this.lastItemId = null;
  }

  (0, _createClass3.default)(ArrayType, [{
    key: 'get',
    value: function get() {
      var itemIds = {};
      var values = [];
      var itemId = this.firstItemId;

      while (itemId) {
        if (itemIds[itemId]) break;
        itemIds[itemId] = true;

        var item = this.items[itemId];
        if (!item) break;
        itemId = item.nextId;
        if (item.removed) continue;
        values.push(item.value);
      }

      return values;
    }
  }, {
    key: 'getNotRemoved',
    value: function getNotRemoved() {
      return this.items.filter(function (item) {
        return !item.removed;
      });
    }
  }, {
    key: 'getByIndex',
    value: function getByIndex(index) {
      var itemIds = {};
      var currentIndex = 0;
      var itemId = this.firstItemId;

      while (itemId) {
        if (itemIds[itemId]) break;
        itemIds[itemId] = true;

        var item = this.items[itemId];
        if (!item) break;
        if (item.removed) {
          itemId = item.nextId;
          continue;
        }
        if (currentIndex === +index) return item.value;
        itemId = item.nextId;
        currentIndex++;
      }
    }
  }, {
    key: 'getByPositionId',
    value: function getByPositionId(positionId) {
      var item = this.items[positionId];
      if (!item) return;
      return item.value;
    }
  }, {
    key: 'set',
    value: function set(positionId, value) {
      var item = this.items[positionId];
      if (!item) return;
      item.value = value;
    }
  }, {
    key: 'del',
    value: function del(positionId) {
      var item = this.items[positionId];
      if (!item) return;
      item.removed = true;
    }
  }, {
    key: 'push',
    value: function push(itemId, value) {
      var item = new _Item2.default(itemId, value);
      this.items[itemId] = item;
      if (!this.firstItemId) {
        this.firstItemId = itemId;
        this.lastItemId = itemId;
        return;
      }
      var lastItem = this.items[this.lastItemId];
      lastItem.nextId = itemId;
      item.previousId = lastItem.itemId;
      this.lastItemId = itemId;
    }
  }, {
    key: 'unshift',
    value: function unshift(itemId, value) {
      var item = new _Item2.default(itemId, value, null, this.firstItemId);
      this.items[itemId] = item;
      if (!this.firstItemId) {
        this.firstItemId = itemId;
        this.lastItemId = itemId;
        return;
      }
      var firstItem = this.items[this.firstItemId];
      firstItem.previousId = itemId;
      item.nextId = firstItem.itemId;
      this.firstItemId = itemId;
    }
  }, {
    key: 'pop',
    value: function pop() {
      if (!this.lastItemId) return;
      var lastItem = this.items[this.lastItemId];
      delete this.items[this.lastItemId];
      var previousId = lastItem.previousId;
      if (previousId) {
        this.items[previousId].nextId = null;
        this.lastItemId = previousId;
      } else {
        this.firstItemId = null;
        this.lastItemId = null;
      }
    }
  }, {
    key: 'shift',
    value: function shift() {
      if (!this.firstItemId) return;
      var firstItem = this.items[this.firstItemId];
      delete this.items[this.firstItemId];
      var nextId = firstItem.nextId;
      if (nextId) {
        this.items[nextId].previousId = null;
        this.firstItemId = nextId;
      } else {
        this.firstItemId = null;
        this.lastItemId = null;
      }
    }
  }, {
    key: 'insert',
    value: function insert(positionId, itemId, value) {
      if (!this.firstItemId && positionId) return;
      var item = new _Item2.default(itemId, value, positionId);
      this.items[itemId] = item;
      if (!this.firstItemId) {
        this.firstItemId = itemId;
        this.lastItemId = itemId;
        return;
      }

      if (!positionId) {
        var firstItem = this.items[this.firstItemId];
        firstItem.previousId = itemId;
        item.nextId = firstItem.itemId;
        this.firstItemId = itemId;
      } else {
        var prevItem = this.items[positionId];
        if (!prevItem) {
          delete this.items[itemId];
          return;
        }
        var nextId = prevItem.nextId;
        prevItem.nextId = itemId;
        item.nextId = nextId;
        if (nextId) {
          var nextItem = this.items[nextId];
          nextItem.previousId = itemId;
        } else {
          this.lastItemId = itemId;
        }
      }
    }
  }, {
    key: 'remove',
    value: function remove(positionId) {
      var item = this.items[positionId];
      if (!item) return;
      item.removed = true;
    }
  }, {
    key: 'move',
    value: function move(positionId, itemId) {
      if (!this.firstItemId || positionId === itemId) return;
      var item = this.items[positionId];
      if (!item) return;
      var toItem = void 0;
      if (itemId) {
        toItem = this.items[itemId];
        if (!toItem) return;
        if (toItem.nextId === positionId) {
          if (toItem.previousId) {
            toItem = this.items[toItem.previousId];
          } else {
            toItem = null;
          }
        }
      }
      if (item.previousId) {
        var prevItem = this.items[item.previousId];
        prevItem.nextId = item.nextId;
      } else {
        this.firstItemId = item.nextId;
      }
      if (item.nextId) {
        var nextItem = this.items[item.nextId];
        nextItem.previousId = item.previousId;
      } else {
        this.lastItemId = item.previousId;
      }
      if (!toItem) {
        var firstItem = this.items[this.firstItemId];
        firstItem.previousId = item.itemId;
        item.nextId = firstItem.itemId;
        this.firstItemId = item.itemId;
        item.previousId = null;
        return;
      }
      if (toItem.nextId) {
        var _nextItem = this.items[toItem.nextId];
        _nextItem.previousId = item.itemId;
      } else {
        this.lastItemId = item.itemId;
      }
      item.nextId = toItem.nextId;
      item.previousId = toItem.itemId;
      toItem.nextId = item.itemId;
    }
  }, {
    key: 'swap',
    value: function swap(positionId, itemId) {
      if (!this.firstItemId || positionId === itemId) return;
      var item = this.items[positionId];
      if (!item) return;
      var toItem = this.items[itemId];
      if (!toItem) return;

      if (this.firstItemId === item.itemId) {
        this.firstItemId = toItem.itemId;
      } else if (this.firstItemId === toItem.itemId) {
        this.firstItemId = item.itemId;
      }
      if (this.lastItemId === item.itemId) {
        this.lastItemId = toItem.itemId;
      } else if (this.lastItemId === toItem.itemId) {
        this.lastItemId = item.itemId;
      }

      var previousId = item.previousId;
      if (previousId) this.items[previousId].nextId = toItem.itemId;
      item.previousId = toItem.previousId;
      if (toItem.previousId) this.items[toItem.previousId].nextId = item.itemId;
      toItem.previousId = previousId;

      var nextId = item.nextId;
      if (nextId) this.items[nextId].previousId = toItem.itemId;
      item.nextId = toItem.nextId;
      if (toItem.nextId) this.items[toItem.nextId].previousId = item.itemId;
      toItem.nextId = nextId;
    }
  }, {
    key: 'getIndexByPositionId',
    value: function getIndexByPositionId(positionId) {
      var itemIds = {};
      var index = 0;
      var itemId = this.firstItemId;

      while (itemId) {
        if (itemIds[itemId]) break;
        itemIds[itemId] = true;

        if (itemId === positionId) return index;
        var item = this.items[itemId];
        if (!item) break;
        itemId = item.nextId;
        index++;
      }

      return -1;
    }
  }, {
    key: 'getNotRemovedIndexByPositionId',
    value: function getNotRemovedIndexByPositionId(positionId) {
      var itemIds = {};
      var index = 0;
      var itemId = this.firstItemId;

      while (itemId) {
        if (itemIds[itemId]) break;
        itemIds[itemId] = true;

        if (itemId === positionId) return index;
        var item = this.items[itemId];
        if (!item) break;
        itemId = item.nextId;
        if (!item.removed) index++;
      }

      return -1;
    }
  }, {
    key: 'getInsertPositionIdByIndex',
    value: function getInsertPositionIdByIndex(index) {
      var itemIds = {};
      var currentIndex = 0;
      var itemId = this.firstItemId;

      while (itemId) {
        if (itemIds[itemId]) break;
        itemIds[itemId] = true;

        var item = this.items[itemId];
        if (!item) break;
        if (item.removed) {
          itemId = item.nextId;
          continue;
        }
        if (currentIndex === index - 1) return itemId;
        itemId = item.nextId;
        currentIndex++;
      }
    }
  }, {
    key: 'getRemovePositionIdByIndex',
    value: function getRemovePositionIdByIndex(index) {
      var itemIds = {};
      var currentIndex = 0;
      var itemId = this.firstItemId;

      while (itemId) {
        if (itemIds[itemId]) break;
        itemIds[itemId] = true;

        var item = this.items[itemId];
        if (!item) break;
        if (item.removed) {
          itemId = item.nextId;
          continue;
        }
        if (currentIndex === index) return itemId;
        itemId = item.nextId;
        currentIndex++;
      }
    }
  }, {
    key: 'getNextRemovePositionId',
    value: function getNextRemovePositionId(positionId) {
      var itemIds = {};
      var itemId = positionId;

      while (itemId) {
        if (itemIds[itemId]) break;
        itemIds[itemId] = true;

        var item = this.items[itemId];
        if (!item) break;
        if (item.removed || itemId === positionId) {
          itemId = item.nextId;
          continue;
        }
        return itemId;
      }
    }
  }, {
    key: 'getNextSetPositionId',
    value: function getNextSetPositionId(positionId) {
      var itemIds = {};
      var itemId = positionId || this.firstItemId;

      while (itemId) {
        if (itemIds[itemId]) break;
        itemIds[itemId] = true;

        var item = this.items[itemId];
        if (!item) break;
        if (item.removed || itemId === positionId) {
          itemId = item.nextId;
          continue;
        }
        return itemId;
      }
    }
  }, {
    key: 'getSetPositionIdByIndex',
    value: function getSetPositionIdByIndex(index) {
      var itemIds = {};
      var currentIndex = 0;
      var itemId = this.firstItemId;

      while (itemId) {
        if (itemIds[itemId]) break;
        itemIds[itemId] = true;

        var item = this.items[itemId];
        if (!item) break;
        if (item.removed) {
          itemId = item.nextId;
          continue;
        }
        if (currentIndex === +index) return itemId;
        itemId = item.nextId;
        currentIndex++;
      }
    }
  }, {
    key: 'getArraySetValue',
    value: function getArraySetValue() {
      var itemIds = {};
      var index = 0;
      var itemId = this.firstItemId;
      var setValue = [];

      while (itemId) {
        if (itemIds[itemId]) break;
        itemIds[itemId] = true;

        var item = this.items[itemId];
        if (!item) break;
        if (item.removed) {
          itemId = item.nextId;
          continue;
        }
        setValue.push([item.itemId, item.value]);
        itemId = item.nextId;
        index++;
      }

      return setValue;
    }
  }, {
    key: 'setArraySetValue',
    value: function setArraySetValue(setValue) {
      this.firstItemId = null;
      this.lastItemId = null;
      this.items = {};
      var previousId = void 0;
      var index = 0;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(setValue), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = (0, _slicedToArray3.default)(_step.value, 2);

          var itemId = _step$value[0];
          var value = _step$value[1];

          if (!this.firstItemId) this.firstItemId = itemId;
          var item = new _Item2.default(itemId, value, previousId);
          this.items[itemId] = item;
          if (previousId) this.items[previousId].nextId = itemId;
          previousId = itemId;
          if (index === setValue.length - 1) this.lastItemId = itemId;
          index++;
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
    }
  }, {
    key: 'setValue',
    value: function setValue(values, generateCharId) {
      this.firstItemId = null;
      this.lastItemId = null;
      this.items = {};
      var previousId = void 0;
      var index = 0;

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator3.default)(values), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var value = _step2.value;

          var itemId = generateCharId();
          if (!this.firstItemId) this.firstItemId = itemId;
          var item = new _Item2.default(itemId, value, previousId);
          this.items[itemId] = item;
          if (previousId) this.items[previousId].nextId = itemId;
          previousId = itemId;
          if (index === values.length - 1) this.lastItemId = itemId;
          index++;
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
    }
  }]);
  return ArrayType;
}();

exports.default = ArrayType;
module.exports = exports['default'];