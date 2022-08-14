const EXPIRE = 1 * 60 * 60 * 1000;
var otherUid;

/**
 * @Function lb_checkLobbies
 *
 * Checks for lobbies
 */
async function lb_checkLobbies() {
  // Reading the lobbies
  var lobbies = await fb_read("gameLobbies");
  // Reseting the lobby list html
  document.getElementById("d_lobbyList").innerHTML = "";

  // Using the display lobby function to create the list
  for (var x in lobbies) {
    if (lobbies[x].time + EXPIRE > Date.now()) {
      lb_displayLobby(lobbies[x]);
    } else {
      fb_delete("gameLobbies/" + x);
    }
  }
}
// Calling the function
lb_checkLobbies();

/**
 * @Function lb_displayLobby
 * @Param {object} _lobby = The lobby to display
 *
 * Creates the lobby html object with button to join
 */
function lb_displayLobby(_lobby) {
  document.getElementById("d_lobbyList").innerHTML += "<div class='lobby'><p>" + _lobby.name + "</p> <button onclick='lb_joinLobby(" + '"' + _lobby.uid + '"' + ")'>Join</div>";
}

/**
 * @Function lb_createLobby
 *
 * Creates a lobby and writes it to the database
 */
function lb_createLobby() {
  if (userDetails.username == "") return;
  
  // Writing the lobby
  fb_write("gameLobbies/" + userDetails.uid, {name: userDetails.username, uid: userDetails.uid, time: Date.now() + EXPIRE});
  
  // Listening for a response
  fb_readOn("gameLobbies/" + userDetails.uid + "/other", function(_other) {
    if (_other) {
      otherUid = _other;
      onlineGameID = userDetails.uid + "/" + _other;
      fb_delete("gameLobbies/" + userDetails.uid);
      myValue = 0;
      tt_startGame();
    }
  });
}

/**
 * @Function lb_joinLobby
 * @Param {string} _lobbyId = The ID of the lobby to join
 *
 * Joins a lobby
 */
function lb_joinLobby(_lobbyId) {
  // Sets the local variable that will be the games online ID
  onlineGameID = _lobbyId + "/" + userDetails.uid;
  otherUid = _lobbyId;
  // Writing a response to the database
  fb_write("gameLobbies/" + _lobbyId + "/other", userDetails.uid);
  // Setting the player
  myValue = 1;
  // Starting the game
  tt_startGame();
}

/**
 * @Function lb_leaveGame
 * @Param {bool} _us = True if we are the one leaving
 *
 * Leaves a lobby
 */
function lb_leaveGame(_us) {
  lb_checkLobbies();
  // Stopping the game vars reads
  fb_stopRead("gameVars/" + onlineGameID + "/playerTurn");
  fb_stopRead("gameVars/" + onlineGameID + "/grid");
  fb_stopRead("userDetails/" + otherUid);

  if (_us) {
    // Writing -1 to the player turn means that one player has ended the game
    fb_write("gameVars/" + onlineGameID + "/playerTurn", -1);
    setTimeout(() => fb_delete("gameVars/" + onlineGameID), 5000);
  } else {
    fb_delete("gameVars/" + onlineGameID);
  }
  
  // Resetting clicked array
  clickedArray = Array(9).fill(0);
  // Resetting the opponent score board
  im_displayDetails(1);
  im_showOnly("s_lobbyPage", "grid");
  document.getElementById("b_leave").style.display = "";
}

/**
 * @Function lb_clearGames
 *
 * Clears all games under out uid
 */
function lb_clearGames() {
  fb_delete("gameVars/" + userDetails.uid);
}
