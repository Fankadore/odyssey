import { Scene } from '../lib/phaser.js';
import config from '../config.js';
import SelectPlayerPanel from '../objects/playerselect/selectplayerpanel.js';
import AddPlayerPanel from '../objects/playerselect/addplayerpanel.js';

export default class PlayerSelectScene extends Scene {
  constructor() {
		super({key: 'playerSelectScene'});
  }

  init(initData) {
    this.account = initData.account;
		this.players = initData.players;
		this.playerTemplates = initData.playerTemplates;
  }

	preload() {
		this.load.setPath('client/assets/gfx/');
		this.load.image('panel-large', 'panel-large.png');
		this.load.image('panel-small', 'panel-small.png');
		this.load.image('text-input', 'text-input.png');
		this.load.image('button', 'button.png');
		this.load.image('button-active', 'button-active.png');
		this.load.image('button-slim', 'button-slim.png');
		this.load.image('button-slim-active', 'button-slim-active.png');
		this.load.image('toggle-slim', 'toggle-slim.png');
		this.load.image('toggle-slim-active', 'toggle-slim-active.png');
		this.load.image('close-button', 'close-button.png');
		this.load.image('close-button-active', 'close-button-active.png');
	}

  create() {
		this.client = this.scene.get('clientScene');
		const centreX = config.GAME_LEFT + (config.GAME_WIDTH / 2);
		const centreY = config.GAME_TOP + (config.GAME_HEIGHT / 2);
		this.selectPlayerPanel = new SelectPlayerPanel(this, centreX, centreY);
		this.addPlayerPanel = new AddPlayerPanel(this, centreX, centreY);
		this.addPlayerPanel.setVisible(false).setActive(false);
	}

	switchPanel() {
		this.selectPlayerPanel.setVisible(!this.selectPlayerPanel.visible).setActive(!this.selectPlayerPanel.active);
		this.addPlayerPanel.setVisible(!this.addPlayerPanel.visible).setActive(!this.addPlayerPanel.active);
	}
}
