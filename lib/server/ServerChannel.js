'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _util = require('../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ServerChannel = function (_EventEmitter) {
  (0, _inherits3.default)(ServerChannel, _EventEmitter);

  function ServerChannel() {
    (0, _classCallCheck3.default)(this, ServerChannel);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ServerChannel).call(this));

    _this.server = true;
    _this.opened = false;
    return _this;
  }

  (0, _createClass3.default)(ServerChannel, [{
    key: 'open',
    value: function open() {
      if (this.opened) return;
      this.opened = true;
      this.emit('open');

      if (!this.pipedChannel) return;
      this.pipedChannel.open();
    }
  }, {
    key: 'close',
    value: function close() {
      if (!this.opened) return;
      this.opened = false;
      this.emit('close');

      if (!this.pipedChannel) return;
      this.pipedChannel.close();
    }
  }, {
    key: 'send',
    value: function send(message) {}
  }, {
    key: 'pipe',
    value: function pipe(channel) {
      var _this2 = this;

      if (this.pipedChannel) {
        this.pipedChannel.send = function () {};
      }

      this.pipedChannel = channel;
      channel.send = function (message) {
        if (!channel.opened) return;

        // make it intentionally async
        process.nextTick(function () {
          _this2.emit('message', (0, _util.deepClone)(message));
        });
      };

      return channel;
    }
  }]);
  return ServerChannel;
}(_events.EventEmitter);

exports.default = ServerChannel;
module.exports = exports['default'];