'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _events = require('events');

var _reconnectableWebsocket = require('reconnectable-websocket');

var _reconnectableWebsocket2 = _interopRequireDefault(_reconnectableWebsocket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultOptions = {
  automaticOpen: false,
  reconnectOnError: true,
  reconnectInterval: 3000
};

var WebSocketChannel = function (_EventEmitter) {
  (0, _inherits3.default)(WebSocketChannel, _EventEmitter);

  function WebSocketChannel(url) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    (0, _classCallCheck3.default)(this, WebSocketChannel);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(WebSocketChannel).call(this));

    options = (0, _assign2.default)({}, defaultOptions, options);
    var socket = _this.socket = new _reconnectableWebsocket2.default(url, null, options);

    socket.onopen = function () {
      _this.emit('open');
    };

    socket.onmessage = function (e) {
      var json = e.data;
      var message = void 0;
      try {
        message = JSON.parse(json);
      } catch (err) {
        return console.error('WebSocketChannel unable to parse json', json);
      }
      _this.emit('message', message);
    };

    socket.onclose = function () {
      _this.emit('close');
    };

    socket.onerror = function (err) {
      _this.emit('error', err);
    };
    return _this;
  }

  (0, _createClass3.default)(WebSocketChannel, [{
    key: 'open',
    value: function open() {
      this.socket.open && this.socket.open();
    }
  }, {
    key: 'close',
    value: function close() {
      this.socket.close && this.socket.close();
    }
  }, {
    key: 'send',
    value: function send(message) {
      var json = void 0;
      try {
        json = (0, _stringify2.default)(message);
      } catch (err) {
        return console.error('WebSocketChannel unable to create json', message);
      }

      try {
        this.socket.send(json);
      } catch (err) {
        console.error(err);
      }
    }
  }]);
  return WebSocketChannel;
}(_events.EventEmitter);

exports.default = WebSocketChannel;
module.exports = exports['default'];