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

var _Char = require('./Char');

var _Char2 = _interopRequireDefault(_Char);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// StringType is doubly linked list data structure with O(1) inserts

var StringType = function () {
  function StringType() {
    var chars = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    (0, _classCallCheck3.default)(this, StringType);

    this.chars = chars;
    this.firstCharId = null;
  }

  (0, _createClass3.default)(StringType, [{
    key: 'get',
    value: function get() {
      var charIds = {};
      var values = [];
      var charId = this.firstCharId;

      while (charId) {
        if (charIds[charId]) break;
        charIds[charId] = true;

        var char = this.chars[charId];
        if (!char) break;
        charId = char.nextId;
        if (char.removed) continue;
        values.push(char.value);
      }

      return values.join('');
    }
  }, {
    key: 'insert',
    value: function insert(positionId, charId, value) {
      if (!this.firstCharId && positionId) return;
      var char = new _Char2.default(charId, value, positionId);
      this.chars[charId] = char;
      if (!this.firstCharId) {
        this.firstCharId = charId;
        return;
      }

      if (!positionId) {
        var firstChar = this.chars[this.firstCharId];
        firstChar.previousId = charId;
        char.nextId = firstChar.charId;
        this.firstCharId = charId;
      } else {
        var prevChar = this.chars[positionId];
        if (!prevChar) {
          delete this.chars[charId];
          return;
        }
        var nextId = prevChar.nextId;
        prevChar.nextId = charId;
        char.nextId = nextId;
        if (nextId) {
          var nextItem = this.chars[nextId];
          nextItem.previousId = charId;
        }
      }
    }
  }, {
    key: 'remove',
    value: function remove(positionId) {
      var char = this.chars[positionId];
      if (!char) return;
      char.removed = true;
    }
  }, {
    key: 'getIndexByPositionId',
    value: function getIndexByPositionId(positionId) {
      var charIds = {};
      var index = 0;
      var charId = this.firstCharId;

      while (charId) {
        if (charIds[charId]) break;
        charIds[charId] = true;

        if (charId === positionId) return index;
        var char = this.chars[charId];
        if (!char) break;
        charId = char.nextId;
        index++;
      }

      return -1;
    }
  }, {
    key: 'getInsertPositionIdByIndex',
    value: function getInsertPositionIdByIndex(index) {
      var charIds = {};
      var currentIndex = 0;
      var charId = this.firstCharId;

      while (charId) {
        if (charIds[charId]) break;
        charIds[charId] = true;

        var char = this.chars[charId];
        if (!char) break;
        if (char.removed) {
          charId = char.nextId;
          continue;
        }
        if (currentIndex === index - 1) return charId;
        charId = char.nextId;
        currentIndex++;
      }
    }
  }, {
    key: 'getRemovePositionIdByIndex',
    value: function getRemovePositionIdByIndex(index) {
      var charIds = {};
      var currentIndex = 0;
      var charId = this.firstCharId;

      while (charId) {
        if (charIds[charId]) break;
        charIds[charId] = true;

        var char = this.chars[charId];
        if (!char) break;
        if (char.removed) {
          charId = char.nextId;
          continue;
        }
        if (currentIndex === index) return charId;
        charId = char.nextId;
        currentIndex++;
      }
    }
  }, {
    key: 'getNextRemovePositionId',
    value: function getNextRemovePositionId(positionId) {
      var charIds = {};
      var charId = positionId;

      while (charId) {
        if (charIds[charId]) break;
        charIds[charId] = true;

        var char = this.chars[charId];
        if (!char) break;
        if (char.removed || charId === positionId) {
          charId = char.nextId;
          continue;
        }
        return charId;
      }
    }
  }, {
    key: 'getStringSetValue',
    value: function getStringSetValue() {
      var charIds = {};
      var index = 0;
      var charId = this.firstCharId;
      var setValue = [];

      while (charId) {
        if (charIds[charId]) break;
        charIds[charId] = true;

        var char = this.chars[charId];
        if (!char) break;
        if (char.removed) {
          charId = char.nextId;
          continue;
        }
        setValue.push([char.charId, char.value]);
        charId = char.nextId;
        index++;
      }

      return setValue;
    }
  }, {
    key: 'setStringSetValue',
    value: function setStringSetValue(setValue) {
      this.firstCharId = null;
      this.chars = {};
      var previousId = void 0;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(setValue), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = (0, _slicedToArray3.default)(_step.value, 2);

          var charId = _step$value[0];
          var value = _step$value[1];

          if (!this.firstCharId) this.firstCharId = charId;
          var char = new _Char2.default(charId, value, previousId);
          this.chars[charId] = char;
          if (previousId) this.chars[previousId].nextId = charId;
          previousId = charId;
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
      this.firstCharId = null;
      this.chars = {};
      var previousId = void 0;

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator3.default)(values), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var value = _step2.value;

          var charId = generateCharId();
          if (!this.firstCharId) this.firstCharId = charId;
          var char = new _Char2.default(charId, value, previousId);
          this.chars[charId] = char;
          if (previousId) this.chars[previousId].nextId = charId;
          previousId = charId;
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
  return StringType;
}();

exports.default = StringType;
module.exports = exports['default'];