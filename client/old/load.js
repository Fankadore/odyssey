'use strict';

const Load = {};

Load.init = function () {
	game.stage.disableVisibilityChange = true;
}

Load.preload = function() {
	// Display loading message
	let loadingLabel = game.add.text(game.world.width / 2, game.world.height / 3, "Loading...", {font: '30px, Courier', fill: '#FFFFFF'}).anchor.setTo(0.5);
	game.stage.backgroundColor = '#000000';
	
	// Load Graphics
	this.load.image('tiles', 'client/assets/images/floor.png');
	this.load.image('slot', 'client/assets/images/slot.png');
	this.load.image('barRed', 'client/assets/images/BarRed.png');
	this.load.image('healthBar', 'client/assets/images/barGreen.png');
	this.load.image('energyBar', 'client/assets/images/barYellow.png');
	this.load.image('manaBar', 'client/assets/images/barBlue.png');
	this.load.spritesheet('sprites', 'client/assets/images/sprites.png', 32, 32);
	this.load.spritesheet('items', 'client/assets/images/potions.png', 32, 32);
	this.load.spritesheet('effects', 'client/assets/images/effects.png', 32, 32);

	// Map Inputs
	cursors = game.input.keyboard.createCursorKeys();
	cursors.lastPressed = null;
	keyEnter = game.input.keyboard.addKey(13);
	keyShift = game.input.keyboard.addKey(16);
	keyCtrl = game.input.keyboard.addKey(17);
	keyOne = game.input.keyboard.addKey(49);
	keyTwo = game.input.keyboard.addKey(50);
	keyThree = game.input.keyboard.addKey(51);
	keyFour = game.input.keyboard.addKey(52);
	keyFive = game.input.keyboard.addKey(53);

/*	// Capture Inputs
	game.input.keyboard.addKeyCapture([48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 							//numbers
															65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 	//alphabet
															112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 																//f keys
															9, 8, 12, 13, 16, 17, 18, 27, 32, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 93, 96, 106, 107, 109, 110, 		//other keys
															111, 186, 187, 188, 189, 190, 191, 192, 219, 220, 221, 222, 223
															]);
	game.input.mousePointer.capture = true;	*/
	game.input.activePointer.capture = true;
	game.canvas.oncontextmenu = (e) => e.preventDefault()
}

Load.create = function() {
	game.state.start('login');
}