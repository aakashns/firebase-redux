import linkStoreWithDb from "./linkStoreWithDb";

const linkStoreWithChildren = (getRef, setActionCreator, removeActionCreator) =>
  (db, store) => {
    const dbRef = getRef(db);
    const fromDb = (db, dispatch) => {
      const handleResult = snap => {
        const child = snap.val();
        if (child) {
          dispatch(setActionCreator(child, snap.key));
        }
      };

      const addedListener = setActionCreator &&
        dbRef.on("child_added", handleResult);
      const changedListener = setActionCreator &&
        dbRef.on("child_changed", handleResult);
      const removedListener = removeActionCreator &&
        dbRef.on("child_removed", snap => {
          dispatch(removeActionCreator(snap.key));
        });

      return () => {
        dbRef.off("child_added", addedListener);
        dbRef.off("child_changed", changedListener);
        dbRef.off("child_removed", removedListener);
      };
    };

    return linkStoreWithDb(fromDb)(db, store);
  };

export default linkStoreWithChildren;
