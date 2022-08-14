/**************************************************************/
// im_interfaceManager.js
/**************************************************************/
im_showOnly("s_lobbyPage", "grid");
/**
 * @Function im_hide
 * @Param {string} _id = The id of the element to hide
 *
 * Hides an element
 */
function im_hide(_id) {
  document.getElementById(_id).style.display = "none";
}

/**
 * @Function im_hideAll
 *
 * Hides all sections element
 */
function im_hideAll() {
  var sections = document.getElementsByClassName("section");

  for (var x = 0; x < sections.length; x++) {
    sections[x].style.display = "none";
  }
}

/**
 * @Function im_show
 * @Param {string} _id = The id of the element to show
 * @Param {string} _displayType = The display type to use. Default is "block"
 *
 * Shows an element
 */
function im_show(_id, _displayType = "block") {
  document.getElementById(_id).style.display = _displayType;
}

/**
 * @Function im_fadeIn
 * @Param {string} _id = The id of the element to show
 * @Param {string} _displayType = The display type to use. Default is "block"
 * @Param {string} _duration = The time to fade in
 *
 * Shows an element by fading in
 */
function im_fadeIn(_id, _displayType = "block", _duration = 1) {
  im_show(_id, _displayType);
  document.getElementById(_id).style.animationName = "fadeIn";
  document.getElementById(_id).style.animationDuration = _duration + "s";
}

/**
 * @Function im_fadeOut
 * @Param {string} _id = The id of the element to show
 * @Param {string} _duration = The time to fade in
 *
 * Hides an element by fading out
 */
function im_fadeOut(_id, _duration = 1) {
  document.getElementById(_id).style.animationName = "fadeOut";
  document.getElementById(_id).style.animationDuration = _duration + "s";
  setTimeout(function() {im_hide(_id);}, _duration * 1000);
}

/**
 * @Function im_show
 * @Param {string} _id = The id of the element to show
 * @Param {string} _displayType = The display type to use. Default is "block"
 *
 * Hides all elements and shows 1
 */
function im_showOnly(_id, _displayType = "block") {
  im_hideAll();
  document.getElementById(_id).style.display = _displayType;
}


document.body.onresize = im_resized;
/**
 * @Function im_resized
 *
 * Resizes all of the elements that need to be resized
 */
function im_resized() {
  var page = document.getElementById("d_gameGrid");
  var pagePos = document.getElementById("d_pageContent");

  page.style.width = Math.min(pagePos.clientWidth, pagePos.clientHeight) + "px";
  page.style.height = Math.min(pagePos.clientWidth, pagePos.clientHeight) + "px";
  
}

/**
 * @Function im_displayDetails
 * @Param {string} _player = 0 or 1 depending on whether it is the
                               home or opposition player
 * @Param {string} _details = The details of the player to be displayed
 *
 * Displays _details in the scoreboard _player
 */
function im_displayDetails(_player, _details) {
  if (_details) {
    document.getElementById("h2_playerName" + _player).innerHTML = "Name: " + _details.username;
    document.getElementById("p_playerWins" + _player).innerHTML = "Wins: " + _details.wins;
    document.getElementById("p_playerLosses" + _player).innerHTML = "Losses: " + _details.losses;
    document.getElementById("p_playerDraws" + _player).innerHTML = "Draws: " + _details.draws;
    if (_details.wins + _details.losses + _details.draws != 0) {
      document.getElementById("p_playerWinRatio" + _player).innerHTML = "Win percent: " +
        Math.round(10000 * (_details.wins + _details.draws / 2) / (_details.wins + _details.losses + _details.draws)) / 100 + "%";
    } else {
      document.getElementById("p_playerWinRatio" + _player).innerHTML = "Win percent: 0%";
    }
    return;
  }

  document.getElementById("h2_playerName" + _player).innerHTML = "Name: Not in game";
  document.getElementById("p_playerWins" + _player).innerHTML = "Wins: Not in game";
  document.getElementById("p_playerLosses" + _player).innerHTML = "Losses: Not in game";
  document.getElementById("p_playerDraws" + _player).innerHTML = "Draws: Not in game";
  document.getElementById("p_playerWinRatio" + _player).innerHTML = "Win percent: Not in game";
  
}
