import { Button } from '../../lib/phaser-ui.js';

export default class SubmitButton extends Button {
	constructor(scene, x, y, callback) {
		super(scene, x, y, 'button-slim', 'button-slim-active', "Submit", null, callback);
	}
}
