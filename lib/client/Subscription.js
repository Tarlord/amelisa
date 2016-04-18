'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

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

var _MutableDoc = require('./MutableDoc');

var _MutableDoc2 = _interopRequireDefault(_MutableDoc);

var _ClientQuery = require('./ClientQuery');

var _ClientQuery2 = _interopRequireDefault(_ClientQuery);

var _UrlQuery = require('./UrlQuery');

var _UrlQuery2 = _interopRequireDefault(_UrlQuery);

var _util = require('../util');

var _events = require('events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Subscription = function (_EventEmitter) {
  (0, _inherits3.default)(Subscription, _EventEmitter);

  function Subscription(rawSubscribes, collectionSet, querySet) {
    (0, _classCallCheck3.default)(this, Subscription);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Subscription).call(this));

    _this.collectionSet = collectionSet;
    _this.querySet = querySet;

    _this.parseRawSubscribes(rawSubscribes);

    _this.onChange = _this.onChange.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(Subscription, [{
    key: 'parseRawSubscribes',
    value: function parseRawSubscribes(rawSubscribes) {
      var subscribes = [];
      var subscribeOptionses = [];

      if (Array.isArray(rawSubscribes) && rawSubscribes.length === 1 && Array.isArray(rawSubscribes[0])) {
        rawSubscribes = rawSubscribes[0];
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(rawSubscribes), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var rawSubscribe = _step.value;

          var subscribe = void 0;
          var subscribeOptions = void 0;
          if (rawSubscribe instanceof _MutableDoc2.default || rawSubscribe instanceof _ClientQuery2.default) {
            subscribe = rawSubscribe;
          } else if (Array.isArray(rawSubscribe) && typeof rawSubscribe[0] === 'string' && (rawSubscribe[0].indexOf('http') === 0 || rawSubscribe[0].indexOf('/') === 0)) {
            var _rawSubscribe = (0, _slicedToArray3.default)(rawSubscribe, 3);

            var url = _rawSubscribe[0];
            var defaultValue = _rawSubscribe[1];
            var options = _rawSubscribe[2];

            subscribe = new _UrlQuery2.default(url, defaultValue, this.collectionSet.model);
            subscribeOptions = options;
          } else if ((typeof rawSubscribe === 'undefined' ? 'undefined' : (0, _typeof3.default)(rawSubscribe)) === 'object' && !Array.isArray(rawSubscribe)) {
            this.options = rawSubscribe;
            continue;
          } else {
            var _parsePath = (0, _util.parsePath)(rawSubscribe);

            var _parsePath2 = (0, _slicedToArray3.default)(_parsePath, 4);

            var collectionName = _parsePath2[0];
            var docIdOrExpression = _parsePath2[1];
            var _options = _parsePath2[2];
            var options2 = _parsePath2[3];


            if (typeof docIdOrExpression === 'string') {
              subscribe = this.collectionSet.getOrCreateDoc(collectionName, docIdOrExpression);
              subscribeOptions = options2 || _options;
            } else {
              subscribe = this.querySet.getOrCreateQuery(collectionName, docIdOrExpression);
              subscribeOptions = options2 || _options;
            }
          }
          subscribes.push(subscribe);
          subscribeOptionses.push(subscribeOptions);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this.subscribes = subscribes;
      this.subscribeOptionses = subscribeOptionses;
    }
  }, {
    key: 'fetch',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt('return', _promise2.default.all(this.subscribes.map(function (subscribe) {
                  return subscribe.fetch();
                })));

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function fetch() {
        return ref.apply(this, arguments);
      }

      return fetch;
    }()
  }, {
    key: 'subscribe',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        var promises, i, _subscribe, subscribeOptions, promise;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                promises = [];


                for (i = 0; i < this.subscribes.length; i++) {
                  _subscribe = this.subscribes[i];

                  _subscribe.on('change', this.onChange);

                  subscribeOptions = this.subscribeOptionses[i];

                  subscribeOptions = (0, _assign2.default)({}, this.options, subscribeOptions);

                  promise = _subscribe.subscribe(subscribeOptions);

                  promises.push(promise);
                }

                return _context2.abrupt('return', _promise2.default.all(promises));

              case 3:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function subscribe() {
        return ref.apply(this, arguments);
      }

      return subscribe;
    }()
  }, {
    key: 'unsubscribe',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
        var _this2 = this;

        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt('return', _promise2.default.all(this.subscribes.map(function (subscribe) {
                  subscribe.removeListener('change', _this2.onChange);
                  return subscribe.unsubscribe();
                })));

              case 1:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function unsubscribe() {
        return ref.apply(this, arguments);
      }

      return unsubscribe;
    }()
  }, {
    key: 'onChange',
    value: function onChange() {
      this.emit('change');
    }
  }, {
    key: 'changeSubscribes',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(nextRawSubscribes) {
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                this.unsubscribe();
                this.parseRawSubscribes(nextRawSubscribes);
                return _context4.abrupt('return', this.subscribe());

              case 3:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function changeSubscribes(_x) {
        return ref.apply(this, arguments);
      }

      return changeSubscribes;
    }()
  }, {
    key: 'get',
    value: function get() {
      return this.subscribes.map(function (subscribe) {
        return subscribe.get();
      });
    }
  }]);
  return Subscription;
}(_events.EventEmitter);

exports.default = Subscription;
module.exports = exports['default'];