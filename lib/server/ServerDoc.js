'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

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

var _Doc2 = require('../client/Doc');

var _Doc3 = _interopRequireDefault(_Doc2);

var _Model = require('../client/Model');

var _Model2 = _interopRequireDefault(_Model);

var _types = require('../types');

var _util = require('../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ServerDoc = function (_Doc) {
  (0, _inherits3.default)(ServerDoc, _Doc);

  function ServerDoc(collectionName, docId, ops, store, docSet) {
    (0, _classCallCheck3.default)(this, ServerDoc);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ServerDoc).call(this, docId, ops));

    _this.collectionName = collectionName;
    _this.store = store;
    _this.docSet = docSet;
    _this.prevVersion = null;
    _this.loaded = false;
    _this.loading = false;
    _this.saving = false;
    _this.channels = [];

    _this.load();

    _this.on('loaded', function () {
      _this.broadcast();
    });

    // Set max listeners to unlimited
    _this.setMaxListeners(0);
    return _this;
  }

  (0, _createClass3.default)(ServerDoc, [{
    key: 'load',
    value: function load() {
      var _this2 = this;

      if (this.loading) return;
      this.loading = true;

      this.store.storage.getDocById(this.collectionName, this.docId).then(function (doc) {
        if (doc) {
          _this2.applyOps(doc._ops);
          _this2.prevVersion = doc._v;
        }

        _this2.loading = false;
        _this2.loaded = true;
        _this2.emit('loaded');
      }).catch(function (err) {
        console.error('ServerDoc.load', err);
      });
    }
  }, {
    key: 'onOpsOp',
    value: function onOpsOp(op, channel) {
      if (channel) channel._session.updateDocVersion(this.collectionName, this.docId, op.source, op.date);

      this.saveOp(op);
      this.applyOp(op);
    }
  }, {
    key: 'onOp',
    value: function onOp(op, channel) {
      if (channel) channel._session.updateDocVersion(this.collectionName, this.docId, op.source, op.date);

      this.saveOp(op);
      this.applyOp(op);
      this.broadcastOp(op, channel);
      this.save();
    }
  }, {
    key: 'receiveOp',
    value: function receiveOp(op) {
      this.applyOp(op);
      this.broadcastOp(op);
    }
  }, {
    key: 'save',
    value: function save() {
      var _this3 = this;

      if (!this.loaded) return;
      if (this.ops.length === 0) return;
      if (this.saving) {
        this.changed = true;
        return;
      }
      this.saving = true;
      setTimeout(function () {
        return _this3.saveToStorage();
      }, this.store.options.saveDebounceTimeout);
    }
  }, {
    key: 'saveToStorage',
    value: function saveToStorage() {
      var _this4 = this;

      var version = this.version();

      if (this.ops.length > this.store.options.cuttingOpsCount) {
        (function () {
          var date = Date.now() - _this4.store.options.cuttingTimeout;
          var allOps = _this4.ops;
          _this4.ops = allOps.filter(function (op) {
            return op.date < date;
          });
          _this4.refreshState();
          var cutOps = _this4.getCutOps(null, _this4.state);
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = (0, _getIterator3.default)(cutOps), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var cutOp = _step.value;

              allOps.push(cutOp);
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

          _this4.ops = allOps;
          _this4.distillOps();
        })();
      }

      this.store.storage.saveDoc(this.collectionName, this.docId, this.getForSave(), this.prevVersion, version, this.ops).then(function () {
        _this4.saving = false;
        _this4.prevVersion = version;
        _this4.emit('saved');
        if (_this4.changed) {
          _this4.changed = false;
          _this4.save();
        }
      }).catch(function (err) {
        if (err.message === 'stale data') {
          _this4.once('loaded', _this4.save.bind(_this4));
          return _this4.load();
        } else {
          console.trace('ServerDoc.saveToStorage', err);
        }
      });
    }
  }, {
    key: 'saveOp',
    value: function saveOp(op) {
      if (!this.store.options.saveOps) return;
      if (!this.store.opsStorage.saveOp) return;

      this.store.opsStorage.saveOp(op).catch(function (err) {
        console.trace('ServerDoc.saveOp', err);
      });
    }
  }, {
    key: 'getCutOps',
    value: function getCutOps(field, value) {
      var ops = [];

      // TODO: use arraySet for array
      if (value instanceof _types.ArrayType || value instanceof _types.BooleanType || value instanceof _types.NumberType) {
        var op = {
          id: _Model2.default.prototype.id(),
          source: this.store.options.source,
          date: Date.now(),
          type: 'set',
          collectionName: this.collectionName,
          docId: this.docId,
          value: this.get(field)
        };
        if (field) op.field = field;
        ops.push(op);
      } else if (value instanceof _types.StringType) {
        var _op = {
          id: _Model2.default.prototype.id(),
          source: this.store.options.source,
          date: Date.now(),
          type: 'stringSet',
          collectionName: this.collectionName,
          docId: this.docId,
          value: value.getStringSetValue()
        };
        if (field) _op.field = field;
        ops.push(_op);
      }

      if (value && (typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) === 'object') {
        for (var key in value) {
          var subField = field ? field + '.' + key : key;
          ops = ops.concat(this.getCutOps(subField, value[key]));
        }
      }
      return ops;
    }
  }, {
    key: 'broadcast',
    value: function broadcast() {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator3.default)(this.channels), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var channel = _step2.value;

          this.sendOpsToChannel(channel);
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
    key: 'broadcastOp',
    value: function broadcastOp(op, fromChannel) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = (0, _getIterator3.default)(this.channels), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var channel = _step3.value;

          channel._session.updateDocVersion(this.collectionName, this.docId, op.source, op.date);
          if (fromChannel && channel === fromChannel) continue;
          this.sendOp(op, channel);
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
    key: 'sendOpsToChannel',
    value: function sendOpsToChannel(channel, version) {
      if (!version) version = channel._session.getDocVersion(this.collectionName, this.docId);
      var opsToSend = this.getOpsToSend(version);

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = (0, _getIterator3.default)(opsToSend), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var op = _step4.value;

          this.sendOp(op, channel);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }
  }, {
    key: 'fetch',
    value: function fetch(channel, version, ackId) {
      var op = {
        type: 'fetch',
        collectionName: this.collectionName,
        docId: this.docId,
        version: this.version(),
        ops: this.getOpsToSend(version),
        ackId: ackId
      };
      this.sendOp(op, channel);

      this.maybeUnattach();
    }
  }, {
    key: 'subscribeWithoutSending',
    value: function subscribeWithoutSending(channel, version) {
      channel._session.saveDocVersion(this.collectionName, this.docId, version);
      this.addChannel(channel);
    }
  }, {
    key: 'subscribe',
    value: function subscribe(channel, version, ackId) {
      channel._session.saveDocVersion(this.collectionName, this.docId, version);
      this.addChannel(channel);

      var op = {
        type: 'sub',
        collectionName: this.collectionName,
        docId: this.docId,
        version: this.version(),
        ops: this.getOpsToSend(version),
        ackId: ackId
      };

      this.sendOp(op, channel);
    }
  }, {
    key: 'unsubscribe',
    value: function unsubscribe(channel) {
      (0, _util.arrayRemove)(this.channels, channel);

      this.maybeUnattach();
    }
  }, {
    key: 'maybeUnattach',
    value: function maybeUnattach() {
      var _this5 = this;

      setTimeout(function () {
        if (_this5.channels.length === 0) {
          _this5.destroy();
        }
      }, this.store.options.unattachTimeout);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.docSet.unattach(this.collectionName, this.docId);
    }
  }, {
    key: 'sync',
    value: function sync(channel, version, resubscribe) {
      if (resubscribe) {
        channel._session.saveDocVersion(this.collectionName, this.docId, version);
        this.addChannel(channel);
      }
      this.sendOpsToChannel(channel);

      var op = {
        type: 'sync',
        collectionName: this.collectionName,
        docId: this.docId,
        version: this.version()
      };
      this.sendOp(op, channel);
    }
  }, {
    key: 'addChannel',
    value: function addChannel(channel) {
      if (this.channels.indexOf(channel) === -1) this.channels.push(channel);
    }
  }, {
    key: 'sendOp',
    value: function sendOp(op, channel) {
      this.store.sendOp(op, channel);
    }
  }]);
  return ServerDoc;
}(_Doc3.default);

exports.default = ServerDoc;
module.exports = exports['default'];