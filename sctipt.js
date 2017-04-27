$(document).ready(function(){
var game = [];
var squares = ["green", "red", "yellow", "blue"];
var step = 0;
var count = 0;
var speed = 700;
var strictMode = false;

function disableSquares(choice) {
	for (var i = 0; i < squares.length; i++) {
  if (choice) {
      document.getElementById(squares[i]).style.pointerEvents = 'none';
    } else {
      document.getElementById(squares[i]).style.pointerEvents = 'auto';
    }
  }
}
disableSquares(true);

  // sound
function sound(color) {
  var noise;
  var audio = $('<audio autoplay></audio>');
  var soundurl = "http://damianblaszczak.pl/lab/simon_sounds/";

  if (squares.indexOf(color) > -1) {
    noise = squares.indexOf(color);
  } else if (color == "buzz") {
    noise = "buzz";
  } else {
  	noise = "win";
  }
    audio.append("<source src='" + soundurl + noise + ".mp3'/>");
    $("#sound").html(audio);
}

// new round
function newRound() {
  disableSquares(true);
  for (var i = 0; i < squares.length; i++) {
	  $("#"+squares[i]).removeClass(squares[i]+"-a")
	}
  game.push(squares[Math.floor(Math.random() * squares.length)]);
  currentSteps();
  button(game, 0);
}

// button press action
function button(game, index) {
  if (step != 0) {
    if (index < game.length) {

      // speed
      if (step === 5) {
        speed = 600;
      }
      if (step === 10){
        speed = 400;
      }
      if (step === 15) {
        speed = 200;
      }

      var color = game[index];
      $("#" + color).addClass(color + "-a", speed, function() {
        sound(color);
        $("#" + color).removeClass(color + "-a", speed, function() {
          button(game, index + 1);
        });
      });
    }
    if (index == game.length) {
      disableSquares(false);
    }
  }
}

// button clicks
function clickBtn(color) {
  if (color == game[count]) {
    count++;
    if (count == game.length) {
      count = 0;
      newRound();
    }
  } else {
    if (strictMode == true) {
      loseGame();
    } else {
      disableSquares(true);
      button(game, 0);
      count = 0;
    }
  }
}

function loseGame() {
  sound("buzz");
  $(".simon").addClass("gameover", function() {
    $(".simon").delay(1200).removeClass("gameover", function() {
      reset();
    });
  });
}

function winGame() {
  sound("win");
  $(".simon").addClass("winner", function() {
    $(".simon").delay(1200).removeClass("winner", function() {
      reset();
    });
  });
}

function reset() {
  game = [];
  step = 0;
  count = 0;
  speed = 800;
  disableSquares(true);
  $("#start").prop("disabled", false);
  document.getElementById("count").innerHTML = "-";
}

// update count and winning animation
function currentSteps() {
  step ++;

  if (step == 21) {
    winGame();
    return;
  }
  document.getElementById("count").innerHTML = step;
}

$(".simon").click(function() {
  var currentId = $(this).attr('id');
  clickBtn(currentId);
});

// color change and sound on mouse clicks
$(".simon").mouseup(function() {
    var currentId = $(this).attr('id');
    $("#" + currentId).removeClass(currentId + "-a")
  })
  .mousedown(function() {
    var currentId = $(this).attr('id');
    $("#" + currentId).addClass(currentId + "-a")
    sound(currentId);
  });

$("#start").click(function() {
  newRound();
  $("#start").prop("disabled", true);
})

$("#reset").click(function() {
  reset();
})

$('#strict-switch').bootstrapSwitch();

$('#strict-switch').on('switchChange.bootstrapSwitch', function() {
  strictMode = !strictMode;
});
	
	});