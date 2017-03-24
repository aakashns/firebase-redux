import { createStore } from "redux";
import rootReducer from "./reducers";
import firebaseConfig from "./firebase-config";
import * as firebase from "firebase";

const store = createStore(rootReducer);

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

test("initial state is correct", () => {
  const expectedState = { dummy: "DUNNO", profile: {} };
  expect(store.getState()).toEqual(expectedState);
});

test("firebase database returns some data", done => {
  db.ref("/").once("value", snap => {
    done();
    console.log("Data fetched");
    if (snap.val()) {
      expect(snap.val().ping).toEqual("OKS");
      done();
    }
  });
});
