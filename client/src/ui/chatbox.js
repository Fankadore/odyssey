import config from '../config.js';
import Cursor from './cursor.js';
import Message from './message.js';

export default class Chatbox {
	constructor() {
		this.messages = [];
		this.visibleMessages = [];
		this.showGameInfo = true;
		this.showGlobalMessages = true;
		this.showMapMessages = true;
		this.showPlayerMessages = true;
		this.currentLine = 0;
		this.cursor = null;
	}

	create(scene) {
		scene.add.image(config.CHATBOX_LEFT, config.CHATBOX_TOP, 'chatbox').setOrigin(0, 0);
		this.cursor = new Cursor(scene);
		this.Message = (messageData) => new Message(scene, messageData);
	}

	onUpdate(data) {
		if (data) {
			data.forEach((messageData) => {
				this.messages.unshift(this.Message(messageData));
				this.refresh();
			});	
		}

		this.cursor.onUpdate();
	}
	
	refresh() {
		this.visibleMessages = this.messages.filter((message) => {
			if (message.type === 'gameInfo' && this.showGameInfo) return true;
			if (message.type === 'messageGlobal' && this.showGlobalMessages) return true;
			if (message.type === 'messageMap' && this.showMapMessages) return true;
			if (message.type === 'messagePlayer' && this.showPlayerMessages) return true;
			return false;
		});
		
		if (this.currentLine >= this.visibleMessages.length) {
			this.currentLine = 0;
		}

		this.messages.forEach((message) => {
			if (this.visibleMessages.includes(message)) {
				const index = this.visibleMessages.indexOf(message);
				if (index >= this.currentLine && index < config.CHATBOX_LINES + this.currentLine) {
					message.y = config.CHATBOX_BOTTOM - config.FONT_SIZE - (config.FONT_SIZE * (index - this.currentLine + 2));
					message.setVisible(true);
				}
				else {
					message.setVisible(false);
				}
			}
			else {
				message.setVisible(false);
			}
		});
	}

	clientsideMessage(message, colour) {
		const messageData = {
			senderId: null,
			message: message,
			type: 'gameInfo',
			colour: colour
		};
		this.messages.unshift(this.Message(messageData));
		this.refresh();
	}

	scrollUp() {
		if (this.currentLine < this.visibleMessages.length - 1) {
			this.currentLine++;
			this.refresh();
		}
	}

	scrollDown() {
		if (this.currentLine > 0) {
			this.currentLine--;
			this.refresh();
		}
	}

	toggleGameInfo() {
		this.showGameInfo = !this.showGameInfo;
		this.refresh();
	}
	
	toggleGlobalMessages() {
		this.showGlobalMessages = !this.showGlobalMessages;
		this.refresh();
	}
	
	toggleMapMessages() {
		this.showMapMessages = !this.showMapMessages;
		this.refresh();
	}
	
	togglePlayerMessages() {
		this.showPlayerMessages = !this.showPlayerMessages;
		this.refresh();
	}
}
