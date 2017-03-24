const linkStoreWithDb = (fromDb, fromStore) =>
  (db, store) => {
    const unlinkFromDb = fromDb && fromDb(db, store.dispatch);
    const unlinkFromStore = fromStore &&
      store.subscribe(() => fromStore(store.getState(), db));

    return () => {
      unlinkFromDb && unlinkFromDb();
      unlinkFromStore && unlinkFromStore();
    };
  };

export default linkStoreWithDb;
