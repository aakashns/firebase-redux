"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var linkStoreWithDb = function linkStoreWithDb(fromDb, fromStore) {
  return function (db, store) {
    var unlinkFromDb = fromDb && fromDb(db, store.dispatch);
    var unlinkFromStore = fromStore && store.subscribe(function () {
      return fromStore(store.getState(), db);
    });

    return function () {
      unlinkFromDb && unlinkFromDb();
      unlinkFromStore && unlinkFromStore();
    };
  };
};

exports.default = linkStoreWithDb;