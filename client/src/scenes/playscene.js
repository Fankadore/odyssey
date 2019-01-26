import { Scene } from '../lib/phaser.js';
import util from '../lib/util.js';
import config from '../config.js';
import Game from '../objects/game/game.js';
import Menu from '../objects/menu/menu.js';
import Chatbox from '../objects/chatbox/chatbox.js';

export default class PlayScene extends Scene {
  constructor() {
		super({key: 'playScene'});
  }

	init(mapData) {
		this.client = null;
		this.world = null;
		this.menu = null;
		this.chatbox = null;
		this.gamepad = null;
		this.state = {
			direction: null,
			attack: false,
			pickUp: false,
			run: false,
			scroll: null,
			macro1: false,
			macro2: false,
			macro3: false,
			macro4: false
		};
		this.inputs = {
			left: false,
			right: false,
			up: false,
			down: false,
			direction: null,
			attack: false,
			pickUp: false,
			run: false,
			scrollUp: false,
			scrollDown: false,
			macro1: false,
			macro2: false,
			macro3: false,
			macro4: false
		};
		this.initData = mapData;
	}

  preload() {
		this.load.setPath('client/assets/gfx/');
		for (let i = 0; i < config.SPRITESHEETS.length; i++) {
			const assetName = config.SPRITESHEETS[i];
			this.load.spritesheet(assetName, `${assetName}.png`, {frameWidth: 32, frameHeight: 32});
		}

		for (let i = 0; i < config.IMAGES.length; i++) {
			const assetName = config.IMAGES[i];
			this.load.image(assetName, `${assetName}.png`);
		}
  }

  create() {
		this.client = this.scene.get('clientScene');
		this.world = new Game(this);
		this.menu = new Menu(this);
		this.chatbox = new Chatbox(this);
		this.createGamepadInputs();
		this.createKeyboardInputs();
		this.createMouseInputs();
	}

	createGamepadInputs() {
		this.input.gamepad.once('connected', pad => this.gamepad = pad);
		this.input.gamepad.on('disconnected', pad => this.gamepad = null);
		
		this.input.gamepad.on('down', (pad, button, index) => {
			if (this.gamepad !== pad) this.gamepad = pad;

			if (button.index === 14) this.inputs.left = true;
			else if (button.index === 15) this.inputs.right = true;
			else if (button.index === 12) this.inputs.up = true;
			else if (button.index === 13) this.inputs.down = true;
			else if (button.index === 2) this.inputs.pickUp = true;
			else if (button.index === 6) this.inputs.run = true;
			else if (button.index === 7) this.inputs.attack = true;
		});
		this.input.gamepad.on('up', (pad, button, index) => {
			if (button.index === 14) this.inputs.left = false;
			else if (button.index === 15) this.inputs.right = false;
			else if (button.index === 12) this.inputs.up = false;
			else if (button.index === 13) this.inputs.down = false;
			else if (button.index === 2) this.inputs.pickUp = false;
			else if (button.index === 6) this.inputs.run = false;
			else if (button.index === 7) this.inputs.attack = false;
		});
	}

	createKeyboardInputs() {
		this.input.keyboard.on('keydown', event => {
			if (event.keyCode === 37) {
				this.inputs.left = true;
				this.inputs.direction = 'left';
			}
			else if (event.keyCode === 39) {
				this.inputs.right = true;
				this.inputs.direction = 'right';				
			}
			else if (event.keyCode === 38) {
				this.inputs.up = true;
				this.inputs.direction = 'up';
			}
			else if (event.keyCode === 40) {
				this.inputs.down = true;
				this.inputs.direction = 'down';
			}
			else if (event.keyCode === 13) this.inputs.pickUp = true;
			else if (event.keyCode === 16) this.inputs.run = true;
			else if (event.keyCode === 17) this.inputs.attack = true;
			else if (event.keyCode === 112) this.inputs.macro1 = true;
			else if (event.keyCode === 113) this.inputs.macro2 = true;
			else if (event.keyCode === 114) this.inputs.macro3 = true;
			else if (event.keyCode === 115) this.inputs.macro4 = true;
			else if (event.keyCode === 33) this.inputs.scrollUp = true;
			else if (event.keyCode === 34) this.inputs.scrollDown = true;
		});
		this.input.keyboard.on('keyup', event => {
			if (event.keyCode === 37) {
				this.inputs.left = false;
				if (this.inputs.right) this.inputs.direction = 'right';
				else if (this.inputs.up) this.inputs.direction = 'up';
				else if (this.inputs.down) this.inputs.direction = 'down';
				else this.inputs.direction = null;
			}
			else if (event.keyCode === 39) {
				this.inputs.right = false;
				if (this.inputs.left) this.inputs.direction = 'left';
				else if (this.inputs.up) this.inputs.direction = 'up';
				else if (this.inputs.down) this.inputs.direction = 'down';
				else this.inputs.direction = null;
			}
			else if (event.keyCode === 38) {
				this.inputs.up = false;
				if (this.inputs.left) this.inputs.direction = 'left';
				else if (this.inputs.right) this.inputs.direction = 'right';
				else if (this.inputs.down) this.inputs.direction = 'down';
				else this.inputs.direction = null;
			}
			else if (event.keyCode === 40) {
				this.inputs.down = false;
				if (this.inputs.left) this.inputs.direction = 'left';
				else if (this.inputs.right) this.inputs.direction = 'right';
				else if (this.inputs.up) this.inputs.direction = 'up';
				else this.inputs.direction = null;
			}
			else if (event.keyCode === 13) this.inputs.pickUp = false;
			else if (event.keyCode === 16) this.inputs.run = false;
			else if (event.keyCode === 17) this.inputs.attack = false;
			else if (event.keyCode === 112) this.inputs.macro1 = false;
			else if (event.keyCode === 113) this.inputs.macro2 = false;
			else if (event.keyCode === 114) this.inputs.macro3 = false;
			else if (event.keyCode === 115) this.inputs.macro4 = false;
			else if (event.keyCode === 33) this.inputs.scrollUp = false;
			else if (event.keyCode === 34) this.inputs.scrollDown = false;
		});
	}

	createMouseInputs() {
		this.input.mouse.disableContextMenu();
		
		this.input.on('pointerdown', (pointer) => {
			const x = pointer.x;
			const y = pointer.y;
			const rightClick = !!pointer.rightButtonDown();
			
			if (this.isWithinMapBounds(x, y)) {
				const messages = this.world.clickMap(x, y, rightClick);
				if (messages) {
					messages.forEach(message => {
						this.chatbox.clientsideMessage(message);
					});
				}
			}
			else if (this.isWithinInventoryBounds(x, y)) this.menu.clickInventory(x, y, rightClick);
			else if (this.isWithinEquipmentBounds(x, y)) this.menu.clickEquipment(x, y, rightClick);
		});

		this.input.on('dragstart', (pointer, item) => {
			item.dragged = true;
		});

		this.input.on('drag', (pointer, item, dragX, dragY) => {
			item.x = pointer.x - (config.TILE_SIZE / 2);
			item.y = pointer.y - (config.TILE_SIZE / 2);
		});

		this.input.on('dragend', (pointer, item) => {
			setTimeout(() => item.dragged = false, 50);
	
			if (this.isWithinMapBounds(pointer.x, pointer.y)) {
				this.client.emitInputDrag('dragStopGame', item.slot);
				this.menu.clearItemInfo();
			}
			else if (this.isWithinInventoryBounds(pointer.x, pointer.y)) {
				const newSlotX = this.menu.inventory.getSlotXFromX(pointer.x, config.INVENTORY_LEFT);
				const newSlotY = this.menu.inventory.getSlotYFromY(pointer.y, config.INVENTORY_TOP);
				const newSlot = util.getIndexFromXY(newSlotX, newSlotY, config.INVENTORY_COLUMNS);
				if (item.slot !== newSlot) {
					this.client.emitInputDrag('dragStopInventory', item.slot, newSlot);
					this.menu.inventory.setSelected(newSlot);
				}
				
			}
			else if (this.isWithinEquipmentBounds(pointer.x, pointer.y)) {
				const newSlotX = this.menu.inventory.getSlotXFromX(pointer.x, config.EQUIPMENT_LEFT);
				const newSlotY = this.menu.inventory.getSlotYFromY(pointer.y, config.EQUIPMENT_TOP);
				const newSlot = config.INVENTORY_SIZE + util.getIndexFromXY(newSlotX, newSlotY, config.EQUIPMENT_COLUMNS);
				if (item.slot !== newSlot) {
					this.client.emitInputDrag('dragStopEquipment', item.slot, newSlot);
					this.menu.inventory.setSelected(newSlot);
				}
			}
		});
	}

	onUpdate(data) {
		if (this.world) this.world.onUpdate(this, data.game);
		if (this.menu) this.menu.onUpdate(data.menu);
		if (this.chatbox) this.chatbox.onUpdate(data.chatbox);
	}

	onLoadMap(mapData) {
		this.world.onLoadMap(mapData.tiles);
		this.menu.onLoadMap(mapData.name);
	}

	isWithinMapBounds(x, y) {
		return (x >= config.MAP_LEFT && x < config.MAP_RIGHT && y >= config.MAP_TOP && y < config.MAP_BOTTOM);
	}

	isWithinInventoryBounds(x, y) {
		return (x >= config.INVENTORY_LEFT && x < config.INVENTORY_RIGHT && y >= config.INVENTORY_TOP && y < config.INVENTORY_BOTTOM);
	}
	
	isWithinEquipmentBounds(x, y) {
		return (x >= config.EQUIPMENT_LEFT && x < config.EQUIPMENT_RIGHT && y >= config.EQUIPMENT_TOP && y < config.EQUIPMENT_BOTTOM);
	}

	update() {
		if (this.gamepad) this.updateGamepadSticks();

		if (this.state.attack !== this.inputs.attack) {
			this.state.attack = this.inputs.attack;
			this.client.emitInput('attack', this.inputs.attack);
		}
		if (this.state.pickUp !== this.inputs.pickUp) {
			this.state.pickUp = this.inputs.pickUp;
			this.client.emitInput('pickup', this.inputs.pickUp);
		}
		if (this.state.run !== this.inputs.run) {
			this.state.run = this.inputs.run;
			this.client.emitInput('run', this.inputs.run);
		}
		if (this.state.macro1 !== this.inputs.macro1) {
			this.state.macro1 = this.inputs.macro1;
			if (this.inputs.macro1) this.client.emitInput('macro1');
		}
		if (this.state.macro2 !== this.inputs.macro2) {
			this.state.macro2 = this.inputs.macro2;
			if (this.inputs.macro2) this.client.emitInput('macro2');
		}
		if (this.state.macro3 !== this.inputs.macro3) {
			this.state.macro3 = this.inputs.macro3;
			if (this.inputs.macro3) this.client.emitInput('macro3');
		}
		if (this.state.macro4 !== this.inputs.macro4) {
			this.state.macro4 = this.inputs.macro4;
			if (this.inputs.macro4) this.client.emitInput('macro4');
		}

		if (!this.state.scroll) {
			if (this.inputs.scrollUp) this.state.scroll = 'up';
			else if (this.inputs.scrollDown) this.state.scroll = 'down';
		}
		else if (this.state.scroll === 'up' && !this.inputs.scrollUp) {
			if (this.inputs.scrollDown) this.state.scroll = 'down';
			else this.state.scroll = null;
		}
		else if (this.state.scroll === 'down' && !this.inputs.scrollDown) {
			if (this.inputs.scrollUp) this.state.scroll = 'up';
			else this.state.scroll = null;
		}
		if (this.state.scroll === 'up') this.chatbox.scrollUp();
		else if (this.state.scroll === 'down') this.chatbox.scrollDown();

		if (this.state.direction !== this.inputs.direction) {
			this.state.direction = this.inputs.direction;
			this.client.emitInputMove(this.state.direction);
		}
	}
	
	updateGamepadSticks() {
		const x = this.gamepad.axes[0].value;
		const y = this.gamepad.axes[1].value;
		const cutoff = 0.75;
		if (x < -cutoff) this.inputs.direction = 'left';
		else if (x > cutoff) this.inputs.direction = 'right';
		else if (y < -cutoff) this.inputs.direction = 'up';
		else if (y > cutoff) this.inputs.direction = 'down';
		else this.inputs.direction = null;
	}
}
