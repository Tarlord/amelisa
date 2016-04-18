'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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

var _redisUrl = require('redis-url');

var _redisUrl2 = _interopRequireDefault(_redisUrl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var channelName = 'op';

var RedisChannel = function (_EventEmitter) {
  (0, _inherits3.default)(RedisChannel, _EventEmitter);

  function RedisChannel(url) {
    var sub = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
    (0, _classCallCheck3.default)(this, RedisChannel);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(RedisChannel).call(this));

    _this.url = url;
    _this.sub = sub;
    return _this;
  }

  (0, _createClass3.default)(RedisChannel, [{
    key: 'init',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var _this2 = this;

        var db;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                db = this.db = _redisUrl2.default.connect(this.url);
                return _context.abrupt('return', new _promise2.default(function (resolve, reject) {
                  db.on('connect', function () {
                    if (!_this2.sub) return resolve();

                    db.on('subscribe', resolve);
                    db.on('message', function (channelName, message) {
                      message = JSON.parse(message);
                      _this2.emit('message', message);
                    });
                    db.subscribe(channelName);
                  });
                }));

              case 2:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function init() {
        return ref.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: 'send',
    value: function send(message) {
      message = (0, _stringify2.default)(message);
      this.db.publish(channelName, message);
    }
  }]);
  return RedisChannel;
}(_events.EventEmitter);

exports.default = RedisChannel;
module.exports = exports['default'];