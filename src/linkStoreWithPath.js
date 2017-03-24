import linkStoreWithDb from "./linkStoreWithDb";

const linkStoreWithPath = (path, actionCreator, selector) =>
  (db, store) => {
    let previous = selector && selector(store.getState());
    let mustWrite = true;

    const fromDb = actionCreator &&
      ((db, dispatch) => {
        const listener = db.ref(path).on("value", snap => {
          if (snap.val()) {
            mustWrite = false;
            dispatch(actionCreator(snap.val()));
            mustWrite = true;
          }
        });
        return () => db.ref(path).off("value", listener);
      });

    const fromStore = selector &&
      ((state, db) => {
        const portion = selector(state);
        if (mustWrite && portion !== previous) {
          console.log("Writing to path", path);
          db.ref(path).set(portion);
        }
        previous = portion;
      });

    return linkStoreWithDb(fromDb, fromStore)(db, store);
  };

export default linkStoreWithPath;
