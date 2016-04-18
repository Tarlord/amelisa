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

var Input = function (_Component) {
  (0, _inherits3.default)(Input, _Component);

  function Input(props, context) {
    (0, _classCallCheck3.default)(this, Input);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Input).call(this));

    _initialiseProps.call(_this);

    var collectionName = props.collectionName;
    var docId = props.docId;
    var field = props.field;

    var value = context.model.get(collectionName, docId, field);

    _this.state = {
      value: value
    };
    return _this;
  }

  (0, _createClass3.default)(Input, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var _props = this.props;
      var collectionName = _props.collectionName;
      var docId = _props.docId;
      var field = _props.field;

      var doc = this.context.model.doc(collectionName, docId);

      doc.on('stringInsert', function (eventField, index, howMany) {
        if (eventField !== field) return;
        var value = doc.get(field);
        var input = _this2.refs['input'];
        var selectionStart = input.selectionStart;
        var selectionEnd = input.selectionEnd;

        if (selectionStart > index + howMany) selectionStart = selectionStart + howMany;
        if (selectionEnd > index + howMany) selectionEnd = selectionEnd + howMany;

        _this2.setState({
          value: value
        });
        input.setSelectionRange(selectionStart, selectionEnd);
      });

      doc.on('stringRemove', function (eventField, index, howMany) {
        if (eventField !== field) return;
        var value = doc.get(field);
        var input = _this2.refs['input'];
        var selectionStart = input.selectionStart;
        var selectionEnd = input.selectionEnd;

        if (selectionStart > index) selectionStart = selectionStart - howMany;
        if (selectionEnd > index) selectionEnd = selectionEnd - howMany;

        _this2.setState({
          value: value
        });
        input.setSelectionRange(selectionStart, selectionEnd);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var value = this.state.value;


      return _react2.default.createElement('textarea', { ref: 'input', className: 'input', onChange: this.onChange, value: value });
    }
  }]);
  return Input;
}(_react.Component);

Input.contextTypes = {
  model: _react.PropTypes.object
};
Input.propTypes = {
  collectionName: _react.PropTypes.string,
  docId: _react.PropTypes.string,
  field: _react.PropTypes.string
};

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.onChange = function (event) {
    var _props2 = _this3.props;
    var collectionName = _props2.collectionName;
    var docId = _props2.docId;
    var field = _props2.field;
    var value = event.nativeEvent.target.value;

    _this3.context.model.stringDiff([collectionName, docId, field], value);
  };
};

exports.default = Input;
module.exports = exports['default'];