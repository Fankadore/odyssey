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

  create() {
		this.client = this.scene.get('clientScene');
		this.world = new Game(this);
		this.menu = new Menu(this);
		this.chatbox = new Chatbox(this, config.CHATBOX.x, config.CHATBOX.y);
		this.createGamepadInputs();
		this.createMouseInputs();

		this.inputKeys = this.input.keyboard.addKeys(config.KEYBOARD_KEYS);
		this.input.keyboard.on('keydown', event => this.onKeyDown(event));
		this.input.keyboard.on('keyup', event => this.onKeyUp(event));
	}

	onKeyDown(event) {
		let key = event.key;
		key = key.replace(/Page/g, 'Page_');
		key = key.replace(/Arrow/g, '');
		if (key === ' ') key = 'Space';

		if (this.inputKeys[key.toUpperCase()]) {
			if (key === 'Left') {
				this.inputs.left = true;
				this.inputs.direction = 'left';
			}
			else if (key === 'Right') {
				this.inputs.right = true;
				this.inputs.direction = 'right';
			}
			else if (key === 'Up') {
				this.inputs.up = true;
				this.inputs.direction = 'up';
			}
			else if (key === 'Down') {
				this.inputs.down = true;
				this.inputs.direction = 'down';
			}
			else if (key === 'Enter') {
				this.inputs.pickUp = true;
				if (this.chatbox.focus) this.chatbox.submitChat();
			}
			else if (key === 'Control') {
				this.inputs.attack = true;
			}
			else if (key === 'Shift') {
				this.inputs.run = true;
			}
			else if (key === 'F1') {
				this.inputs.macro1 = true;
			}
			else if (key === 'F2') {
				this.inputs.macro2 = true;
			}
			else if (key === 'F3') {
				this.inputs.macro3 = true;
			}
			else if (key === 'F4') {
				this.inputs.macro4 = true;
			}
			else if (key === 'Page_Up') {
				this.inputs.scrollUp = true;
			}
			else if (key === 'Page_Down') {
				this.inputs.scrollDown = true;
			}
			else if (key === 'Tab') {
				this.chatbox.setFocus(!this.chatbox.focus);
			}
			else if (key === 'Space') {
				if (this.chatbox.focus) this.chatbox.chatInput.addChar(' ');
			}
			else if (key === 'Backspace' || key === 'Delete') {
				if (this.chatbox.focus) this.chatbox.chatInput.removeChar();
			}
		}
		else {
			if (this.chatbox.focus) {
				if (this.inputKeys.SHIFT.isDown) key = key.toUpperCase();
				this.chatbox.chatInput.addChar(key);
			}
		}
	}
	
	onKeyUp(event) {
		let key = event.key;
		key = key.replace(/Page/g, 'Page_');
		key = key.replace(/Arrow/g, '');
		if (key === ' ') key = 'Space';

		if (this.inputKeys[key.toUpperCase()]) {
			if (key === 'Left') {
				this.inputs.left = false;
				if (this.inputs.right) this.inputs.direction = 'right';
				else if (this.inputs.up) this.inputs.direction = 'up';
				else if (this.inputs.down) this.inputs.direction = 'down';
				else this.inputs.direction = null;
			}
			else if (key === 'Right') {
				this.inputs.right = false;
				if (this.inputs.left) this.inputs.direction = 'left';
				else if (this.inputs.up) this.inputs.direction = 'up';
				else if (this.inputs.down) this.inputs.direction = 'down';
				else this.inputs.direction = null;
			}
			else if (key === 'Up') {
				this.inputs.up = false;
				if (this.inputs.left) this.inputs.direction = 'left';
				else if (this.inputs.right) this.inputs.direction = 'right';
				else if (this.inputs.down) this.inputs.direction = 'down';
				else this.inputs.direction = null;
			}
			else if (key === 'Down') {
				this.inputs.down = false;
				if (this.inputs.left) this.inputs.direction = 'left';
				else if (this.inputs.right) this.inputs.direction = 'right';
				else if (this.inputs.up) this.inputs.direction = 'up';
				else this.inputs.direction = null;
			}
			else if (key === 'Enter') {
				this.inputs.pickUp = false;
			}
			else if (key === 'Control') {
				this.inputs.attack = false;
			}
			else if (key === 'Shift') {
				this.inputs.run = false;
			}
			else if (key === 'F1') {
				this.inputs.macro1 = false;
			}
			else if (key === 'F2') {
				this.inputs.macro2 = false;
			}
			else if (key === 'F3') {
				this.inputs.macro3 = false;
			}
			else if (key === 'F4') {
				this.inputs.macro4 = false;
			}
			else if (key === 'Page_Up') {
				this.inputs.scrollUp = false;
			}
			else if (key === 'Page_Down') {
				this.inputs.scrollDown = false;
			}
			else if (key === 'Tab') {

			}
			else if (key === 'Space') {
	
			}
			else if (key === 'Backspace' || key === 'Delete') {
	
			}
		}
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

	createMouseInputs() {
		this.input.mouse.disableContextMenu();
		
		this.input.on('pointerdown', (pointer) => {
			const x = pointer.x;
			const y = pointer.y;
			const rightClick = !!pointer.rightButtonDown();
			let chatboxFocus = false;

			if (util.isWithinBounds(config.MAP, x, y)) {
				const messages = this.world.clickMap(x, y, rightClick);
				if (messages) {
					messages.forEach(message => {
						this.chatbox.clientsideMessage(message);
					});
				}
			}
			else if (util.isWithinBounds(config.INVENTORY, x, y)) {
				this.menu.clickInventory(x, y, rightClick);
			}
			else if (util.isWithinBounds(config.EQUIPMENT, x, y)) {
				this.menu.clickEquipment(x, y, rightClick);
			}
			else if (util.isWithinBounds(config.CHATBOX, x, y)) {
				chatboxFocus = true;
			}
			else if (util.isWithinBounds(config.CHATINPUT, x, y)) {
				chatboxFocus = true;
			}

			if (this.chatbox.focus !== chatboxFocus) this.chatbox.setFocus(chatboxFocus);
		});

		this.input.on('dragstart', (pointer, item) => {
			item.dragged = true;
		});

		this.input.on('drag', (pointer, item, dragX, dragY) => {
			item.x = pointer.x;
			item.y = pointer.y;
		});

		this.input.on('dragend', (pointer, item) => {
			setTimeout(() => item.dragged = false, 50);
	
			if (util.isWithinBounds(config.MAP, pointer.x, pointer.y)) {
				this.client.emitInputDrag('dragStopGame', item.slot);
				this.menu.clearItemInfo();
			}
			else if (util.isWithinBounds(config.INVENTORY, pointer.x, pointer.y)) {
				const newSlotX = this.menu.inventory.getSlotXFromX(pointer.x, config.INVENTORY.x);
				const newSlotY = this.menu.inventory.getSlotYFromY(pointer.y, config.INVENTORY.y);
				const newSlot = util.getIndexFromXY(newSlotX, newSlotY, config.INVENTORY.columns);
				if (item.slot !== newSlot) {
					this.client.emitInputDrag('dragStopInventory', item.slot, newSlot);
					this.menu.inventory.setSelected(newSlot);
				}
				
			}
			else if (util.isWithinBounds(config.EQUIPMENT, pointer.x, pointer.y)) {
				const newSlotX = this.menu.inventory.getSlotXFromX(pointer.x, config.EQUIPMENT.x);
				const newSlotY = this.menu.inventory.getSlotYFromY(pointer.y, config.EQUIPMENT.y);
				const newSlot = config.INVENTORY.size + util.getIndexFromXY(newSlotX, newSlotY, config.EQUIPMENT.columns);
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
