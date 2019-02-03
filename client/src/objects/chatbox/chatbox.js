import config from '../../config.js';

import ChatInput from './chatinput.js';
import Message from './message.js';

export default class Chatbox {
	constructor(scene, x, y) {
		this.scene = scene;
		this.x = x;
		this.y = y;
		this.messages = [];
		this.visibleMessages = [];
		this.showGameInfo = true;
		this.showGlobalMessages = true;
		this.showMapMessages = true;
		this.showPlayerMessages = true;
		this.currentLine = 0;
		this.focus = false;
		
		this.chatInput = new ChatInput(scene, config.CHATINPUT.x, config.CHATINPUT.y, "", () => this.setFocus(true));
	}

	onUpdate(data) {
		if (data && data.messages) {
			data.messages.forEach((messageData) => {
				this.messages.unshift(new Message(this.scene, messageData));
				this.refresh();
			});	
		}
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
				if (index >= this.currentLine && index < config.CHATBOX.lines + this.currentLine) {
					message.y = this.y + config.CHATBOX.height - (config.FONT.height * (index + 1 - this.currentLine)) - 2;
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
		this.messages.unshift(new Message(this.scene, messageData));
		this.refresh();
	}

	setFocus(focus) {
		this.focus = focus;
		this.chatInput.setFocus(focus);
		if (focus) this.chatInput.defaultMessage.setText("Type to chat...");
		else this.chatInput.defaultMessage.setText("");
	}

	submitChat() {
		this.scene.client.emitMapChat(this.chatInput.message);
		this.chatInput.updateText("");
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
