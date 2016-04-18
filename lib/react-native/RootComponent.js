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

var _reactNative = require('react-native');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RootComponent = function (_Component) {
  (0, _inherits3.default)(RootComponent, _Component);

  function RootComponent() {
    (0, _classCallCheck3.default)(this, RootComponent);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(RootComponent).apply(this, arguments));
  }

  (0, _createClass3.default)(RootComponent, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        model: this.props.model
      };
    }
  }]);
  return RootComponent;
}(_reactNative.Component);

RootComponent.propTypes = {
  model: _reactNative.PropTypes.object
};
RootComponent.childContextTypes = {
  model: _reactNative.PropTypes.object
};
exports.default = RootComponent;
module.exports = exports['default'];