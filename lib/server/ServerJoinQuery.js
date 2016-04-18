'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _toArray2 = require('babel-runtime/helpers/toArray');

var _toArray3 = _interopRequireDefault(_toArray2);

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

var _ServerQuery2 = require('./ServerQuery');

var _ServerQuery3 = _interopRequireDefault(_ServerQuery2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ServerJoinQuery = function (_ServerQuery) {
  (0, _inherits3.default)(ServerJoinQuery, _ServerQuery);

  function ServerJoinQuery(collectionName, expression, store, querySet, joinFields) {
    (0, _classCallCheck3.default)(this, ServerJoinQuery);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ServerJoinQuery).call(this, collectionName, expression, store, querySet));

    _this.joinFieldValues = {};
    for (var field in joinFields) {
      var value = joinFields[field];
      value = value.slice(1);
      var parts = value.split('.');

      var _parts = (0, _toArray3.default)(parts);

      var _collectionName = _parts[0];
      var docId = _parts[1];

      var fields = _parts.slice(2);

      _this.joinFieldValues[field] = {
        collectionName: _collectionName,
        docId: docId,
        fields: fields.join('.')
      };
    }

    var loadedFields = [];

    _this.loadJoinFields().then(function () {
      var _loop = function _loop(_field) {
        var joinFieldValue = _this.joinFieldValues[_field];
        var doc = joinFieldValue.doc;
        var fields = joinFieldValue.fields;


        var onFieldChange = function onFieldChange() {
          var value = doc.get(fields);

          if (value === undefined) return;
          if (loadedFields.indexOf(_field) === -1) loadedFields.push(_field);

          if (loadedFields.length < (0, _keys2.default)(_this.joinFieldValues).length) return;

          expression[_field] = value;
          _this.load();
        };

        doc.on('saved', onFieldChange);

        if (doc.loaded) {
          onFieldChange();
        } else {
          doc.once('loaded', onFieldChange);
        }
      };

      for (var _field in _this.joinFieldValues) {
        _loop(_field);
      }
    });
    return _this;
  }

  (0, _createClass3.default)(ServerJoinQuery, [{
    key: 'loadJoinFields',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var _this2 = this;

        var promises, _loop2, field;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                promises = [];

                _loop2 = function _loop2(field) {
                  var joinFieldValue = _this2.joinFieldValues[field];
                  var collectionName = joinFieldValue.collectionName;
                  var docId = joinFieldValue.docId;


                  var promise = _this2.store.docSet.getOrCreateDoc(collectionName, docId).then(function (doc) {
                    joinFieldValue.doc = doc;
                  });
                  promises.push(promise);
                };

                for (field in this.joinFieldValues) {
                  _loop2(field);
                }

                return _context.abrupt('return', _promise2.default.all(promises));

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function loadJoinFields() {
        return ref.apply(this, arguments);
      }

      return loadJoinFields;
    }()
  }]);
  return ServerJoinQuery;
}(_ServerQuery3.default);

exports.default = ServerJoinQuery;
module.exports = exports['default'];