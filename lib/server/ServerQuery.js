'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

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

var _arraydiff = require('arraydiff');

var _arraydiff2 = _interopRequireDefault(_arraydiff);

var _Query2 = require('../client/Query');

var _Query3 = _interopRequireDefault(_Query2);

var _util = require('../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ServerQuery = function (_Query) {
  (0, _inherits3.default)(ServerQuery, _Query);

  function ServerQuery(collectionName, expression, store, querySet) {
    (0, _classCallCheck3.default)(this, ServerQuery);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ServerQuery).call(this, collectionName, expression));

    if (!expression) expression = _this.store.dbQueries.getAllSelector();
    _this.expression = expression;
    _this.originalExpression = (0, _util.deepClone)(expression);
    _this.store = store;
    _this.querySet = querySet;
    _this.loaded = false;
    _this.loading = false;
    _this.channels = [];
    _this.isDocs = _this.store.dbQueries.isDocsQuery(expression);

    _this.load();
    _this.on('loaded', function () {
      _this.broadcast();
    });

    // Set max listeners to unlimited
    _this.setMaxListeners(0);
    return _this;
  }

  (0, _createClass3.default)(ServerQuery, [{
    key: 'load',
    value: function load() {
      var _this2 = this;

      // TODO: can be race condition. should load one more time
      if (this.loading) return;
      this.loading = true;

      this.store.storage.getDocsByQuery(this.collectionName, this.expression).then(function (docs) {
        _this2.prev = _this2.data;
        _this2.data = docs;
        _this2.loading = false;
        _this2.loaded = true;
        _this2.emit('loaded');
      }).catch(function (err) {
        console.error('ServerQuery.load', err, err.stack);
      });
    }
  }, {
    key: 'broadcast',
    value: function broadcast() {
      if (!this.isDocs) {
        if ((0, _util.fastEqual)(this.prev, this.data)) return;

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _getIterator3.default)(this.channels), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var channel = _step.value;

            this.sendNotDocsQuerySnapshotToChannel(channel);
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

        return;
      }

      var diffs = this.getDiffs(this.prev, this.data);

      if (!diffs.length) return;

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator3.default)(this.channels), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _channel = _step2.value;

          this.sendDiffQueryToChannel(_channel, diffs);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: 'sendNotDocsQuerySnapshotToChannel',
    value: function sendNotDocsQuerySnapshotToChannel(channel, ackId) {
      var op = {
        type: 'q',
        collectionName: this.collectionName,
        expression: this.originalExpression,
        value: this.data,
        ackId: ackId
      };

      this.sendOp(op, channel);
    }
  }, {
    key: 'getDocsData',
    value: function getDocsData() {
      var docIds = [];
      var docOps = {};
      var docVersions = {};

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = (0, _getIterator3.default)(this.data), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var doc = _step3.value;

          var docId = doc._id;
          docIds.push(docId);
          docOps[docId] = doc._ops;
          docVersions[docId] = doc._v;
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return {
        docIds: docIds,
        docOps: docOps,
        docVersions: docVersions
      };
    }
  }, {
    key: 'sendDiffQueryToChannel',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(channel, diffs, ackId) {
        var docMap, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, doc, docOps, docVersions, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, diff, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, docId, op;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                docMap = {};
                _iteratorNormalCompletion4 = true;
                _didIteratorError4 = false;
                _iteratorError4 = undefined;
                _context.prev = 4;

                for (_iterator4 = (0, _getIterator3.default)(this.data); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                  doc = _step4.value;

                  docMap[doc._id] = doc;
                }

                _context.next = 12;
                break;

              case 8:
                _context.prev = 8;
                _context.t0 = _context['catch'](4);
                _didIteratorError4 = true;
                _iteratorError4 = _context.t0;

              case 12:
                _context.prev = 12;
                _context.prev = 13;

                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                  _iterator4.return();
                }

              case 15:
                _context.prev = 15;

                if (!_didIteratorError4) {
                  _context.next = 18;
                  break;
                }

                throw _iteratorError4;

              case 18:
                return _context.finish(15);

              case 19:
                return _context.finish(12);

              case 20:
                docOps = {};
                docVersions = {};
                _iteratorNormalCompletion5 = true;
                _didIteratorError5 = false;
                _iteratorError5 = undefined;
                _context.prev = 25;
                _iterator5 = (0, _getIterator3.default)(diffs);

              case 27:
                if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
                  _context.next = 52;
                  break;
                }

                diff = _step5.value;

                if (!(diff.type === 'insert')) {
                  _context.next = 49;
                  break;
                }

                _iteratorNormalCompletion6 = true;
                _didIteratorError6 = false;
                _iteratorError6 = undefined;
                _context.prev = 33;

                for (_iterator6 = (0, _getIterator3.default)(diff.values); !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                  docId = _step6.value;

                  docOps[docId] = docMap[docId]._ops;
                  docVersions[docId] = docMap[docId]._v;
                }
                _context.next = 41;
                break;

              case 37:
                _context.prev = 37;
                _context.t1 = _context['catch'](33);
                _didIteratorError6 = true;
                _iteratorError6 = _context.t1;

              case 41:
                _context.prev = 41;
                _context.prev = 42;

                if (!_iteratorNormalCompletion6 && _iterator6.return) {
                  _iterator6.return();
                }

              case 44:
                _context.prev = 44;

                if (!_didIteratorError6) {
                  _context.next = 47;
                  break;
                }

                throw _iteratorError6;

              case 47:
                return _context.finish(44);

              case 48:
                return _context.finish(41);

              case 49:
                _iteratorNormalCompletion5 = true;
                _context.next = 27;
                break;

              case 52:
                _context.next = 58;
                break;

              case 54:
                _context.prev = 54;
                _context.t2 = _context['catch'](25);
                _didIteratorError5 = true;
                _iteratorError5 = _context.t2;

              case 58:
                _context.prev = 58;
                _context.prev = 59;

                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                  _iterator5.return();
                }

              case 61:
                _context.prev = 61;

                if (!_didIteratorError5) {
                  _context.next = 64;
                  break;
                }

                throw _iteratorError5;

              case 64:
                return _context.finish(61);

              case 65:
                return _context.finish(58);

              case 66:
                op = {
                  type: 'qdiff',
                  collectionName: this.collectionName,
                  expression: this.originalExpression,
                  diffs: diffs,
                  docOps: docOps,
                  ackId: ackId
                };
                _context.next = 69;
                return this.subscribeDocs(docVersions, channel);

              case 69:

                this.sendOp(op, channel);

              case 70:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[4, 8, 12, 20], [13,, 15, 19], [25, 54, 58, 66], [33, 37, 41, 49], [42,, 44, 48], [59,, 61, 65]]);
      }));

      function sendDiffQueryToChannel(_x, _x2, _x3) {
        return ref.apply(this, arguments);
      }

      return sendDiffQueryToChannel;
    }()
  }, {
    key: 'getDiffs',
    value: function getDiffs() {
      var prev = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
      var data = arguments[1];

      var prevIds = prev.map(function (doc) {
        return doc._id;
      });
      var docIds = data.map(function (doc) {
        return doc._id;
      });

      return (0, _arraydiff2.default)(prevIds, docIds);
    }
  }, {
    key: 'subscribeDocs',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(docVersions, channel) {
        var _this3 = this;

        var docPromises;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                docPromises = (0, _keys2.default)(docVersions).map(function (docId) {
                  var version = docVersions[docId];
                  return _this3.store.docSet.getOrCreateDoc(_this3.collectionName, docId).then(function (doc) {
                    doc.subscribe(channel, version);
                  });
                });
                return _context2.abrupt('return', _promise2.default.all(docPromises));

              case 2:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function subscribeDocs(_x5, _x6) {
        return ref.apply(this, arguments);
      }

      return subscribeDocs;
    }()
  }, {
    key: 'fetch',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(channel, docIds, ackId) {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.sendQuery(channel, docIds, ackId);

              case 2:

                this.maybeUnattach();

              case 3:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function fetch(_x7, _x8, _x9) {
        return ref.apply(this, arguments);
      }

      return fetch;
    }()
  }, {
    key: 'subscribe',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(channel, docIds, ackId) {
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                this.channels.push(channel);

                _context4.next = 3;
                return this.sendQuery(channel, docIds, ackId);

              case 3:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function subscribe(_x10, _x11, _x12) {
        return ref.apply(this, arguments);
      }

      return subscribe;
    }()
  }, {
    key: 'sendQuery',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(channel, docIds, ackId) {
        var diffs;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!this.isDocs) {
                  _context5.next = 6;
                  break;
                }

                diffs = this.getDiffs(docIds, this.data);
                _context5.next = 4;
                return this.sendDiffQueryToChannel(channel, diffs, ackId);

              case 4:
                _context5.next = 8;
                break;

              case 6:
                _context5.next = 8;
                return this.sendNotDocsQuerySnapshotToChannel(channel, ackId);

              case 8:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function sendQuery(_x13, _x14, _x15) {
        return ref.apply(this, arguments);
      }

      return sendQuery;
    }()
  }, {
    key: 'unsubscribe',
    value: function unsubscribe(channel) {
      (0, _util.arrayRemove)(this.channels, channel);

      this.maybeUnattach();
    }
  }, {
    key: 'maybeUnattach',
    value: function maybeUnattach() {
      var _this4 = this;

      setTimeout(function () {
        if (_this4.channels.length === 0) {
          _this4.destroy();
        }
      }, this.store.options.unattachTimeout);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.querySet.unattach(this.collectionName, this.expression);
    }
  }, {
    key: 'sendOp',
    value: function sendOp(op, channel) {
      this.store.sendOp(op, channel);
    }
  }]);
  return ServerQuery;
}(_Query3.default);

exports.default = ServerQuery;
module.exports = exports['default'];