# firebase-redux
Utility functions to connect your Firebase realtime database with a Redux store. This library was written to accompany the Medium article: https://medium.com/@aakashns/575f8294332d

It provides utility functions `linkStoreWithPath`, `linkStoreWithChildren` and `linkStoreWithDb` to set up two-way bindings between portions of the Firebase realtime database and a Redux store.

## Installation
Install using `npm` or `yarn`:
```bash
npm install firebase-redux --save
```
or 
```bash
yarn add firebase-redux
```

## Usage

### `linkStoreWithPath(path, actionCreator, selector)`

Set up a two way binding between the realtime database and the Redux store. `path` specifies the location in the database that is bound, and `actionCreator` and `selector` specify how the Redux store should be written to and read from.

### Example
```javascript

import { linkStoreWithPath } from 'firebase-redux';

// The database path you want to bind with
const messagePath = '/message'

// Action to dispatch when the value in the database changes
const messageActionCreator = (message) => ({
  type: 'SET_MESSAGE',
  payload: message
});

// Portion of the state that should be written to the database
const messageSelector = (state) => state.message;

// Create a function to bind '/message' in the database
// with 'state.message' in the Redux store
const linkMessage = linkStoreWithMessage(
  messagePath, 
  messageActionCreator, 
  messageSelector
);

// Invoke anywhere in the code to set up the binding
const unlink = linkMessage(firebase.database(), store);

// Invoke unlink to remove the binding
unlink();

```



### `linkStoreWithDb(fromDb, fromStore)(database, store)`

Set up a custom binding between a Firebase realtime datbase instance and a Redux store. `linkStoreWithPath` uses `linkStoreWithDb` internally.

#### Example

```javascript
import { linkStoreWithDb } from 'firebase-redux';

// Set up a two way binding between '/message' in the 
// database and 'store.state' in the Redux store
const linkMessage = (db, store) => {
  // Keep track of the previous state
  let previous = store.getState();
  
  // Whether or not to write to the database
  let mustWrite = true;

  const fromDb = (db, dispatch) => {
    const listener = db.ref('/message').on("value", snap => {
      if (snap.val()) {
        // Dont't write the same value back to the database 
        mustWrite = false;
        
        // Update the redux store
        dispatch({
          type: 'SET_MESSAGE',
          payload: snap.val()
        });
        
        // Update is done. Other changes should be written to database
        mustWrite = true;
      }
    });
    
    // Return a method to stop listening for database changes
    return () => db.ref(path).off("value", listener);
  };

  const fromStore = (state, db) => {
    // Get the portion of the state we care about
    const portion = state.message;
    
    // Check if we need to write to the database
    if (mustWrite && portion !== previous) {
      // Write to the datbase
      db.ref(path).set(portion);
    }
    
    // Update the previous state
    previous = portion;
  };

  // Use linkStoreWithDb to tie it all together.
  return linkStoreWithDb(fromDb, fromStore)(db, store);
};

// Invoke anywhere in the code to set up the binding
const unlink = linkMessage(firebase.database(), store);

// Invoke unlink to remove the binding
unlink();

```



