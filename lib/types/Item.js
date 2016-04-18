"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Item = function Item(itemId, value, previousId, nextId) {
  (0, _classCallCheck3.default)(this, Item);

  this.itemId = itemId;
  this.value = value;
  this.previousId = previousId;
  this.nextId = nextId;
  this.removed = false;
};

exports.default = Item;
module.exports = exports['default'];