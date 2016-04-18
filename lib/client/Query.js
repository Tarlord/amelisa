'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

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

var _events = require('events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultGetOptions = {
  map: false
};

var Query = function (_EventEmitter) {
  (0, _inherits3.default)(Query, _EventEmitter);

  function Query(collectionName, expression) {
    (0, _classCallCheck3.default)(this, Query);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Query).call(this));

    _this.collectionName = collectionName;
    _this.data = [];
    return _this;
  }

  (0, _createClass3.default)(Query, [{
    key: 'get',
    value: function get(options) {
      var _this2 = this;

      if (!this.isDocs) return this.data;

      options = (0, _assign2.default)({}, defaultGetOptions, options);

      if (options.map) {
        var map = {};
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _getIterator3.default)(this.data), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var docId = _step.value;

            map[docId] = this.collection.get(docId);
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

        return map;
      }

      return this.data.map(function (docId) {
        return _this2.collection.get(docId);
      })
      // FIXME: we need this to avoid race condition with del
      .filter(function (docData) {
        return docData;
      });
    }
  }]);
  return Query;
}(_events.EventEmitter);

exports.default = Query;
module.exports = exports['default'];