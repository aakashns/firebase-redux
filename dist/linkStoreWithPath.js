"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _linkStoreWithDb = require("./linkStoreWithDb");

var _linkStoreWithDb2 = _interopRequireDefault(_linkStoreWithDb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var linkStoreWithPath = function linkStoreWithPath(path, actionCreator, selector) {
  return function (db, store) {
    var previous = selector && selector(store.getState());
    var mustWrite = true;

    var fromDb = actionCreator && function (db, dispatch) {
      var listener = db.ref(path).on("value", function (snap) {
        if (snap.val()) {
          mustWrite = false;
          dispatch(actionCreator(snap.val()));
          mustWrite = true;
        }
      });
      return function () {
        return db.ref(path).off("value", listener);
      };
    };

    var fromStore = selector && function (state, db) {
      var portion = selector(state);
      if (mustWrite && portion !== previous) {
        console.log("Writing to path", path);
        db.ref(path).set(portion);
      }
      previous = portion;
    };

    return (0, _linkStoreWithDb2.default)(fromDb, fromStore)(db, store);
  };
};

exports.default = linkStoreWithPath;