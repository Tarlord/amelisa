'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createElement = require('./createElement');

var _createElement2 = _interopRequireDefault(_createElement);

var _serverRendering = require('./serverRendering');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  createElement: _createElement2.default,
  renderToString: _serverRendering.renderToString,
  renderToStaticMarkup: _serverRendering.renderToStaticMarkup
};
module.exports = exports['default'];