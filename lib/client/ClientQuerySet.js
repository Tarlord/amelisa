'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _LocalQuery = require('./LocalQuery');

var _LocalQuery2 = _interopRequireDefault(_LocalQuery);

var _RemoteQuery = require('./RemoteQuery');

var _RemoteQuery2 = _interopRequireDefault(_RemoteQuery);

var _util = require('../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ClientQuerySet = function () {
  function ClientQuerySet(model) {
    (0, _classCallCheck3.default)(this, ClientQuerySet);

    this.model = model;
    this.data = {};
  }

  (0, _createClass3.default)(ClientQuerySet, [{
    key: 'getOrCreateQuery',
    value: function getOrCreateQuery(collectionName, expression) {
      expression = (0, _assign2.default)({}, expression);
      var hash = this.getQueryHash(collectionName, expression);
      var query = this.data[hash];

      if (!query) {
        var collection = this.model.collectionSet.getOrCreateCollection(collectionName);
        if ((0, _util.isLocalCollection)(collectionName)) {
          query = new _LocalQuery2.default(collectionName, expression, this.model, collection, this);
        } else {
          query = new _RemoteQuery2.default(collectionName, expression, this.model, collection, this);
        }
        this.data[hash] = query;
      }

      return query;
    }
  }, {
    key: 'unattach',
    value: function unattach(collectionName, expression) {
      var hash = this.getQueryHash(collectionName, expression);
      var query = this.data[hash];
      query.collection.removeListener('change', query.listener);
      delete this.data[hash];
    }
  }, {
    key: 'getSyncData',
    value: function getSyncData() {
      var data = {};

      for (var hash in this.data) {
        var query = this.data[hash];
        if ((0, _util.isLocalCollection)(query.collectionName)) continue;
        if (!query.subscribed) continue;
        data[hash] = query.getSyncData();
      }

      return data;
    }
  }, {
    key: 'getQueryHash',
    value: function getQueryHash(collectionName, expression) {
      var args = [collectionName, expression];
      return (0, _stringify2.default)(args).replace(/\./g, '|');
    }
  }]);
  return ClientQuerySet;
}();

exports.default = ClientQuerySet;
module.exports = exports['default'];