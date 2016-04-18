'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var onBundleReady = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _dom.onDomReady)();

          case 2:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function onBundleReady() {
    return ref.apply(this, arguments);
  };
}();

var _Model = require('../client/Model');

var _Model2 = _interopRequireDefault(_Model);

var _WebSocketChannel = require('../client/WebSocketChannel');

var _WebSocketChannel2 = _interopRequireDefault(_WebSocketChannel);

var _IndexedDbStorage = require('../web/IndexedDbStorage');

var _IndexedDbStorage2 = _interopRequireDefault(_IndexedDbStorage);

var _dom = require('../web/dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getStorage(collectionNames, version) {
  return new _IndexedDbStorage2.default(collectionNames, version);
}

function getModel() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var channel = options.channel;
  var url = options.url;
  var wsOptions = options.wsOptions;
  var modelOptions = options.modelOptions;
  var dbQueries = options.dbQueries;


  if (!channel) {
    url = url || 'ws://' + window.location.host;

    channel = new _WebSocketChannel2.default(url, wsOptions);
  }

  var model = new _Model2.default(channel, modelOptions, dbQueries);

  window.model = model;

  model.getStorage = getStorage;
  model.onBundleReady = onBundleReady;
  model.getBundleJsonFromDom = _dom.getBundleJsonFromDom;

  setTimeout(function () {
    return channel.open();
  }, 0);

  return model;
}

exports.default = getModel;
module.exports = exports['default'];