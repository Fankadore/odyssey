import Toggle from './toggle.js';

export default class ToggleLightSlim extends Toggle {
	constructor(scene, x, y, label, callback) {
		const style = { fontFamily: 'Arial', fontSize: '24px', fill: '#000000' };
		super(scene, x, y, 'toggle-slim', 'toggle-slim-active', label, style, callback);
	}
}
