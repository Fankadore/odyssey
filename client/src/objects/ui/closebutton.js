import { Button } from '../../lib/phaser-ui.js';

export default class CloseButton extends Button {
	constructor(scene, x, y, callback) {
    super(scene, x, y, 'close-button', 'close-button-active', "", null, callback);
	}
}
