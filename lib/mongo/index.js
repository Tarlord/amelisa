'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _MongoQueries = require('./MongoQueries');

var _MongoQueries2 = _interopRequireDefault(_MongoQueries);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dbQueries = new _MongoQueries2.default();

exports.default = {
  dbQueries: dbQueries
};
module.exports = exports['default'];