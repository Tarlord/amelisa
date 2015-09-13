import assert from 'assert';
import MongoStorage from '../lib/MongoStorage';

let mongoUrl = 'mongodb://localhost:27017/test';
let storage = new MongoStorage(mongoUrl);

before(() => {
  return storage.init();
});

beforeEach(() => {
  return storage.clear();
});

describe('MongoStorage', () => {
  it('should save and get doc', (done) => {
    let collectionName = 'users';
    let docId = '1';
    let prevVersion = null;
    let version = '2';
    let state = {
      name: 'name'
    };
    let ops = [];
    storage
      .saveDoc(collectionName, docId, prevVersion, version, state, ops)
      .then(() => {
        storage
          .getDocById(collectionName, docId)
          .then((doc) => {
            assert(doc);
            assert.equal(doc._id, docId);
            assert.equal(doc._v, version);
            assert.equal(doc.name, 'name');
            done();
          });
      });
  });

  it('should save and get docs', (done) => {
    let collectionName = 'users';
    let docId = '1';
    let prevVersion = null;
    let version = '2';
    let state = {
      name: 'name'
    };
    let ops = [];
    storage
      .saveDoc(collectionName, docId, prevVersion, version, state, ops)
      .then(() => {
        storage
          .getDocsByQuery(collectionName, {name: 'name'})
          .then((docs) => {
            assert(docs);
            assert.equal(docs.length, 1);
            assert.equal(docs[0]._id, docId);
            assert.equal(docs[0]._v, version);
            assert.equal(docs[0].name, 'name');
            done();
          });
      });
  });
});