'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _ClientQuery2 = require('./ClientQuery');

var _ClientQuery3 = _interopRequireDefault(_ClientQuery2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultSubscribeOptions = {
  fetch: true
};

var RemoteQuery = function (_ClientQuery) {
  (0, _inherits3.default)(RemoteQuery, _ClientQuery);

  function RemoteQuery(collectionName, expression, model, collection, querySet) {
    (0, _classCallCheck3.default)(this, RemoteQuery);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(RemoteQuery).call(this, collectionName, expression, model, collection, querySet));

    _this.subscribed = 0;
    _this.subscribing = false;
    return _this;
  }

  (0, _createClass3.default)(RemoteQuery, [{
    key: 'fetch',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var op;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!this.subscribing) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt('return', this.subscribingPromise);

              case 2:
                this.subscribing = true;

                this.refresh();
                this.lastServerData = this.data;

                op = {
                  type: 'qfetch',
                  collectionName: this.collection.name,
                  expression: this.expression
                };


                if (this.isDocs) op.docIds = this.data;

                this.subscribingPromise = this.model.sendOp(op);
                return _context.abrupt('return', this.subscribingPromise);

              case 9:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function fetch() {
        return ref.apply(this, arguments);
      }

      return fetch;
    }()
  }, {
    key: 'subscribe',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(options) {
        var op;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                options = (0, _assign2.default)({}, defaultSubscribeOptions, options);
                this.subscribed++;

                if (!this.subscribing) {
                  _context2.next = 4;
                  break;
                }

                return _context2.abrupt('return', options.fetch ? this.subscribingPromise : undefined);

              case 4:
                this.subscribing = true;

                if (!(this.subscribed !== 1)) {
                  _context2.next = 7;
                  break;
                }

                return _context2.abrupt('return');

              case 7:

                (0, _get3.default)((0, _getPrototypeOf2.default)(RemoteQuery.prototype), 'subscribe', this).call(this);
                this.lastServerData = this.data;

                op = {
                  type: 'qsub',
                  collectionName: this.collectionName,
                  expression: this.expression
                };


                if (this.isDocs) op.docIds = this.data;

                this.subscribingPromise = this.model.sendOp(op);
                return _context2.abrupt('return', options.fetch ? this.subscribingPromise : undefined);

              case 13:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function subscribe(_x) {
        return ref.apply(this, arguments);
      }

      return subscribe;
    }()
  }, {
    key: 'unsubscribe',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                this.subscribed--;

                if (!(this.subscribed !== 0)) {
                  _context3.next = 3;
                  break;
                }

                return _context3.abrupt('return');

              case 3:

                (0, _get3.default)((0, _getPrototypeOf2.default)(RemoteQuery.prototype), 'unsubscribe', this).call(this);

                return _context3.abrupt('return', this.model.sendOp({
                  type: 'qunsub',
                  collectionName: this.collectionName,
                  expression: this.expression
                }));

              case 5:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function unsubscribe() {
        return ref.apply(this, arguments);
      }

      return unsubscribe;
    }()
  }, {
    key: 'onSnapshotNotDocs',
    value: function onSnapshotNotDocs(data) {
      this.refreshDataFromServer(data);
    }
  }, {
    key: 'onDiff',
    value: function onDiff(diffs, docOps) {
      this.attachDocsToCollection(docOps);

      var docIds = this.applyDiffs(diffs);

      this.refreshDataFromServer(docIds);
    }
  }, {
    key: 'applyDiffs',
    value: function applyDiffs(diffs) {
      var docIds = this.lastServerData || this.data;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(diffs), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var diff = _step.value;

          switch (diff.type) {
            case 'insert':
              var before = docIds.slice(0, diff.index);
              var after = docIds.slice(diff.index);
              docIds = before.concat(diff.values, after);
              break;

            case 'move':
              var move = docIds.splice(diff.from, diff.howMany);
              docIds.splice.apply(docIds, [diff.to, 0].concat(move));
              break;

            case 'remove':
              docIds.splice(diff.index, diff.howMany);
              break;
          }
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

      return docIds;
    }
  }, {
    key: 'refreshDataFromServer',
    value: function refreshDataFromServer(data) {
      this.lastServerData = data;
      this.data = data;

      this.subscribing = false;
      this.emit('change');
    }
  }, {
    key: 'getSyncData',
    value: function getSyncData() {
      var data = {
        collectionName: this.collectionName,
        expression: this.expression
      };

      if (this.isDocs) data.docIds = this.data;
      this.lastServerData = this.data;

      return data;
    }
  }]);
  return RemoteQuery;
}(_ClientQuery3.default);

exports.default = RemoteQuery;
module.exports = exports['default'];