'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BooleanType = function () {
  function BooleanType(value) {
    (0, _classCallCheck3.default)(this, BooleanType);

    if (typeof value !== 'boolean') value = false;
    this.value = value;
  }

  (0, _createClass3.default)(BooleanType, [{
    key: 'get',
    value: function get() {
      return this.value;
    }
  }, {
    key: 'invert',
    value: function invert() {
      this.value = !this.value;
    }
  }]);
  return BooleanType;
}();

exports.default = BooleanType;
module.exports = exports['default'];