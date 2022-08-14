var userDetails = {
  uid: "",
  username: "",
  wins: 0,
  losses: 0,
  draws: 0
};

ac_autoLogin();

/**************************************************************/
// ac_setAccountDetails()
// Uploads account details to firebase
// Input:  n/a
// Return: n/a
/**************************************************************/
async function ac_setAccountDetails(_form) {
  userDetails.username = _form.name.value;

  fb_write("userDetails/" + userDetails.uid, userDetails);
  im_displayDetails(0, userDetails);
  im_fadeOut("s_register");
}

/**************************************************************/
// ac_autoLogin()
// Automatically login to Firebase
// Input:  n/a
// Return: n/a
/**************************************************************/
function ac_autoLogin() {
  // On auth state change. I assume once the account is signed in
  firebase.auth().onAuthStateChanged(authChange);

  // Called on auth state changed
  async function authChange(_user) {
    if (_user) {
      console.log(_user);
      userDetails.uid = _user.uid;
      var fbUser = await fb_read("userDetails/" + userDetails.uid);

      if (fbUser) {
        console.log("ac_autoLogin: user registered");
        userDetails = fbUser;
        im_displayDetails(0, userDetails);

        lb_clearGames();
        
        return;
      }
      
      console.log("ac_autoLogin: user not registered");
      im_fadeIn("s_register", "flex");
      
      return;
    }
    ac_redirectLogin();
    
    console.log("User isn't here");
  }
}

/**************************************************************/
// ac_redirectLogin()
// Login to google
// Input:  n/a
// Return: n/a
/**************************************************************/
function ac_redirectLogin() {
  console.log("ac_redirectLogin");
  
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider);
}

/**************************************************************/
// ac_logout()
// Logout of Firebase
// Input:  n/a
// Return: n/a
/**************************************************************/
function ac_logout() {
  console.log("ac_logout");
  firebase.auth().signOut();
}

