'use strict';

const Login = {};

Login.create = function() {
	Client.connect();
	
	// Display title screen message
	let nameLabel = game.add.text(MAP_LEFT + MAP_WIDTH / 2, MAP_TOP + MAP_HEIGHT / 2, "This will be the login screen. Click to start.", {font: '14px Space Mono', fill: '#FFFFFF'}).anchor.setTo(0.5);
}

Login.update = function() {
	// Start game when mouse is clicked
	if (game.input.activePointer.isDown) {
		game.state.start('play');
	}
}