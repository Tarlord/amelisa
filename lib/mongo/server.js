'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _MemoryStorage = require('./MemoryStorage');

var _MemoryStorage2 = _interopRequireDefault(_MemoryStorage);

var _MongoStorage = require('./MongoStorage');

var _MongoStorage2 = _interopRequireDefault(_MongoStorage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  MemoryStorage: _MemoryStorage2.default,
  MongoStorage: _MongoStorage2.default
};
module.exports = exports['default'];