import Button from './button.js';

export default class ButtonLightSlim extends Button {
	constructor(scene, x, y, label, callback) {
		const style = { fontFamily: 'Arial', fontSize: '24px', fill: '#000000' };
		super(scene, x, y, 'button-slim', 'button-slim-active', label, style, callback);
	}
}
