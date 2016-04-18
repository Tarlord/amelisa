'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NumberType = function () {
  function NumberType(value) {
    (0, _classCallCheck3.default)(this, NumberType);

    if (typeof value !== 'number') value = 0;
    this.value = value;
  }

  (0, _createClass3.default)(NumberType, [{
    key: 'get',
    value: function get() {
      return this.value;
    }
  }, {
    key: 'increment',
    value: function increment() {
      var value = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

      this.value = this.value + value;
    }
  }]);
  return NumberType;
}();

exports.default = NumberType;
module.exports = exports['default'];