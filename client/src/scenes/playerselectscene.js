import { Scene } from '../lib/phaser.js';
import config from '../config.js';
import SelectPlayerPanel from '../panels/selectplayerpanel.js';
import AddPlayerPanel from '../panels/addplayerpanel.js';
import AddTemplatePanel from '../panels/addtemplatepanel.js';
import AdminPanel from '../panels/adminpanel.js';

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

		const centreX = config.GAME.x + (config.GAME.width / 2);
		const centreY = config.GAME.y + (config.GAME.height / 2);
		this.selectPlayerPanel = new SelectPlayerPanel(this, centreX, centreY);
		this.addPlayerPanel = new AddPlayerPanel(this, centreX, centreY);
		this.addTemplatePanel = new AddTemplatePanel(this, centreX, centreY);
		this.adminPanel = new AdminPanel(this, centreX, centreY);

		this.inputKeys = this.input.keyboard.addKeys(config.KEYBOARD_KEYS);
		this.input.keyboard.on('keydown', event => this.onKeyDown(event));
	}

	onKeyDown(event) {
		let key = event.key;
		key = key.replace(/Page/g, 'Page_');
		key = key.replace(/Arrow/g, '');
		key = key.replace(/Control/g, 'Ctrl');
		key = key.replace(/\'/g, 'BackTick');
		if (key === ' ') key = 'Space';

		if (this.selectPlayerPanel.active) this.selectPlayerPanel.onKeyDown(key);
		if (this.addPlayerPanel.active) this.addPlayerPanel.onKeyDown(key);
		if (this.addTemplatePanel.active) this.addTemplatePanel.onKeyDown(key);
		if (this.adminPanel.active) this.adminPanel.onKeyDown(key);
	}

	switchPanel(panelName) {
		if (panelName === "selectPlayer") {
			this.selectPlayerPanel.setActive(true);
			this.addPlayerPanel.setActive(false);
			this.adminPanel.setActive(false);
		}
		else if (panelName === "addPlayer") {
			this.addPlayerPanel.setActive(true);
			this.selectPlayerPanel.setActive(false);
			this.addTemplatePanel.setActive(false);
		}
		else if (panelName === "addTemplate") {
			this.addTemplatePanel.setActive(true);
			this.addPlayerPanel.setActive(false);
		}
		else if (panelName === "admin") {
			this.adminPanel.setActive(true);
			this.selectPlayerPanel.setActive(false);
		}
	}
}
