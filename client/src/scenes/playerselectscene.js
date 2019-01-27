import { Scene } from '../lib/phaser.js';
import config from '../config.js';
import SelectPlayerPanel from '../panels/selectplayerpanel.js';
import AddPlayerPanel from '../panels/addplayerpanel.js';

export default class PlayerSelectScene extends Scene {
  constructor() {
		super({key: 'playerSelectScene'});
  }

  init(initData) {
    this.account = initData.account;
		this.players = initData.players;
		this.playerTemplates = initData.playerTemplates;
  }

  create() {
		this.client = this.scene.get('clientScene');

		const centreX = config.GAME_LEFT + (config.GAME_WIDTH / 2);
		const centreY = config.GAME_TOP + (config.GAME_HEIGHT / 2);
		this.selectPlayerPanel = new SelectPlayerPanel(this, centreX, centreY);
		this.addPlayerPanel = new AddPlayerPanel(this, centreX, centreY);

		this.inputKeys = this.input.keyboard.addKeys(config.KEYBOARD_KEYS);
		this.input.keyboard.on('keydown', event => this.onKeyDown(event));
	}

	onKeyDown(event) {
		let key = event.key;
		key = key.replace(/Page/g, 'Page_');
		if (key === ' ') key = 'Space';

		if (this.selectPlayerPanel.active) this.selectPlayerPanel.onKeyDown(key);
		if (this.addPlayerPanel.active) this.addPlayerPanel.onKeyDown(key);
	}

	switchPanel() {
		this.selectPlayerPanel.setActive(!this.selectPlayerPanel.active);
		this.addPlayerPanel.setActive(!this.addPlayerPanel.active);
	}
}
