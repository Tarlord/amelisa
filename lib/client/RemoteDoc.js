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

var _MutableDoc2 = require('./MutableDoc');

var _MutableDoc3 = _interopRequireDefault(_MutableDoc2);

var _util = require('../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultSubscribeOptions = {
  fetch: true
};

var RemoteDoc = function (_MutableDoc) {
  (0, _inherits3.default)(RemoteDoc, _MutableDoc);

  function RemoteDoc(docId, ops, collection, model, serverVersion) {
    (0, _classCallCheck3.default)(this, RemoteDoc);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(RemoteDoc).call(this, docId, ops, collection, model));

    _this.serverVersion = serverVersion;
    _this.subscribed = 0;
    return _this;
  }

  (0, _createClass3.default)(RemoteDoc, [{
    key: 'refresh',
    value: function refresh() {
      this.refreshState();
      this.emit('change');
    }
  }, {
    key: 'fetch',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
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

                this.subscribingPromise = this.model.sendOp({
                  type: 'fetch',
                  collectionName: this.collection.name,
                  docId: this.docId
                });
                return _context.abrupt('return', this.subscribingPromise);

              case 5:
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
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                options = (0, _assign2.default)({}, defaultSubscribeOptions, options);
                this.subscribed++;

                if (!(this.subscribed !== 1)) {
                  _context2.next = 4;
                  break;
                }

                return _context2.abrupt('return', options.fetch ? this.subscribingPromise : undefined);

              case 4:
                this.subscribing = true;

                this.subscribingPromise = this.sendSubscribeOp();
                return _context2.abrupt('return', options.fetch ? this.subscribingPromise : undefined);

              case 7:
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
    key: 'sendSubscribeOp',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt('return', this.model.sendOp({
                  type: 'sub',
                  collectionName: this.collection.name,
                  docId: this.docId,
                  version: this.version()
                }));

              case 1:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function sendSubscribeOp() {
        return ref.apply(this, arguments);
      }

      return sendSubscribeOp;
    }()
  }, {
    key: 'unsubscribe',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                this.subscribed--;

                if (!(this.subscribed !== 0)) {
                  _context4.next = 3;
                  break;
                }

                return _context4.abrupt('return');

              case 3:
                return _context4.abrupt('return', this.model.sendOp({
                  type: 'unsub',
                  collectionName: this.collection.name,
                  docId: this.docId
                }));

              case 4:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function unsubscribe() {
        return ref.apply(this, arguments);
      }

      return unsubscribe;
    }()
  }, {
    key: 'onDataFromServer',
    value: function onDataFromServer(serverVersion, ops) {
      this.serverVersion = serverVersion;
      this.applyOps(ops);
      this.subscribing = false;
      this.emit('change');
      this.save();

      var opsToSend = this.getOpsToSend(serverVersion);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(opsToSend), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var op = _step.value;

          this.model.send(op);
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
    key: 'onOp',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(op) {
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                (0, _get3.default)((0, _getPrototypeOf2.default)(RemoteDoc.prototype), 'onOp', this).call(this, op);
                _context5.next = 3;
                return this.model.send(op);

              case 3:
                if (this.model.online) {
                  _context5.next = 5;
                  break;
                }

                return _context5.abrupt('return');

              case 5:
                this.serverVersion = this.addOpToVersion(this.serverVersion, op);

              case 6:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function onOp(_x2) {
        return ref.apply(this, arguments);
      }

      return onOp;
    }()
  }, {
    key: 'receiveOp',
    value: function receiveOp(newOp) {
      var existingOp = this.ops.find(function (op) {
        return op.id === newOp.id;
      });
      // TODO: debug repeating ops
      if (existingOp) return;

      var type = newOp.type;
      var field = newOp.field;
      var positionId = newOp.positionId;


      var index = void 0;
      if (type === 'stringInsert' || type === 'stringRemove') {
        var string = this.getInternalAsStringType(field);
        index = string.getIndexByPositionId(positionId);
      }

      this.applyOp(newOp);
      this.serverVersion = this.addOpToVersion(this.serverVersion, newOp);

      if (type === 'stringInsert' || type === 'stringRemove') {
        if (index > -1) this.emit(type, field, index, 1);
      }

      this.emit('change');
      this.collection.emit('change', newOp);
      this.save();
    }
  }, {
    key: 'receiveOps',
    value: function receiveOps(ops, opsType, field, index, howMany) {
      if (!ops.length) return;

      this.applyOps(ops, opsType);
      this.serverVersion = this.addOpsToVersion(this.serverVersion, ops);

      if (opsType === 'stringInsert' || opsType === 'stringRemove') {
        this.emit(opsType, field, index, howMany);
      }

      this.emit('change');
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator3.default)(ops), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var op = _step2.value;

          this.collection.emit('change', op);
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

      this.save();
    }
  }, {
    key: 'rejectOp',
    value: function rejectOp(opId) {
      var op = this.ops.find(function (op) {
        return op.id === opId;
      });
      if (op) {
        (0, _util.arrayRemove)(this.ops, op);
        this.refreshState();
        this.emit('change');
        this.collection.emit('change', op);
        this.save();
      }
    }
  }, {
    key: 'sendAllOps',
    value: function sendAllOps() {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = (0, _getIterator3.default)(this.ops), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var op = _step3.value;

          this.model.send(op);
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
    }
  }, {
    key: 'getSyncData',
    value: function getSyncData() {
      var data = {
        ops: this.getOpsToSend(this.serverVersion),
        version: this.version()
      };

      return data;
    }
  }]);
  return RemoteDoc;
}(_MutableDoc3.default);

exports.default = RemoteDoc;
module.exports = exports['default'];