(function() {
"use strict";


var mobileDetect = function() {

    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);

    return check;

};

var isMobile = false;


function renderMap(display) {
	var mapArr = display.map;

	var elementColor = {
		neutral: "lightgrey",
		player1: "#d33",
		player2: "#33d",
		dot: "#123456",
		false: "rgba(0, 0, 0, 0.1)"
	};

	var squareColor = {
		player1: "#b11",
		player2: "#11b"
	};

	var lastMoveColor = {
		player1: "#f77",
		player2: "#77f"
	};

	display.cx.clearRect(0, 0, display.cx.canvas.width, display.cx.canvas.height);

	var location = function (arrLoc, displayLoc) {
		return arrLoc * display.level.scale + display.view[displayLoc];
	};

	var circumference = Math.PI * 2,
		radius = display.level.scale / 4,
		centerOffset = display.level.scale / 2,
		lastMove = display.moves.undos.length ? display.moves.undos[display.moves.undos.length - 1] : null;

	mapArr.forEach(function (row, y) {
		row.forEach(function (tile, x) {
			//var pointTo = mapArr[y][x].connectedTo;
			var xLoc = location(x, "x") + centerOffset,
				yLoc = location(y, "y") + centerOffset + 3,
				context = display.cx,
				lineColor;

			context.lineWidth = radius;

			if(mapArr[y][x].square) {
				display.cx.fillStyle = squareColor[mapArr[y][x].square];
				display.cx.fillRect(xLoc, yLoc, display.level.scale, display.level.scale);
			}

			function drawConnectionLines(strokeColor, startX, startY, endX, endY) {
				context.strokeStyle = strokeColor;
				context.beginPath();
				context.moveTo(startX, startY);
				context.lineTo(endX, endY);
				context.stroke();
			}

			if (mapArr[y][x].connectedTo.x) {
				if (lastMove.line.x === x && lastMove.line.y === y && lastMove.line.direction === "x") {
					lineColor = lastMoveColor[lastMove.user];
				} else {
					lineColor = elementColor[mapArr[y][x].connectedTo.x];
				}

				drawConnectionLines(
					lineColor,
					xLoc,
					yLoc,
					location(x + 1, "x") + centerOffset,
					yLoc
				);
			} else if (mapArr[y][x].connectedTo.x === false) { //if line is not claimed
				lineColor = elementColor[mapArr[y][x].connectedTo.x];
				drawConnectionLines(
					lineColor,
					xLoc,
					yLoc,
					location(x + 1, "x") + centerOffset,
					yLoc
				);
			}

			if (mapArr[y][x].connectedTo.y) {
				if (lastMove.line.x === x && lastMove.line.y === y && lastMove.line.direction === "y") {
					lineColor = lastMoveColor[lastMove.user];
				} else {
					lineColor = elementColor[mapArr[y][x].connectedTo.y];
				}

				drawConnectionLines(
					lineColor,
					xLoc,
					yLoc,
					xLoc,
					location(y + 1, "y") + centerOffset
				);
			} else if (mapArr[y][x].connectedTo.y === false) {
				lineColor = elementColor[mapArr[y][x].connectedTo.y];
				drawConnectionLines(
					lineColor,
					xLoc,
					yLoc,
					xLoc,
					location(y + 1, "y") + centerOffset
				);
			}

				display.cx.fillStyle = elementColor[tile.type];

			if(mapArr[y][x].type === "dot") {
				var dot = new Path2D();
				dot.arc(xLoc, yLoc, radius, 0, circumference, true);
				display.cx.fill(dot);
			}

			if (
				Object.keys(display.view.select).length !== 0 &&
				display.view.select.x === x &&
				display.view.select.y === y
			) {
				display.cx.strokeStyle = "gold";
				display.cx.strokeRect(location(display.view.select.x, "x"), location(display.view.select.y, "y"), display.level.scale, display.level.scale);
			}
		});
	});
}

var tileKey = {
	_: "horizontal",
	"|": "vertical",
	p: "player1",
	l: "player2",
	".": "dot"
};

var p1Name = document.getElementById("player1-name-input"),
	p2Name = document.getElementById("player2-name-input");

var lastLevel = 3;

var players = {
	"Player 1": p1Name.value ? p1Name.value : "Red Player",
	"Player 2": p2Name.value ? p2Name.value : "Blue Player",
	computerPlayerOn: true,
	timeoutDuration: 2500
};

function MapMaker(tile, col, row) {
	var generatedMap = [];
	if (!row) {
		row = col;
	}

	for(var i = 0; i < col; ++i) {
		var currentRow = "";
		for(var j = 0; j < row; ++j) {
			currentRow += tile;
		}
		generatedMap.push(currentRow);
	}

	return generatedMap;
}

// function validTile(map, tileToCheck) { //use this to implement click and drag
// 	if (map[tileToCheck.y] !== undefined && map[tileToCheck.y][tileToCheck.x] !== undefined) {
// 		return true;
// 	} else {
// 		return false;
// 	}
// }

function findTile(tilePos, view, scale) {
	var centerOffset = scale / 2;
	var foundTile = {
		x: Math.floor((tilePos.x - view.x - centerOffset) / scale),
		y: Math.floor((tilePos.y - view.y - centerOffset) / scale)
	};

	return foundTile;
}

function playSound(soundEffect) {
	var click = new Audio("media/" + soundEffect + ".mp3");
	click.volume = soundEffect === "pop" ? .3 : .5;
	click.play();
}

var dotMap = new MapMaker(".", 6);

var CanvasDisplay = function (parent, level, elementClass, listener) {
	function MapGenerator(readableLevel) {
		var colMaxLength = readableLevel.length - 1;
		return readableLevel.map(function (line, indexCol) {
			var rowMaxIndex = line.length - 1;
			return line.split("").map(function (character, indexRow) {
				var tileObject = {
					type: tileKey[character],
					connectedTo: {}
				};

				if (indexRow !== rowMaxIndex) {
					tileObject.connectedTo.x = false;
				}
				if(indexCol !== colMaxLength) {
					tileObject.connectedTo.y = false;
				}
				return tileObject;
			});
		});
	}

	this.map = new MapGenerator(level);

	var scoreboardHeight = document.getElementById("scoreboard").offsetHeight / 2;

	var canvas = document.createElement("canvas");
	canvas.className = elementClass;
	canvas.width = window.innerWidth - 25;  //5;
	canvas.height = window.innerHeight - 5;
	parent.appendChild(canvas);

	this.cx = canvas.getContext("2d");

	this.activePlayer = "player1";

	if(!listener) {
		listener = this.cx;
	}

	isMobile = mobileDetect();

	//add listeners
	// listener.canvas.addEventListener("mousedown", this.selectMouseDown.bind(this));
	listener.canvas.addEventListener("click", this.mapSelect.bind(this));
	//wheel event for Chrome, Safari, and Opera
	//this.cx.canvas.addEventListener("mousewheel", this.mapZoom.bind(this));
	//wheel event for Firefox
	//this.cx.canvas.addEventListener("DOMMouseScroll", this.mapZoom.bind(this));

	//touch events
	if(isMobile){
        this.cx.canvas.addEventListener("touchstart", this.mapTouchStart.bind(this));
	// 	this.cx.canvas.addEventListener("touchmove", this.mapMoveTouch.bind(this));
	}


	this.touch = {
		x: null,
		y: null,
		hypotenuse: null
	};

	this.level = {
		height: level.length,
		width: level[0].length,
		scale: this.findFullScreenScale(level.length, level[0].length, canvas.height - scoreboardHeight, canvas.width)
	};

	this.view = {
		x: canvas.width / 2 - (this.level.width * this.level.scale / 2),
		y: canvas.height / 2 - (this.level.height * this.level.scale / 2) + scoreboardHeight,
		width: canvas.width,
		height: canvas.height,

		select: {},
		offset: 5,
		scoreboardHeight: scoreboardHeight
	};

	this.score = {
		player1: 0,
		player2: 0,
		total: (this.level.height - 1) * (this.level.width - 1)
	};

	this.moves = {
		undos: [],
		redos: []//not implemented, possibly remove later
	};
};

CanvasDisplay.prototype.computerPlayer = function() {
	if(!players.computerPlayerOn || this.activePlayer === "player1") {
		return null;
	}

	var safeMove = [], //holds all possible moves with less then 2 connections
		unsafeMove = [], //holds all other possible moves
		connectionToggle = this.connectionToggle.bind(this),
		moveComplete,
		that = this;

	function randomFromRange(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	}

	function timeoutSetter(location, squareWasMade) {
		if (this.activePlayer === "player1") {
			moveComplete = true;
		} else {
			moveComplete = connectionToggle(location);
		}

		if (moveComplete || this.score.total === this.score.player1 + this.score.player2 || !squareWasMade) {
			renderMap(this);
		} else {
			renderMap(this);
			this.computerPlayer();
		}
	}

	this.map.forEach(function(row, rowIndex, colArray) {
		row.forEach(function(tile, tileIndex) {

			if(!tile.square) {	//if there is a square already on this dot don't bother checking it for valid conenctions
				var edges = {	//is there a line on that border of the square? false is no line, true is line
					top: false,
					bottom: false,
					left: false,
					right: false
				},
					totalEdges = 0,	//number of edges this square has
					clickLoc = {	//translating the map array location with the click location
						x: tileIndex * 2,
						y: rowIndex * 2
					};

				if (tile.connectedTo.x) {
					edges.top = true;
					++totalEdges;
				} else if (tile.connectedTo.x === undefined) {
					delete edges.top;
				}

				if (tile.connectedTo.y) {
					edges.left = true;
					++totalEdges;
				} else if (tile.connectedTo.y === undefined) {
					delete edges.left;
				}

				if (colArray[rowIndex + 1] && colArray[rowIndex + 1][tileIndex].connectedTo.x) {
					edges.bottom = true;
					++totalEdges;
				}

				if (colArray[rowIndex][tileIndex + 1] && colArray[rowIndex][tileIndex + 1].connectedTo.y) {
					edges.right = true;
					++totalEdges;
				}

				if (totalEdges === 3) {
					var location;
					switch (false) {
						case edges.top:
							location = {x: clickLoc.x + 1, y: clickLoc.y};
							break;

						case edges.left:
							location = {x: clickLoc.x, y: clickLoc.y + 1};
							break;

						case edges.bottom:
							location = {x: clickLoc.x + 1, y: clickLoc.y + 2};
							break;

						case edges.right:
							location = {x: clickLoc.x + 2, y: clickLoc.y + 1};
							break;
					}

					setTimeout(timeoutSetter.bind(that), players.timeoutDuration, location, true);
					moveComplete = false;

				} else if (totalEdges < 2) {
					if (edges.top === false) {
						safeMove.push({x: clickLoc.x + 1, y: clickLoc.y});
					}

					if (edges.left === false) {
						safeMove.push({x: clickLoc.x, y: clickLoc.y + 1});
					}
				} else {

					if (edges.top === false) {
						unsafeMove.push({x: clickLoc.x + 1, y: clickLoc.y});
					}

					if (edges.left === false) {
						unsafeMove.push({x: clickLoc.x, y: clickLoc.y + 1});
					}
				}
			}
		});
	});

	if (safeMove.length && moveComplete !== false) {
		setTimeout(timeoutSetter.bind(this), players.timeoutDuration, safeMove[randomFromRange(0, safeMove.length - 1)]);
	} else if (moveComplete !== false) {
		setTimeout(timeoutSetter.bind(this), players.timeoutDuration, unsafeMove[randomFromRange(0, unsafeMove.length - 1)]);
	}

};

CanvasDisplay.prototype.findFullScreenScale = function(levelHeight, levelWidth, canvasHeight, canvasWidth){
	var newFoundScale = canvasWidth / levelWidth;

	if (newFoundScale * levelHeight > canvasHeight) {
		newFoundScale = canvasHeight / levelHeight - 1;
	}

	return newFoundScale;
};

CanvasDisplay.prototype.endGame = function() {
	var winnerMessage = document.getElementById("winning-message");
	if(this.score.player1 + this.score.player2 === this.score.total) {
		if(this.score.player1 > this.score.player2) {
			winnerMessage.innerHTML = players["Player 1"] + " Wins!";
			document.getElementById("winner").classList.remove("p2");
			document.getElementById("winner").classList.add("p1");
		} else if (this.score.player1 < this.score.player2) {
			winnerMessage.innerHTML = players["Player 2"] + " Wins!";
			document.getElementById("winner").classList.remove("p1");
			document.getElementById("winner").classList.add("p2");
		} else {
			winnerMessage.innerHTML = "Draw! Good Game.";
			document.getElementById("winner").classList.remove("p1");
			document.getElementById("winner").classList.remove("p2");
		}
		playSound("victory");
		document.getElementById("modal").classList.toggle("hide");
		document.getElementById("winner").classList.remove("hide");
	}
};

CanvasDisplay.prototype.mapSelect = function (event) {
	var canvas,
		clickLoc,
		pos,
		tileLoc;

	if (this.view.move === true) {
		this.view.move = false;
		return null;
	}

	canvas = this.cx.canvas;
	pos = this.relativePos(event, canvas);
	clickLoc = findTile(pos, this.view, this.level.scale / 2);

	tileLoc = {
		x: clickLoc.x / 2,
		y: clickLoc.y / 2
	};

	// if (validTile(this.map, tileLoc)) {//this is suppose to select dots
	// 	//this.view.select = tileLoc;
	// } else
	if (
		tileLoc.x <= this.level.width - 1 &&
		tileLoc.y <= this.level.height - 1 &&
		clickLoc.x % 2 + clickLoc.y % 2 < 2
		) {
		if (!players.computerPlayerOn || players.computerPlayerOn && this.activePlayer === "player1"){
			this.connectionToggle(clickLoc);
		}
	} else {
		this.view.select = {};
		return null;
	}

	renderMap(this);

	if(players.computerPlayerOn && this.activePlayer !== "player1") {
		this.computerPlayer();
	}

	event.preventDefault();
};


CanvasDisplay.prototype.mapTouchStart = function (touchEvent) {
	var canvas,
		clickLoc,
		pos,
		tileLoc;

	if (this.view.move === true) {
		this.view.move = false;
		return null;
	}


    var touches = touchEvent.changedTouches;

    var event = touches[0];

    console.log('touch event');


	canvas = this.cx.canvas;

	pos = this.relativePos(event, canvas);
    
	clickLoc = findTile(pos, this.view, this.level.scale / 2);

	tileLoc = {
		x: clickLoc.x / 2,
		y: clickLoc.y / 2
	};

	// if (validTile(this.map, tileLoc)) {//this is suppose to select dots
	// 	//this.view.select = tileLoc;
	// } else
	if (
		tileLoc.x <= this.level.width - 1 &&
		tileLoc.y <= this.level.height - 1 &&
		clickLoc.x % 2 + clickLoc.y % 2 < 2
		) {
		if (!players.computerPlayerOn || players.computerPlayerOn && this.activePlayer === "player1"){
			this.connectionToggle(clickLoc);
		}
	} else {
		this.view.select = {};
		return null;
	}

	renderMap(this);

	if(players.computerPlayerOn && this.activePlayer !== "player1") {
		this.computerPlayer();
	}

	touchEvent.preventDefault();
};

CanvasDisplay.prototype.updateScore = function (player) {
	document.getElementById(player + "score").innerHTML = ++this.score[player];
	this.endGame();
};

//TODO refactor display out of zoomOnCenter
CanvasDisplay.prototype.zoomOnCenter = function (display, currentScale, posFromEdge, pos) {
	var diffScale = display.level.scale / currentScale;

	display.view.x = posFromEdge.x * diffScale + pos.x;
	display.view.y = posFromEdge.y * diffScale + pos.y + this.view.scoreboardHeight;
};

//return location of curser of click
CanvasDisplay.prototype.relativePos = function (event, element) {
	var rect = element.getBoundingClientRect();

	return {
		x: Math.floor(event.clientX - rect.left),
		y: Math.floor(event.clientY - rect.top)
	};
};

CanvasDisplay.prototype.playerToggle = function () {
	var toggleElement = document.getElementById("scoreboard");
	if (this.activePlayer === "player1") {
		toggleElement.className = "";
		toggleElement.className = "scoreboard player2-active";
		this.activePlayer = "player2";
	} else {
		toggleElement.className = "";
		toggleElement.className = "scoreboard player1-active";
		this.activePlayer = "player1";
	}
};

CanvasDisplay.prototype.connectionToggle = function(connectionPoint) {
	var parentDotLoc = {
		x: Math.floor(connectionPoint.x / 2),
		y: Math.floor(connectionPoint.y / 2)
	};

	var wasSquareMade;

	if (
		connectionPoint.y >= 0 &&
		connectionPoint.x >= 0
	) {
		if (
			connectionPoint.x % 2 &&
			!this.map[parentDotLoc.y][parentDotLoc.x].connectedTo.x
		) {
			this.map[parentDotLoc.y][parentDotLoc.x].connectedTo.x = this.activePlayer;
			wasSquareMade = this.formSquare(parentDotLoc, "x");
			this.moves.undos.push({
				user: this.activePlayer,
				line: {
					x: parentDotLoc.x,
					y: parentDotLoc.y,
					direction: "x"
				},
				square: wasSquareMade
			});
		} else if (
			connectionPoint.y % 2 &&
			!this.map[parentDotLoc.y][parentDotLoc.x].connectedTo.y
		) {
			this.map[parentDotLoc.y][parentDotLoc.x].connectedTo.y = this.activePlayer;
			wasSquareMade = this.formSquare(parentDotLoc, "y");
			this.moves.undos.push({
				user: this.activePlayer,
				line: {
					x: parentDotLoc.x,
					y: parentDotLoc.y,
					direction: "y"
				},
				square: wasSquareMade
			});
		} else {
			return false;
		}
		if (wasSquareMade.length < 1) {
			playSound("player");
			this.playerToggle();
			return true;
		} else {
			playSound("pop");
			return false;
		}
	}
};

CanvasDisplay.prototype.formSquare = function(dotLoc, lineActivated) {
	var squareWasMade = [];

	if(lineActivated === "y") {

		if (
			this.map[dotLoc.y] &&
			this.map[dotLoc.y][dotLoc.x - 1] &&
			this.map[dotLoc.y][dotLoc.x - 1].connectedTo.x &&
			this.map[dotLoc.y][dotLoc.x - 1].connectedTo.y &&
			this.map[dotLoc.y + 1][dotLoc.x - 1].connectedTo.x
		) {
			this.updateScore(this.activePlayer);
			this.map[dotLoc.y][dotLoc.x - 1].square = this.activePlayer;
			squareWasMade.push({x: dotLoc.x - 1, y: dotLoc.y});
		}

		if (
			this.map[dotLoc.y + 1] &&
			this.map[dotLoc.y][dotLoc.x].connectedTo.x &&
			this.map[dotLoc.y][dotLoc.x + 1].connectedTo.y &&
			this.map[dotLoc.y + 1][dotLoc.x].connectedTo.x
		) {
			this.updateScore(this.activePlayer);
			this.map[dotLoc.y][dotLoc.x].square = this.activePlayer;
			squareWasMade.push({x: dotLoc.x, y: dotLoc.y});
		}
	} else {
		if (
			this.map[dotLoc.y - 1] &&
			this.map[dotLoc.y - 1][dotLoc.x + 1] &&
			this.map[dotLoc.y - 1][dotLoc.x].connectedTo.y &&
			this.map[dotLoc.y - 1][dotLoc.x + 1].connectedTo.y &&
			this.map[dotLoc.y - 1][dotLoc.x].connectedTo.x
		) {
			this.updateScore(this.activePlayer);
			this.map[dotLoc.y - 1][dotLoc.x].square = this.activePlayer;
			squareWasMade.push({x: dotLoc.x, y: dotLoc.y - 1});
		}

		if (
			this.map[dotLoc.y + 1] &&
			this.map[dotLoc.y + 1][dotLoc.x + 1] &&
			this.map[dotLoc.y][dotLoc.x].connectedTo.y &&
			this.map[dotLoc.y + 1][dotLoc.x].connectedTo.x &&
			this.map[dotLoc.y][dotLoc.x + 1].connectedTo.y
		) {
			this.updateScore(this.activePlayer);
			this.map[dotLoc.y][dotLoc.x].square = this.activePlayer;
			squareWasMade.push({x: dotLoc.x, y: dotLoc.y});
		}
	}
	return squareWasMade;
};

var dotCanvas = new CanvasDisplay(document.getElementById("game"), dotMap, "dot-canvas play-canvas");

function toggleModal(modalToClose) {
	document.getElementById(modalToClose).classList.toggle("hide");
}
window.turnModalOff = function (modalToClose) {
//	alert ("turnModalOff start, modalToClose = " + modalToClose);
	if (!document.getElementById(modalToClose).classList.contains("hide"))
	{
    	document.getElementById(modalToClose).classList.add("hide");
//		alert ("turnModalOff turned off");
	}
//	alert ("turnModalOff end");
};

window.toggleModal = toggleModal;
window.resetSettings = function () {
	resetMap('beginner', 4);
	resetPlay('play-against');
	resetPlayerNames();
};
window.setCharacter = function (characterId) {
	var min=0;
	var max=12;
	var imageNum = Math.floor(Math.random() * (max - min + 1)) + min;
//	alert ("setCharacter = " + imageNum);

	if (characterId == "blueCharacter")
	{
		var lastImageNum = getLastImageNum("redCharacter");
		while (imageNum==lastImageNum)
		{
			imageNum =  Math.floor(Math.random() * (max - min)) + min;
		}
	}

	document.getElementById(characterId).innerHTML = "<img src='characters/" + imageNum + ".jpg' />";
};
function getLastImageNum (characterId) {
	var lastImage = document.getElementById(characterId).innerHTML;
	var lastImageNum = lastImage.substring(21,23);
	if (isNaN(lastImageNum.charAt(1)))
	{
		lastImageNum = lastImageNum.charAt(0);
	}

	return lastImageNum;
}
window.resetMap = function (level, xtiles, ytiles) {
//	alert ("resetMap, level = " + level + ", xtiles = " + xtiles + ", ytiles = " + ytiles);
    // new may 16
   	if ((level=="same") || (level=="sameNoWinner"))
		xtiles = "same";
	else
		resetLevel(level);

	if (xtiles === "same") {
		xtiles = lastLevel;
		if (level=="same")
 		{
			toggleModal("winner");
			toggleModal("modal");
		}
	}

	document.getElementById("redPlayerBox").classList.remove("largeGame");
	document.getElementById("bluePlayerBox").classList.remove("largeGame");

//    if (level=="pro") {
//		document.getElementById("redPlayerBox").classList.add("largeGame");
//		document.getElementById("bluePlayerBox").classList.add("largeGame");
//	}
	if (xtiles === "random") {
		xtiles = (Math.random() * 13) + 7;
		ytiles = (Math.random() * 13) + 7;
		document.getElementById("redPlayerBox").classList.add("largeGame");
		document.getElementById("bluePlayerBox").classList.add("largeGame");
	}

	lastLevel = xtiles > 7 ? "random" : xtiles;
	document.getElementById("game").removeChild(dotCanvas.cx.canvas);
	var newMap = new MapMaker(".", xtiles, ytiles);
	dotCanvas = new CanvasDisplay(document.getElementById("game"), newMap, "dot-canvas play-canvas");
	document.getElementById("player1score").innerHTML = 0;
	document.getElementById("player2score").innerHTML = 0;

	// add characters
	setCharacter("redCharacter");
	setCharacter("blueCharacter");


	document.getElementById("scoreboard").classList.remove("player2-active");
	document.getElementById("scoreboard").classList.add("player1-active");
	renderMap(dotCanvas);
};
// window.resetLevel is new may 16
window.resetLevel = function (whichLevel) {
//	alert ("resetLevel");
	document.getElementById('beginner').classList.remove('active');
	document.getElementById('intermediate').classList.remove('active');
	document.getElementById('advanced').classList.remove('active');
	document.getElementById('pro').classList.remove('active');
	document.getElementById(whichLevel).classList.add('active');
}
// window.resetPlay is new may 16
window.resetPlay = function (playAgainst) {
//	alert("resetPlay");
	document.getElementById('play-against').classList.remove('active');
	document.getElementById('play-against-no').classList.remove('active');
	document.getElementById(playAgainst).classList.add('active');

	players.computerPlayerOn = document.getElementById('play-against').classList.contains('active');
//	alert ("computerPlayerOn = " + players.computerPlayerOn);
};
window.resetPlayerNames = function () {
//	document.getElementById('player1-name-input').value="";
//	alert("resetPlayerNames 1");
//	document.getElementById('player2-name-input').value="";

//	p1Name="";
//	p2Name="";
//	alert("reset p1Name and 2 = " + p1Name + ", " + p2Name);
//	updateName.call(p1Name);
//	alert("after updateName.call 1");
//	updateName(p2Name);
//	alert("end of resetPlayerNames - player 1 = " + p1Name);
};
var computersTurn;//holds the timeout to activate the player's turn

window.undo = function () {

	clearTimeout(computersTurn);

	if (dotCanvas.moves.undos.length < 1) {
		return null;
	}

	var lastMove = dotCanvas.moves.undos.pop();

	dotCanvas.map[lastMove.line.y][lastMove.line.x].connectedTo[lastMove.line.direction] = false;

	if (lastMove.square.length > 0) {
		lastMove.square.forEach(function(element) {
			--dotCanvas.score[lastMove.user];
			dotCanvas.map[element.y][element.x].square = false;
		});

		document.getElementById(lastMove.user + "score").innerHTML = dotCanvas.score[lastMove.user];
	}

	if (dotCanvas.activePlayer !== lastMove.user) {
		dotCanvas.playerToggle();
	}

	if (dotCanvas.activePlayer === "player2" && players.computerPlayerOn) {
		computersTurn = setTimeout(dotCanvas.computerPlayer.call(dotCanvas), players.timeoutDuration);
	}

	renderMap(dotCanvas);
};

//listener to toggle if computer player is playing or not
document.getElementById("play-against").addEventListener("change", function() {
//	players.computerPlayerOn = this.checked;
});


function updateName() {
	var name = this.value,
		player = this.dataset.player,
		scoreboardNameId = player.replace(" ", "") + "Name";

//    alert ("updateName: player = " + player + ", name = " + name + ", this.value = " + this.value);
	if (this.value) {
		name = this.value;
	} else {
		name = player;
	}

	players[player === "Red Player" ? "Player 1" : "Player 2"] = name;

	document.getElementById(scoreboardNameId).innerHTML = name;
}

updateName.call(p1Name);
updateName.call(p2Name);

//add listener to change name when keys are pressed
document.getElementById("player1-name-input").addEventListener("keyup", updateName, false);
document.getElementById("player2-name-input").addEventListener("keyup", updateName, false);

window.onresize = function () {
	//this resizes the canvas
	dotCanvas.view.width = dotCanvas.cx.canvas.width = window.innerWidth - dotCanvas.view.offset;
	dotCanvas.view.height = dotCanvas.cx.canvas.height = window.innerHeight - dotCanvas.view.offset;
	//this centers the content on the screen
	dotCanvas.view.x = dotCanvas.cx.canvas.width / 2 - (dotCanvas.level.width * dotCanvas.level.scale / 2);
	dotCanvas.view.y = dotCanvas.cx.canvas.height / 2 - (dotCanvas.level.height * dotCanvas.level.scale / 2);

	renderMap(dotCanvas);
};

renderMap(dotCanvas);
})();
