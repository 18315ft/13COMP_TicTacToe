/**************************************************************/
// fb_io.js
// Written by Finn Thompson - Term 1 2022
/**************************************************************/
fb_initialise();
var debug = true;

/**
 * @Function fb_initialise
 * 
 * Initialises the firebase
 */
function fb_initialise() {
  const firebaseConfig = {
    apiKey: "AIzaSyBehohhkQrF8142IF2LFDZdEWGZmnrIrvA",
    authDomain: "comp-2022-finn-thompson.firebaseapp.com",
    projectId: "comp-2022-finn-thompson",
    storageBucket: "comp-2022-finn-thompson.appspot.com",
    messagingSenderId: "914013731705",
    appId: "1:914013731705:web:9dfb93a07e98d17af10da8",
    measurementId: "G-F5GFLKWXV0"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
}

/**
 * @Function fb_read
 * @Param {string} _path = the path to read
 * 
 * Reads a specific database record
 */
async function fb_read(_path) {	
  var data;

  await firebase.database().ref(_path).once("value", (_snap) => data = _snap.val(), errMsg);
  
  return(data);

  function errMsg(_err) {
    if (!debug) return;
    if (_err) {
      console.log(_err);
    }
  }
}

/**
 * @Function fb_readOnSetVar
 * @Param {string} _path = the path to read
 * @Param {string} _return = the function to run on return
 * 
 * Runs a function whenever a specific database record
 *  changes and passes it the data
 */
function fb_readOn(_path, _return) {
  firebase.database().ref(_path).on("value", gotRecord, errMsg);

  function gotRecord(snapshot) {
    _return(snapshot.val());
  }

  function errMsg(_err) {
    if (!debug) return;
    if (_err) {
      console.log(_err);
    }
  }
}

/**
 * @Function fb_readOnSetVar
 * @Param {string} _path = the path to read
 * @Param {string} _var = the variable to return data to
 * 
 * Reads a specific database record whenever it changes
 *  and changes a variable
 */
function fb_readOnSetVar(_path, _var) {
  fb_readOn(_path, (_data) => window[_var] = _data);
}

/**
 * @Function fb_stopRead
 * @Param {string} _path = the path to stop reading
 *
 * Stops a fb_readOn function
 */
function fb_stopRead(_path) {	
  firebase.database().ref(_path).off();
}

/**
 * @Function fb_write
 * @Param {string} _path = the path to write to
 * @Param {string} _data = the data to write
 * 
 * Writes to a specific database path
 */
function fb_write(_path, _data) { 
  if (_path != null && _path != undefined) {
    firebase.database().ref(_path).set(_data,
      (_err) => {
        if (!debug) return;
        if (_err) {
          console.log(_err);
          return;
        }
        
        console.log("Write successful");
      });
  }
}

/**
 * @Function fb_push
 * @Param {string} _path = the path to write to
 * @Param {string} _data = the data to write
 * 
 * Uses push to write to a specific database path.
 *   Push means that the key will be the firebase time
 */
function fb_push(_path, _data) { 
  if (_path != null && _path != undefined) {
    firebase.database().ref(_path).push().set(_data,
      (_err) => {
        if (!debug) return;
        if (_err) {
          console.log(_err);
          return;
        }
        
        console.log("Push successful");
      });
  }
}

/**
 * @Function fb_delete
 * @Param {string} _path = the path to delete
 * 
 * Deletes a specific database record
 */
function fb_delete(_path) { 
  if (_path != null && _path != undefined) {
    firebase.database().ref(_path).remove(
      (_err) => {
        if (!debug) return;
        if (_err) {
          console.log(_err);
          return;
        }
        
        console.log("Delete successful");
      });
  }
}
/**************************************************************/
//    END OF MODULE
/**************************************************************/