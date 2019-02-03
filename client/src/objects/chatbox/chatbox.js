import config from '../../config.js';

import ChatInput from './chatinput.js';

export default class Chatbox {
	constructor(scene) {
		this.scene = scene;
		this.x = config.CHATBOX.x;
    this.y = config.CHATBOX.y;
    this.width = config.CHATBOX.width;
    this.height = config.CHATBOX.height;

    this.messages = [];
    this.filteredMessages = [];
    this.filters = ['gameInfo', 'messageGlobal', 'messageMap', 'messagePlayer'];
		this.focus = false;
    
    this.textMask = scene.make.graphics();
    this.textMask.fillRect(this.x, this.y, this.width, this.height);
    this.displayText = scene.add.text(this.x, this.y + this.height - 2, "", config.FONT)
    .setColor('#ffffff').setOrigin(0, 1).setWordWrapWidth(this.width).setMask(this.textMask.createGeometryMask());

    this.chatInput = new ChatInput(scene, () => this.setFocus(true));
	}

	onUpdate(data) {
		if (data && data.messages) {
			data.messages.forEach((messageData) => {
        this.messages.push(messageData);
        if (this.filters.includes(messageData.type)) {
          this.filteredMessages.push(messageData.message);
          this.refresh();
        }
			});	
		}
	}
	
	refresh() {
    const text = this.filteredMessages.join('\n');
    this.displayText.setText(text);
	}

	clientsideMessage(message, colour) {
		const messageData = {
			senderId: null,
			message: message,
			type: 'gameInfo',
			colour: colour
		};
    this.messages.push(messageData);
    if (this.filters.includes(messageData.type)) {
      this.filteredMessages.push(messageData.message);
      this.refresh();
    }
	}

	setFocus(focus) {
		this.focus = focus;
		this.chatInput.setFocus(focus);
		if (focus) this.chatInput.defaultMessage.setText("Type to chat...");
		else this.chatInput.defaultMessage.setText("");
	}

	submitChat() {
    if (this.chatInput.message !== "") {
      this.scene.client.emitMapChat(this.chatInput.message);
      this.chatInput.updateText("");
    }
	}

	scrollUp() {
    if (this.displayText.y - this.displayText.height + config.FONT.height < this.y + config.CHATBOX.height - 2) {
      this.displayText.y += config.FONT.height;
    }
	}
  
	scrollDown() {
    if (this.displayText.y > this.y + config.CHATBOX.height - 2) {
      this.displayText.y -= config.FONT.height;
    }
	}

  filterMessages() {
    this.filteredMessages = [];
    this.messages.forEach(message => {
      if (this.filters.includes(message.type)) {
        this.filteredMessages.push(message.message);
      }
    });
    this.refresh();
  }

	toggleGameInfo() {
    if (this.filters.includes('gameInfo')) {
      const index = this.filters.indexOf('gameInfo');
      this.filters.splice(index, 1);
    }
    else {
      this.filters.push('gameInfo');
    }
    this.filterMessages();
	}
	
	toggleGlobalMessages() {
    if (this.filters.includes('messageGlobal')) {
      const index = this.filters.indexOf('messageGlobal');
      this.filters.splice(index, 1);
    }
    else {
      this.filters.push('messageGlobal');
    }
    this.filterMessages();
	}
	
	toggleMapMessages() {
    if (this.filters.includes('messageMap')) {
      const index = this.filters.indexOf('messageMap');
      this.filters.splice(index, 1);
    }
    else {
      this.filters.push('messageMap');
    }
    this.filterMessages();
	}
	
	togglePlayerMessages() {
    if (this.filters.includes('messagePlayer')) {
      const index = this.filters.indexOf('messagePlayer');
      this.filters.splice(index, 1);
    }
    else {
      this.filters.push('messagePlayer');
    }
    this.filterMessages();
	}
}
