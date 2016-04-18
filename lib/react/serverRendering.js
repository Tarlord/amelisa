'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var render = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(method, Component) {
    var baseProps = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
    var baseChildren = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];
    var promises = arguments.length <= 4 || arguments[4] === undefined ? [] : arguments[4];
    var nextPromises, index, html, datas, onFetch, replacement, callback;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            callback = function callback() {
              html = _server2.default[method](_react2.default.createElement(
                Component,
                baseProps,
                baseChildren
              ));
            };

            replacement = function replacement(originalCreateElement) {
              for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }

              var type = args[0];
              var props = args[1];

              if (!props) props = args[1] = {};
              // console.log('type', type.name || type, isContainer(type), datas.length)

              if (isContainer(type)) {
                if (datas.length) {
                  var data = datas.shift();
                  (0, _assign2.default)(props, data, { hasResults: true });
                  var promise = promises[index];
                  nextPromises.push(promise);
                } else {
                  props.onFetch = onFetch;
                }
                index++;
              }

              return originalCreateElement.apply(null, args);
            };

            baseProps = (0, _assign2.default)({}, baseProps);
            nextPromises = [];
            index = 0;
            html = void 0;
            _context.next = 8;
            return _promise2.default.all(promises);

          case 8:
            datas = _context.sent;

            onFetch = function onFetch(promise) {
              nextPromises.push(promise);
            };

            overrideCreateElement(replacement, callback);

            if (!(promises.length < nextPromises.length)) {
              _context.next = 13;
              break;
            }

            return _context.abrupt('return', render(method, Component, baseProps, baseChildren, nextPromises.slice()));

          case 13:
            return _context.abrupt('return', html);

          case 14:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function render(_x, _x2, _x3, _x4, _x5) {
    return ref.apply(this, arguments);
  };
}();

var renderToString = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt('return', render.apply(null, ['renderToString'].concat(args)));

          case 1:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return function renderToString(_x9) {
    return ref.apply(this, arguments);
  };
}();

var renderToStaticMarkup = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt('return', render.apply(null, ['renderToStaticMarkup'].concat(args)));

          case 1:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return function renderToStaticMarkup(_x10) {
    return ref.apply(this, arguments);
  };
}();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isContainer(Container) {
  return Container && Container.isContainer;
}

function overrideCreateElement(replacement, callback) {
  var originalCreateElement = _react2.default.createElement;

  _react2.default.createElement = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return replacement.apply(null, [originalCreateElement].concat(args));
  };

  callback();

  _react2.default.createElement = originalCreateElement;
}

exports.default = {
  renderToString: renderToString,
  renderToStaticMarkup: renderToStaticMarkup
};
module.exports = exports['default'];