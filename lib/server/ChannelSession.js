'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _Doc = require('../client/Doc');

var _Doc2 = _interopRequireDefault(_Doc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ChannelSession = function () {
  function ChannelSession() {
    (0, _classCallCheck3.default)(this, ChannelSession);

    this.collections = {};
  }

  (0, _createClass3.default)(ChannelSession, [{
    key: 'getDocVersion',
    value: function getDocVersion(collectionName, docId) {
      var collection = this.collections[collectionName];
      return collection && collection[docId];
    }
  }, {
    key: 'saveDocVersion',
    value: function saveDocVersion(collectionName, docId, version) {
      var collection = this.collections[collectionName] || (this.collections[collectionName] = {});
      collection[docId] = version;
    }
  }, {
    key: 'updateDocVersion',
    value: function updateDocVersion(collectionName, docId, source, date) {
      var version = this.getDocVersion(collectionName, docId);

      var map = _Doc2.default.prototype.getMapFromVersion(version);

      map[source] = date;

      var versions = [];
      for (var _source in map) {
        var _date = map[_source];
        versions.push(_source + ' ' + _date);
      }

      this.saveDocVersion(collectionName, docId, versions.join('|'));
    }
  }]);
  return ChannelSession;
}();

exports.default = ChannelSession;
module.exports = exports['default'];