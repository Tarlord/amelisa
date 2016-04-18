'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _eventToPromise = require('event-to-promise');

var _eventToPromise2 = _interopRequireDefault(_eventToPromise);

var _ProjectedDoc = require('./ProjectedDoc');

var _ProjectedDoc2 = _interopRequireDefault(_ProjectedDoc);

var _ServerDoc = require('./ServerDoc');

var _ServerDoc2 = _interopRequireDefault(_ServerDoc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ServerDocSet = function () {
  function ServerDocSet(store) {
    (0, _classCallCheck3.default)(this, ServerDocSet);

    this.store = store;
    this.data = {};
  }

  (0, _createClass3.default)(ServerDocSet, [{
    key: 'getOrCreateDoc',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(collectionName, docId) {
        var hash, doc, projection;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                hash = this.getDocHash(collectionName, docId);
                doc = this.data[hash];


                if (!doc) {
                  projection = this.store.projections[collectionName];

                  if (projection) {
                    doc = new _ProjectedDoc2.default(collectionName, projection, docId, [], this.store, this);
                  } else {
                    doc = new _ServerDoc2.default(collectionName, docId, [], this.store, this);
                  }
                  this.data[hash] = doc;
                }

                if (!doc.loaded) {
                  _context.next = 5;
                  break;
                }

                return _context.abrupt('return', doc);

              case 5:
                _context.next = 7;
                return (0, _eventToPromise2.default)(doc, 'loaded');

              case 7:
                return _context.abrupt('return', doc);

              case 8:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getOrCreateDoc(_x, _x2) {
        return ref.apply(this, arguments);
      }

      return getOrCreateDoc;
    }()
  }, {
    key: 'unattach',
    value: function unattach(collectionName, docId) {
      var hash = this.getDocHash(collectionName, docId);
      delete this.data[hash];
    }
  }, {
    key: 'channelClose',
    value: function channelClose(channel) {
      for (var hash in this.data) {
        var doc = this.data[hash];

        doc.unsubscribe(channel);
      }
    }
  }, {
    key: 'onOp',
    value: function onOp(op) {
      var collectionName = op.collectionName;
      var docId = op.docId;


      var dbCollectionName = void 0;
      var collectionNames = [];

      var projection = this.store.projections[collectionName];
      if (projection) {
        dbCollectionName = projection.dbCollectionName;
      }

      for (var projectionCollectionName in this.store.projections) {
        var _projection = this.store.projections[projectionCollectionName];
        // op is on db collection
        if (!dbCollectionName && _projection.dbCollectionName === collectionName) {
          collectionNames.push(projectionCollectionName);
        }
        // op is on projected collection
        if (dbCollectionName && _projection.dbCollectionName === dbCollectionName) {
          if (projectionCollectionName === collectionName) continue;
          collectionNames.push(projectionCollectionName);
        }
      }

      this.receiveOpToCollectionNames(op, collectionNames, docId);
    }
  }, {
    key: 'onPubsubOp',
    value: function onPubsubOp(op) {
      var collectionName = op.collectionName;
      var docId = op.docId;


      var dbCollectionName = void 0;
      var collectionNames = [];

      var projection = this.store.projections[collectionName];
      if (projection) {
        dbCollectionName = projection.dbCollectionName;
      }

      for (var projectionCollectionName in this.store.projections) {
        var _projection2 = this.store.projections[projectionCollectionName];
        // op is on db collection
        if (!dbCollectionName && _projection2.dbCollectionName === collectionName) {
          collectionNames.push(projectionCollectionName);
        }
        // op is on projected collection
        if (dbCollectionName && _projection2.dbCollectionName === dbCollectionName) {
          collectionNames.push(projectionCollectionName);
        }
      }

      if (collectionNames.indexOf(collectionName) === -1) collectionNames.push(collectionName);

      this.receiveOpToCollectionNames(op, collectionNames, docId);
    }
  }, {
    key: 'receiveOpToCollectionNames',
    value: function receiveOpToCollectionNames(op, collectionNames, docId) {
      var _this = this;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var collectionName = _step.value;

          var hash = _this.getDocHash(collectionName, docId);
          var doc = _this.data[hash];
          if (!doc) return 'continue';

          // if (doc.ops.find((docOp) => docOp._id === op.id)) continue

          if (doc.loading) {
            doc.once('loaded', function () {
              doc.receiveOp(op);
            });
          } else {
            doc.receiveOp(op);
          }
        };

        for (var _iterator = (0, _getIterator3.default)(collectionNames), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _ret = _loop();

          if (_ret === 'continue') continue;
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
    }
  }, {
    key: 'getDocHash',
    value: function getDocHash(collectionName, docId) {
      return collectionName + '_' + docId;
    }
  }]);
  return ServerDocSet;
}();

exports.default = ServerDocSet;
module.exports = exports['default'];