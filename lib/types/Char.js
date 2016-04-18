"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Char = function Char(charId, value, previousId, nextId) {
  (0, _classCallCheck3.default)(this, Char);

  this.charId = charId;
  this.value = value;
  this.previousId = previousId;
  this.nextId = nextId;
  this.removed = false;
};

exports.default = Char;
module.exports = exports['default'];