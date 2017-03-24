"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _linkStoreWithDb = require("./linkStoreWithDb");

var _linkStoreWithDb2 = _interopRequireDefault(_linkStoreWithDb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var linkStoreWithChildren = function linkStoreWithChildren(getRef, setActionCreator, removeActionCreator) {
  return function (db, store) {
    var dbRef = getRef(db);
    var fromDb = function fromDb(db, dispatch) {
      var handleResult = function handleResult(snap) {
        var child = snap.val();
        if (child) {
          dispatch(setActionCreator(child, snap.key));
        }
      };

      var addedListener = setActionCreator && dbRef.on("child_added", handleResult);
      var changedListener = setActionCreator && dbRef.on("child_changed", handleResult);
      var removedListener = removeActionCreator && dbRef.on("child_removed", function (snap) {
        dispatch(removeActionCreator(snap.key));
      });

      return function () {
        dbRef.off("child_added", addedListener);
        dbRef.off("child_changed", changedListener);
        dbRef.off("child_removed", removedListener);
      };
    };

    return (0, _linkStoreWithDb2.default)(fromDb)(db, store);
  };
};

exports.default = linkStoreWithChildren;