'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _mingo = require('mingo');

var _mingo2 = _interopRequireDefault(_mingo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mingo2.default.setup({
  key: '_id'
});

var metaOperators = {
  $comment: true,
  $explain: true,
  $hint: true,
  $limit: true,
  $maxScan: true,
  $max: true,
  $min: true,
  $orderby: true,
  $returnKey: true,
  $showDiskLoc: true,
  $skip: true,
  $snapshot: true,
  $count: true,
  $aggregate: true,
  $distinct: true,
  $field: true
};

var notDocsOperators = {
  $count: true,
  $aggregate: true,
  $distinct: true,
  $mapReduce: true
};

var MongoQueries = function () {
  function MongoQueries() {
    (0, _classCallCheck3.default)(this, MongoQueries);
  }

  (0, _createClass3.default)(MongoQueries, [{
    key: 'getAllSelector',
    value: function getAllSelector() {
      return {};
    }
  }, {
    key: 'getQueryResultFromArray',
    value: function getQueryResultFromArray(allDocs, expression) {
      var query = this.normalizeQuery(expression);

      if (query.$aggregate) {
        var agg = new _mingo2.default.Aggregator(query.$aggregate);
        return agg.run(allDocs);
      }

      var mingoQuery = new _mingo2.default.Query(query.$query);
      var cursor = mingoQuery.find(allDocs);

      if (query.$orderby) cursor.sort(query.$orderby);

      if (query.$skip) cursor.skip(query.$skip);

      if (query.$limit) cursor.limit(query.$limit);

      if (query.$findOptions) {
        for (var key in query.$findOptions) {
          var value = query.$findOptions[key];
          cursor = cursor[key](value);
        }
      }

      if (query.$count) return cursor.count();

      if (query.$distinct) {
        return cursor.all().map(function (doc) {
          return doc[query.$field];
        });
      }

      // TODO: implement $mapReduce

      return cursor.all();
    }
  }, {
    key: 'normalizeQuery',
    value: function normalizeQuery(expression) {
      // Box queries inside of a $query and clone so that we know where to look
      // for selctors and can modify them without affecting the original object
      var query = void 0;
      if (expression.$query) {
        query = (0, _assign2.default)({}, expression);
        query.$query = (0, _assign2.default)({}, query.$query);
      } else {
        query = { $query: {} };
        for (var key in expression) {
          if (metaOperators[key]) {
            query[key] = expression[key];
          } else {
            query.$query[key] = expression[key];
          }
        }
      }

      // Do not return deleted docs
      query.$query._del = {
        $ne: true
      };

      return query;
    }
  }, {
    key: 'isDocsQuery',
    value: function isDocsQuery(expression) {
      var query = this.normalizeQuery(expression);

      for (var key in query) {
        if (notDocsOperators[key]) return false;
      }

      return true;
    }
  }, {
    key: 'isJoinField',
    value: function isJoinField(value) {
      if (value && typeof value === 'string' && value[0] === '$') {
        return true;
      }

      return false;
    }
  }, {
    key: 'isJoinQuery',
    value: function isJoinQuery(expression) {
      var query = this.normalizeQuery(expression);

      for (var key in query.$query) {
        var value = query.$query[key];
        if (this.isJoinField(value)) return true;
      }

      return false;
    }
  }, {
    key: 'getJoinFields',
    value: function getJoinFields(expression) {
      var query = this.normalizeQuery(expression);
      var joinFields = {};

      for (var key in query.$query) {
        var value = query.$query[key];
        if (this.isJoinField(value)) {
          joinFields[key] = value;
        }
      }

      return joinFields;
    }
  }]);
  return MongoQueries;
}();

exports.default = MongoQueries;
module.exports = exports['default'];