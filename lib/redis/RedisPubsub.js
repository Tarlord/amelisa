'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

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

var _RedisChannel = require('./RedisChannel');

var _RedisChannel2 = _interopRequireDefault(_RedisChannel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RedisPubsub = function (_EventEmitter) {
  (0, _inherits3.default)(RedisPubsub, _EventEmitter);

  function RedisPubsub(url) {
    (0, _classCallCheck3.default)(this, RedisPubsub);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(RedisPubsub).call(this));

    _this.url = url;
    return _this;
  }

  (0, _createClass3.default)(RedisPubsub, [{
    key: 'init',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var _this2 = this;

        var pub, sub;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                pub = new _RedisChannel2.default(this.url);
                sub = new _RedisChannel2.default(this.url, true);


                this.send = pub.send.bind(pub);
                sub.on('message', function (message) {
                  _this2.emit('message', message);
                });

                _context.next = 6;
                return pub.init();

              case 6:
                _context.next = 8;
                return sub.init();

              case 8:
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
  }]);
  return RedisPubsub;
}(_events.EventEmitter);

exports.default = RedisPubsub;
module.exports = exports['default'];