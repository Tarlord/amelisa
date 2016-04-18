'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _setImmediate2 = require('babel-runtime/core-js/set-immediate');

var _setImmediate3 = _interopRequireDefault(_setImmediate2);

var _Model = require('../client/Model');

var _Model2 = _interopRequireDefault(_Model);

var _WebSocketChannel = require('../client/WebSocketChannel');

var _WebSocketChannel2 = _interopRequireDefault(_WebSocketChannel);

var _SqliteStorage = require('./SqliteStorage');

var _SqliteStorage2 = _interopRequireDefault(_SqliteStorage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getStorage(collectionNames) {
  return new _SqliteStorage2.default(collectionNames);
}

function getModel() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var channel = options.channel;
  var url = options.url;
  var wsOptions = options.wsOptions;
  var modelOptions = options.modelOptions;
  var dbQueries = options.dbQueries;


  if (!channel) {
    url = url || 'ws://localhost:3000';

    channel = new _WebSocketChannel2.default(url, wsOptions);
  }

  var model = new _Model2.default(channel, modelOptions, dbQueries);

  window.model = model;

  model.getStorage = getStorage;

  // setTimeout workes unpredictably in react-native while debugging
  // so we use setImmediate
  (0, _setImmediate3.default)(function () {
    return channel.open();
  });

  return model;
}

exports.default = getModel;
module.exports = exports['default'];