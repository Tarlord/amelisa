'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// in react-native process.title === undefined
var isServer = process.title && process.title !== 'browser';

var dbFields = {
  _ops: true,
  _sv: true,
  _v: true
};

function arrayRemove(array, el) {
  var index = array.indexOf(el);
  if (index > -1) {
    array.splice(index, 1);
  }
  return index;
}

function deepClone(object) {
  if (object == null || (typeof object === 'undefined' ? 'undefined' : (0, _typeof3.default)(object)) !== 'object') return object;

  return JSON.parse((0, _stringify2.default)(object));
}

function fastEqual(object1, object2) {
  return (0, _stringify2.default)(object1) === (0, _stringify2.default)(object2);
}

function isLocalCollection(collectionName) {
  var firstLetter = collectionName[0];
  return firstLetter === '_' || firstLetter === '$';
}

function parsePath(path) {
  if (Array.isArray(path) && path.length === 1) {
    path = path[0];
  }
  if (!Array.isArray(path)) {
    path = path.split('.');
  }

  return path;
}

function parseArguments() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length > 1) return args;

  return parsePath((0, _from2.default)(args[0]));
}

exports.default = {
  arrayRemove: arrayRemove,
  deepClone: deepClone,
  dbFields: dbFields,
  fastEqual: fastEqual,
  isServer: isServer,
  isLocalCollection: isLocalCollection,
  parsePath: parsePath,
  parseArguments: parseArguments
};
module.exports = exports['default'];