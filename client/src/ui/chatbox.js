import Cursor from './cursor.js';
import config from '../config.js';

export default class Chatbox {
	constructor(scene) {
		this.messages = [];
		this.visibleMessages = [];
		this.showGameInfo = true;
		this.showGlobalMessages = true;
		this.showMapMessages = true;
		this.showPlayerMessages = true;
		

		this.currentLine = 0;

		this.cursor = new Cursor(scene);
	}

	onUpdate() {
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
				let index = this.visibleMessages.indexOf(message);
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
	
	scrollUp() {
		if (this.currentLine < this.visibleMessages.length - 1) {
			this.currentLine++;
		}
	}

	scrollDown() {
		if (this.currentLine > 0) {
			this.currentLine--;
		}
	}

	toggleGameInfo() {
		this.showGameInfo = !this.showGameInfo;
		this.onUpdate();
	}
	
	toggleGlobalMessages() {
		this.showGlobalMessages = !this.showGlobalMessages;
		this.onUpdate();
	}
	
	toggleMapMessages() {
		this.showMapMessages = !this.showMapMessages;
		this.onUpdate();
	}
	
	togglePlayerMessages() {
		this.showPlayerMessages = !this.showPlayerMessages;
		this.onUpdate();
	}
}
