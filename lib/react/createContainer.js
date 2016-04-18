'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

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

var _Loading = require('./Loading');

var _Loading2 = _interopRequireDefault(_Loading);

var _util = require('../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createContainer(Component) {
  if (!Component.prototype.subscribe) {
    throw new Error(Component.name + ' should has \'subscribe\' method for \'createContainer\'');
  }

  var Container = function (_React$Component) {
    (0, _inherits3.default)(Container, _React$Component);

    function Container(props) {
      (0, _classCallCheck3.default)(this, Container);

      var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Container).call(this));

      var hasResults = props.hasResults;

      _this.state = {
        hasResults: hasResults
      };
      _this.mounted = false;
      return _this;
    }

    (0, _createClass3.default)(Container, [{
      key: 'componentWillMount',
      value: function componentWillMount() {
        var subscribeData = this.getSubscribeData(this.props);
        this.setSubscription(subscribeData);
        this.subscribeData = subscribeData;
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.mounted = true;
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this.mounted = false;
        if (!this.subscription) return;

        this.subscription.unsubscribe();
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        var subscribeData = this.getSubscribeData(nextProps);
        if (!(0, _util.fastEqual)(subscribeData, this.subscribeData)) {
          this.setSubscribeData(subscribeData);
        }
      }
    }, {
      key: 'getSubscribeData',
      value: function getSubscribeData(props) {
        var context = this.context;

        var component = new Component(props, context);
        return component.subscribe.call({ props: props, context: context });
      }
    }, {
      key: 'setSubscribeData',
      value: function setSubscribeData(nextSubscribeData) {
        this.setDataKeysAndRawSubscribes(nextSubscribeData);
        this.subscription.changeSubscribes(this.rawSubscribes);
        this.subscribeData = nextSubscribeData;
      }
    }, {
      key: 'setDataKeysAndRawSubscribes',
      value: function setDataKeysAndRawSubscribes(subscribeData) {
        this.dataKeys = [];
        this.rawSubscribes = [];

        for (var dataKey in subscribeData) {
          this.dataKeys.push(dataKey);
          this.rawSubscribes.push(subscribeData[dataKey]);
        }
      }
    }, {
      key: 'setSubscription',
      value: function setSubscription(subscribeData) {
        var _this2 = this;

        var onFetch = this.props.onFetch;
        var hasResults = this.state.hasResults;
        var model = this.context.model;


        this.setDataKeysAndRawSubscribes(subscribeData);

        // server rendering
        if (_util.isServer && onFetch && !hasResults) {
          // eslint-disable-line
          var promise = model.subscribe(this.rawSubscribes).then(function (subscription) {
            _this2.subscription = subscription;

            return _this2.getPropsFromSubscription(subscription);
          });

          onFetch(promise); // eslint-disable-line

          return promise;
        }

        return model.subscribe(this.rawSubscribes).then(function (subscription) {
          _this2.subscription = subscription;

          if (!_util.isServer) {
            subscription.on('change', function () {
              _this2.refresh();
            });
          }

          _this2.refresh();
        });
      }
    }, {
      key: 'refresh',
      value: function refresh() {
        if (!this.mounted) return;
        var hasResults = this.state.hasResults;


        if (hasResults) {
          this.forceUpdate();
        } else {
          this.setState({
            hasResults: true
          });
        }
      }
    }, {
      key: 'getPropsFromSubscription',
      value: function getPropsFromSubscription(subscription) {
        var subscribes = subscription.subscribes;

        var dataProps = {};
        for (var i = 0; i < subscribes.length; i++) {
          var subscribe = subscribes[i];
          var dataKey = this.dataKeys[i];
          var options = this.subscribeData[dataKey][2];
          var data = subscribe.get(options);

          dataProps[dataKey] = (0, _util.deepClone)(data);
        }

        var utilProps = {
          setSubscribeData: this.setSubscribeData.bind(this)
        };
        return (0, _assign2.default)({}, dataProps, this.props || {}, utilProps);
      }
    }, {
      key: 'render',
      value: function render() {
        var hasResults = this.state.hasResults;


        if (!hasResults) return _react2.default.createElement(_Loading2.default, null);

        var props = this.props;
        if (this.subscription) {
          props = this.getPropsFromSubscription(this.subscription);
        }

        return _react2.default.createElement(Component, props);
      }
    }]);
    return Container;
  }(_react2.default.Component);

  Container.contextTypes = {
    model: _react.PropTypes.object
  };
  Container.propTypes = {
    hasResults: _react.PropTypes.bool,
    onFetch: _react.PropTypes.func
  };
  Container.isContainer = true;
  Container.displayName = Component.name + ' Container';


  return Container;
}

exports.default = createContainer;
module.exports = exports['default'];