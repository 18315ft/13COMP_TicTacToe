var clickedArray = Array(9).fill(0);
var playerNum = 0;
var myValue = 0;
var playerArray = [{value: -1, symbl: "X"},
                   {value: 1, symbl: "O"}];
var gameRunning = false;
var onlineGameID = 0;

/**
 * @Function tt_startGame
 *
 * Starts the game
 */
function tt_startGame() {
  // Updating the html
  im_resized();
  im_showOnly("s_gamePage", "flex");
  document.getElementById("b_leave").style.display = "block";
  // Getting the game vars
  fb_readOn("gameVars/" + onlineGameID + "/playerTurn", (_a) => (_a != -1) ? playerNum = _a : lb_leaveGame());
  fb_readOn("gameVars/" + onlineGameID + "/grid", tt_updateGrid);
  fb_readOn("userDetails/" + otherUid, (_snap) => im_displayDetails(1, _snap));
}



/**
 * @Function tt_gridClick
 * @Param {number} _input = the grid button clicked
 *
 * Changes clickedArray to whatever player clicked it, disables the button and changes the player
 */
function tt_gridClick(_input) {
  // Resetting player turn and clickedArray //
  if (!gameRunning) {
    // Resetting clickedArray and grid HTML
    // Resetting clicked array
    clickedArray = Array(9).fill(0);
    playerNum = myValue;
  }
  
  // Checking if it is the player is allowed to click //
  // Updating local and firebase vars //
  if (clickedArray[_input] == 0 && playerNum == myValue) {
    // Updating clickedArray
    clickedArray[_input] = playerArray[playerNum].value;
    fb_write("gameVars/" + onlineGameID + "/grid", clickedArray);

    // Changing the player turn
    playerNum = 1 - playerNum;
    fb_write("gameVars/" + onlineGameID + "/playerTurn", playerNum);

    //tt_updateGrid();
  }
}

/**
 * @Function tt_gridUpdate
 * @Param {array} _array = the grid array given by firebase
 *
 * Displays the grid
 */
function tt_updateGrid(_array) {
  // If there is no array, that means that the game has just been set up and
  //  so the array isn't there yet
  if (!_array) return;
  
  clickedArray = _array;
  
  if (!gameRunning) {
    gameRunning = true;
    // Getting rid of win sign
    document.getElementById("p_textBox").innerHTML = "";
  }

  tt_displayGrid();
  tt_checkWin();
}

/**
 * @Function tt_displayGrid
 *
 * Displays the grid
 */
function tt_displayGrid() {

  for (var x in clickedArray) {
    if (clickedArray[x] == 0) {
      tt_getButton(x).innerHTML = "";
    } else {
      gameRunning = true;
      tt_getButton(x).innerHTML = playerArray[(clickedArray[x] + 1) / 2].symbl;
    }
  }
}

/**
 * @Function tt_checkWin
 *
 * Checks whether there is a winner
 */
function tt_checkWin() {
  var total;

  for (var x = 0; x < 2; x++) {
    // Checking columns and rows
    for (var i = 0; i < 3; i++) {
      // Checking columns
      // clickedArray[i] is the top button, [x + 3] is the one below it, [x + 6] is the bottom button
      total = clickedArray[i] + clickedArray[i + 3] + clickedArray[i + 6];
      if (total == (3 * playerArray[x].value)) {
        tt_winner(x);
        return;
      }

      // Checking row
      // clickedArray[i * 3] is the left button, [x * 3 + 1] is the middle button it, [x * 3 + 2] is the right button
      total = clickedArray[i * 3] + clickedArray[i * 3 + 1] + clickedArray[i * 3 + 2];
      if (total == (3 * playerArray[x].value)) {
        tt_winner(x);
        return;
      }
    }
  
    // Checking diagonals
    total = clickedArray[0] + clickedArray[4] + clickedArray[8];
    if (total == (3 * playerArray[x].value)) {
      tt_winner(x);
      return;
    }
  
    // Checking diagonals
    total = clickedArray[2] + clickedArray[4] + clickedArray[6];
    if (total == (3 * playerArray[x].value)) {
      tt_winner(x);
      return;
    }
  }

  // Checking to see if there are any empty grid spots
  for (var x in clickedArray) {
    if (clickedArray[x] == 0) {
      return;
    }
  }
  
  // If no empty grid spots, then it calls the winner function without arguments
  tt_winner();
}

/**
 * @Function tt_winner(_player)
 * @Param {number} _player = the player that won
 *
 * Does winning things
 */
function tt_winner(_player) {
  // Getting rid of win sign
  document.getElementById("p_textBox").innerHTML = "";
  gameRunning = false;
  if (_player == undefined) {
    document.getElementById("p_textBox").innerHTML = "Tie";
    userDetails.draws ++;
    fb_write("userDetails/" + userDetails.uid + "/draws", userDetails.draws);
    im_displayDetails(0, userDetails);
    return;
  }
  var winner = playerArray[_player].symbl;
  document.getElementById("p_textBox").innerHTML = "Player " + winner + " wins";

  if (_player == myValue) {
    userDetails.wins ++;
    fb_write("userDetails/" + userDetails.uid + "/wins", userDetails.wins);
  }
  
  if (_player == 1 - myValue) {
    userDetails.losses ++;
    fb_write("userDetails/" + userDetails.uid + "/losses", userDetails.losses);
  }

  im_displayDetails(0, userDetails);
}

/**
 * @Function tt_getButton(_id)
 * @Param {number} _id = the id of the button to get
 *
 * Returns a button
 */
function tt_getButton(_id) {
  return (document.getElementById("b_gridButton" + _id));
}