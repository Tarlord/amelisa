// let debug = require('debug')('RemoteCollection');
import Collection from './Collection';
import RemoteDoc from './RemoteDoc';

class RemoteCollection extends Collection {
  constructor(name, data, model, storage) {
    super(name, data, model);
    this.storage = storage;
  }

  add(docId, docData) {
    let doc = super.add(docId, docData);
    doc.save();
    let op = doc.ops[doc.ops.length - 1];
    return this.model.send(op);
  }

  attach(docId, ops, serverVersion) {
    let doc = new RemoteDoc(docId, ops, this, this.model, this.storage, serverVersion);

    this.data[docId] = doc;
    return doc;
  }

  fillFromClientStorage() {
    return new Promise((resolve, reject) => {
      this.storage
        .getAllDocs(this.name)
        .then((docs) => {
          for (let doc of docs) {
            this.attach(doc._id, doc._ops, doc._sv);
          }
          resolve();
        })
        .catch((err) => {
          console.error('RemoteCollection.fillFromClientStorage', err);

          // Resolve anyway
          resolve();
        });
    });
  }

  sync() {
    for (let docId in this.data) {
      let doc = this.data[docId];
      doc.sync();
    }
  }
}

export default RemoteCollection;