'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ServerSocketChannel = function (_EventEmitter) {
  (0, _inherits3.default)(ServerSocketChannel, _EventEmitter);

  function ServerSocketChannel(socket, req) {
    (0, _classCallCheck3.default)(this, ServerSocketChannel);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ServerSocketChannel).call(this));

    _this.socket = socket;
    _this.req = req;
    _this.server = false;
    _this.opened = true;

    socket.on('message', function (json) {
      var message = void 0;
      try {
        message = JSON.parse(json);
      } catch (err) {
        return console.error('ServerSocketChannel unable to parse json', json);
      }
      _this.emit('message', message);
    });

    socket.on('close', function () {
      _this.opened = false;
      _this.emit('close');
    });

    socket.on('error', function (err) {
      _this.opened = false;
      _this.emit('error', err);
    });
    return _this;
  }

  (0, _createClass3.default)(ServerSocketChannel, [{
    key: 'send',
    value: function send(message) {
      if (!this.opened) return;

      var json = void 0;
      try {
        json = (0, _stringify2.default)(message);
      } catch (err) {
        return console.error('ServerSocketChannel unable to create json', message);
      }

      try {
        this.socket.send(json, this.ack);
      } catch (err) {
        console.error(err);
      }
    }
  }, {
    key: 'ack',
    value: function ack(err) {
      if (err) console.error(err);
    }
  }]);
  return ServerSocketChannel;
}(_events.EventEmitter);

exports.default = ServerSocketChannel;
module.exports = exports['default'];