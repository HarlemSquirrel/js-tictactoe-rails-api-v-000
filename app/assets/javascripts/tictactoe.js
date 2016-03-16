
var currentGame;

var turn = 0;

var winningCombos = [
  ['[data-x="0"][data-y="0"]','[data-x="1"][data-y="0"]','[data-x="2"][data-y="0"]'], //[[0,0],[1,0],[2,0]],
  ['[data-x="0"][data-y="1"]','[data-x="1"][data-y="1"]','[data-x="2"][data-y="1"]'], //[[0,1],[1,1],[2,1]],
  ['[data-x="0"][data-y="2"]','[data-x="1"][data-y="2"]','[data-x="2"][data-y="2"]'], //[[0,2],[1,2],[2,2]],
  ['[data-x="0"][data-y="0"]','[data-x="1"][data-y="1"]','[data-x="2"][data-y="2"]'], //[[0,0],[1,1],[2,2]],
  ['[data-x="0"][data-y="0"]','[data-x="0"][data-y="1"]','[data-x="0"][data-y="2"]'], //[[0,0],[0,1],[0,2]],
  ['[data-x="2"][data-y="0"]','[data-x="2"][data-y="1"]','[data-x="2"][data-y="2"]'], //[[2,0],[2,1],[2,2]],
  ['[data-x="1"][data-y="0"]','[data-x="1"][data-y="1"]','[data-x="1"][data-y="2"]'], //[[1,0],[1,1],[1,2]],
  ['[data-x="2"][data-y="0"]','[data-x="1"][data-y="1"]','[data-x="0"][data-y="2"]']  //[[2,0],[1,1],[0,2]]
];


function attachListeners() {
  $('[data-x]').click(function() {
    doTurn(this);
  });

  $('#save').on('click', function(event){
    event.preventDefault();
    save();
  });


  $("#previous").on('click', function(event) {
    event.preventDefault();
    gameList();
  });

  loadGame(); 
}

function doTurn(cell) {
  if ($(cell).text() === "") {
    updateState(cell);
    if (checkWinner()) {
      resetGame();
    } else {
      turn += 1;
    }
  }
}

function player() {
  if (turn % 2 === 0) {
    return "X";
  } else {
    return "O";
  }
}

function updateState(cell) {
  $(cell).text(player());
}

function checkWinner() {
  var winner;

  $.each(winningCombos, function (index, combo) {
    if ($(combo[0]).text() === player() && $(combo[1]).text() === player() && $(combo[2]).text() === player()) {
      winner = player();
    }
  });

  if (winner) {
    message("Player " + winner + " Won!");
    return winner;
  } else if (turn > 7) {
    message("Tie game");
    return 'tie';
  } else {
    return false;
  }
}

function message(string) {
  $('#message').text(string);
}

function resetGame() {
  $('td').text("");
  turn = 0;
}


function save() {
  var gameBoard = [],
      url = '';
      method = '';

  $('td').each(function() {
    gameBoard.push($(this).text());
  });

  if(currentGame) {
    url = "/games/" + currentGame
    method = "PATCH"
  } else {
    url = "/games"
    method = "POST"
  }

  $.ajax({
    url: url,
    method: method,
    data: {
      game: {
        state: gameBoard
      }
    }
  });
  
  gameBoard = [];
  gameList();
}


function loadGame(){
  $('div#games').on('click', 'button', function(){
    method = "PATCH";
    currentGame = parseInt($(this).attr("data-game"));
    turn = 0;
    $('td').each(function(data){
      if (data.html != ""){
        turn++;
      }
    });
    var state = $(this).attr("data-state");
    var board = state.split(',');
    $('td').each(function(i, val) {
      $(val).html(board[i]);
    });
  });
}

function gameList(){
  var gameList = [];
  $.getJSON("/games").done(function(data) {
    gameList = data.games;
    var list = $("#games");
    list.html("");
    gameList.forEach(function(game){
      list.append('<button class="load" data-game="' + game['id'] + '" data-state="' + game['state'] + '">' + game['id'] + '</button><br>');
    });
  });
}

$(document).ready(function() {
  attachListeners();
});
