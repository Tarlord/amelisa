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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HtmlLayout = function (_React$Component) {
  (0, _inherits3.default)(HtmlLayout, _React$Component);

  function HtmlLayout() {
    (0, _classCallCheck3.default)(this, HtmlLayout);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(HtmlLayout).apply(this, arguments));
  }

  (0, _createClass3.default)(HtmlLayout, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var head = _props.head;
      var children = _props.children;
      var model = _props.model;

      var json = model.getBundleJson();

      return _react2.default.createElement(
        'html',
        null,
        _react2.default.createElement(
          'head',
          null,
          _react2.default.createElement('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }),
          head
        ),
        _react2.default.createElement(
          'body',
          null,
          _react2.default.createElement(
            'div',
            { id: 'app' },
            children
          ),
          _react2.default.createElement('script', { defer: true, src: '/js/bundle.js' }),
          _react2.default.createElement('script', { type: 'application/json', id: 'bundle', dangerouslySetInnerHTML: { __html: json } })
        )
      );
    }
  }]);
  return HtmlLayout;
}(_react2.default.Component);

HtmlLayout.propTypes = {
  head: _react.PropTypes.any,
  children: _react.PropTypes.any,
  model: _react.PropTypes.object
};
exports.default = HtmlLayout;
module.exports = exports['default'];