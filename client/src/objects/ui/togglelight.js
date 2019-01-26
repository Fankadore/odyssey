import Toggle from './toggle.js';

export default class ToggleLight extends Toggle {
	constructor(scene, x, y, label, callback) {
		const style = { fontFamily: 'Arial', fontSize: '24px', fill: '#000000' };
		super(scene, x, y, 'toggle', 'toggle-active', label, style, callback);
	}
}
