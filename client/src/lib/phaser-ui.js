import Phaser from './phaser.js';

class Panel {
  constructor(scene, x, y, active) {
    this.scene = scene;
    this.x = x;
    this.y = y;
		this.children = [];
		this.active = active;
    this.setActive(active);
  }

  setActive(value) {
		this.active = value;
		this.children.forEach(child => child.setActive(value).setVisible(value));
		return this;
	}

	setPosition(x, y, z, w) {
		const xChange = x - this.x;
		const yChange = y - this.y;
		const zChange = z - this.z;
		const wChange = w - this.w;
		this.children.forEach(child => child.setPosition(child.x + xChange, child.y + yChange, child.z + zChange, child.w + wChange));
		return this;
	}
}

class Button extends Phaser.GameObjects.Container {
	constructor(scene, x, y, texture, activeTexture, message = "", style, callback) {
		super(scene, x, y);
		this.normalTexture = texture;
		this.activeTexture = activeTexture;
		this.callback = callback;
		
		// Button Image
		this.image = scene.add.image(0, 0, texture);
		this.setInteractive(new Phaser.Geom.Rectangle(0 - (this.image.width / 2), 0 - (this.image.height / 2), this.image.width, this.image.height), Phaser.Geom.Rectangle.Contains);
		
		// Button Label
		if (!style) style = { fontFamily: 'Arial', fontSize: this.image.height + 'px', fill: '#000000' };
		this.label = scene.add.text(0, 0, message, style).setOrigin(0.5).setDepth(this.image.depth + 1);

    this.on('pointerup', () => {
      if (this.callback) this.callback(this);
    });
    this.on('pointerover', pointer => this.image.setTexture(this.activeTexture));
		this.on('pointerout', pointer => this.image.setTexture(this.normalTexture));
		
		this.add([this.image, this.label]);
		scene.add.existing(this);
	}
}

class TextInput extends Phaser.GameObjects.Container {
	constructor(scene, x, y, texture, focusTexture, password = false, defaultMessage = "", style, callback) {
		super(scene, x, y);
		this.normalTexture = texture;
		this.focusTexture = focusTexture;
		this.password = password;
		this.message = "";
		this.callback = callback;
		
		// Background Image
		this.image = scene.add.image(0, 0, texture);

		const rect = new Phaser.Geom.Rectangle(0 - (this.image.width / 2), 0 - (this.image.height / 2), this.image.width, this.image.height);
		this.setInteractive(rect, Phaser.Geom.Rectangle.Contains);

		// Text Mask
		this.graphics = scene.make.graphics();
		this.setMask(this.graphics.createGeometryMask());
		this.graphics.fillRect(this.x - (this.image.width / 2), this.y - (this.image.height / 2), this.image.width, this.image.height);
		
		// Display Text
		if (!style) style = { fontFamily: 'Arial', fontSize: (this.image.height / 2) + "px", fill: '#000000' };
		this.defaultMessage = scene.add.text(4 - (this.image.width / 2), 0, defaultMessage, style).setOrigin(0, 0.5).setDepth(this.image.depth + 1);
		this.inputText = scene.add.text(4 - (this.image.width / 2), 0, "", style).setOrigin(0, 0.5).setDepth(this.image.depth + 1);
		
		// Mouse Inputs
		this.on('pointerup', () => {
			if (this.callback) this.callback(this);
		});
		
		this.add([this.image, this.defaultMessage, this.inputText, this.graphics]);
		scene.add.existing(this);
	}
	
	setPosition(x, y, z, w) {
		super.setPosition(x, y, z, w);
		if (this.graphics) {
			this.graphics.clear();
			this.graphics.fillRect(this.x - (this.image.width / 2), this.y - (this.image.height / 2), this.image.width, this.image.height);
		}
	}

	setFocus(focus) {
		if (focus) this.image.setTexture(this.focusTexture);
		else this.image.setTexture(this.normalTexture);
	}

	addChar(char) {
		this.updateText(this.message + char);
		this.defaultMessage.setVisible(false);
	}

	removeChar() {
		this.updateText(this.message.slice(0, -1));
		if (this.message === "") this.defaultMessage.setVisible(true);
	}

	updateText(text) {
		this.message = text;
		if (this.password) text = text.replace(/./g, '*');
		this.inputText.setText(text);

		if (this.inputText.width > this.image.width - 8) {
			this.inputText.setOrigin(1, 0.5);
			this.inputText.x = (this.image.width / 2) - 4;
		}
		else {
			this.inputText.setOrigin(0, 0.5);
			this.inputText.x = 4 - (this.image.width / 2);
		}
	}
}

class Toggle extends Phaser.GameObjects.Container {
	constructor(scene, x, y, texture, activeTexture, message = "", style, callback) {
		super(scene, x, y);
		this.normalTexture = texture;
		this.activeTexture = activeTexture;
		this.callback = callback;

		// Toggle Image
		this.image = scene.add.image(0, 0, texture);
		this.setInteractive(new Phaser.Geom.Rectangle(-(this.image.width / 2), -(this.image.height / 2), this.image.width, this.image.height), Phaser.Geom.Rectangle.Contains);

		// Toggle Label
		if (!style) style = { fontFamily: 'Arial', fontSize: this.height + 'px', fill: '#000000' };
		this.label = scene.add.text(0, 0, message, style).setOrigin(0.5).setDepth(this.image.depth + 1);
		
		// Mouse Inputs
		this.on('pointerup', () => {
			if (this.callback) this.callback(this);
		});

		this.add([this.image, this.label]);
		scene.add.existing(this);
	}

	onDown() {
		this.image.setTexture(this.activeTexture);
	}
	onUp() {
		this.image.setTexture(this.normalTexture);
	}
}

export {Panel, Button, TextInput, Toggle};
