import { Panel } from '../lib/phaser-ui.js';
import InputBox from '../objects/ui/inputbox.js';
import NumberInput from '../objects/ui/numberinput.js';
import SubmitButton from '../objects/ui/submitbutton.js';
import CloseButton from '../objects/ui/closebutton.js';
import config from '../config.js';

export default class AddTemplatePanel extends Panel {
	constructor(scene, x, y) {
		super(scene, x, y, false);

		// Panel
		this.background = scene.add.image(x, y, 'background-large');
		this.closeButton = new CloseButton(scene, this.background.x + (this.background.width / 2) - 16, this.background.y - (this.background.height / 2) + 16, () => scene.switchPanel("addPlayer"));
		this.width = this.background.width;
		this.height = this.background.height;

		// Title
		let style = { fontFamily: 'Arial', fontSize: '36px', fill: '#ffffff' };
		this.title = scene.add.text(x, y - 132, "Add Class", style).setOrigin(0.5);
		
		// Player Template Data
		this.activeBox = null;

		this.nameBox = new InputBox(scene, x, y - 64, "Class Name");
		
		const xLeft = x - 56;
		const xRight = x + 88;

		style = { fontFamily: 'Arial', fontSize: '12px', fill: '#ffffff' };
		this.spriteLabel = scene.add.text(xLeft, y - 32, "Sprite: ", style).setOrigin(1, 0.5);
		this.spriteBox = new NumberInput(scene, xLeft, y - 32, "#").setOrigin(0, 0.5);
				
		this.healthMaxLabel = scene.add.text(xLeft, y, "Max Health: ", style).setOrigin(1, 0.5);
		this.healthMaxBox = new NumberInput(scene, xLeft, y, "#").setOrigin(0, 0.5);
		
		this.energyMaxLabel = scene.add.text(xRight, y, "Max Energy: ", style).setOrigin(1, 0.5);
		this.energyMaxBox = new NumberInput(scene, xRight, y, "#").setOrigin(0, 0.5);
		
		this.damageLabel = scene.add.text(xLeft, y + 32, "Damage: ", style).setOrigin(1, 0.5);
		this.damageBox = new NumberInput(scene, xLeft, y + 32, "#").setOrigin(0, 0.5);
		
		this.defenceLabel = scene.add.text(xRight, y + 32, "Defence: ", style).setOrigin(1, 0.5);
		this.defenceBox = new NumberInput(scene, xRight, y + 32, "#").setOrigin(0, 0.5);
		
		this.rangeLabel = scene.add.text(xLeft, y + 64 , "Range: ", style).setOrigin(1, 0.5);
		this.rangeBox = new NumberInput(scene, xLeft, y + 64, "#").setOrigin(0, 0.5);
		
		this.healthRegenLabel = scene.add.text(xLeft, y + 96, "Health Regen: ", style).setOrigin(1, 0.5);
		this.healthRegenBox = new NumberInput(scene, xLeft, y + 96, "#").setOrigin(0, 0.5);
		
		this.energyRegenLabel = scene.add.text(xRight, y + 96, "Energy Regen: ", style).setOrigin(1, 0.5);
		this.energyRegenBox = new NumberInput(scene, xRight, y + 96, "#").setOrigin(0, 0.5);
		
		this.healthPerLevelLabel = scene.add.text(xLeft, y + 128, "Health / Level: ", style).setOrigin(1, 0.5);
		this.healthPerLevelBox = new NumberInput(scene, xLeft, y + 128, "#").setOrigin(0, 0.5);

		this.energyPerLevelLabel = scene.add.text(xRight, y + 128, "Energy / Level: ", style).setOrigin(1, 0.5);
		this.energyPerLevelBox = new NumberInput(scene, xRight, y + 128, "#").setOrigin(0, 0.5);

		// Submit Button
		this.submitButton = new SubmitButton(scene, x, y + 160, () => this.addPlayerTemplate());

		this.children = [
			this.background, this.closeButton, this.title, this.submitButton, this.nameBox,
			this.spriteBox, this.healthMaxBox, this.energyMaxBox, this.damageBox, this.defenceBox, this.rangeBox,
			this.healthRegenBox, this.energyRegenBox, this.healthPerLevelBox, this.energyPerLevelBox, 
			this.spriteLabel, this.healthMaxLabel, this.energyMaxLabel, this.damageLabel, this.defenceLabel, this.rangeLabel,
			this.healthRegenLabel, this.energyRegenLabel, this.healthPerLevelLabel, this.energyPerLevelLabel
		];

		this.setActiveBox(this.nameBox);
		this.setActive(false);
	}

	setActiveBox(inputBox) {
		if (this.activeBox) this.activeBox.setFocus(false);
		this.activeBox = inputBox;
		this.activeBox.setFocus(true);
	}

	addPlayerTemplate() {
		const data = {
			name: this.nameBox.message,
			sprite: this.spriteBox.message,
			healthMaxBase: this.healthMaxBox.message,
			energyMaxBase: this.energyMaxBox.message,
			damageBase: this.damageBox.message,
			defenceBase: this.defenceBox.message,
			rangeBase: this.rangeBox.message,
			healthRegenBase: this.healthRegenBox.message,
			energyRegenBase: this.energyRegenBox.message,
			healthPerLevel: this.healthPerLevelBox.message,
			energyPerLevel: this.energyPerLevelBox.message
		}
		
		if (data.name.length < 3 || data.name.length > 25) {
			console.log("Name must be between 3 and 25 characters.");
		}
		else if (data.sprite < 1 || data.sprite > config.SPRITE_COUNT) {
			console.log(`Sprite must be between 1 and ${config.SPRITE_COUNT}`);
		}
		else if (data.healthMaxBase < 1 || data.healthMaxBase > config.MAX_HEALTH_BASE) {
			console.log(`Max Health must be between 1 and ${config.MAX_HEALTH_BASE}`);
		}
		else if (data.energyMaxBase < 0 || data.energyMaxBase > config.MAX_ENERGY_BASE) {
			console.log(`Max Energy must be between 0 and ${config.MAX_ENERGY_BASE}`);
		}
		else if (data.damageBase < 0 || data.damageBase > config.MAX_DAMAGE_BASE) {
			console.log(`Damage must be between 0 and ${config.MAX_DAMAGE_BASE}`);
		}
		else if (data.defenceBase < 0 || data.defenceBase > config.MAX_DEFENCE_BASE) {
			console.log(`Defence must be between 0 and ${config.MAX_DEFENCE_BASE}`);
		}
		else if (data.rangeBase < 0 || data.rangeBase > config.MAX_RANGE_BASE) {
			console.log(`Range must be between 0 and ${config.MAX_RANGE_BASE}`);
		}
		else if (data.healthRegenBase < 0 || data.healthRegenBase > config.MAX_HEALTH_REGEN_BASE) {
			console.log(`Health Regen must be between 0 and ${config.MAX_HEALTH_REGEN_BASE}`);
		}
		else if (data.energyRegenBase < 0 || data.energyRegenBase > config.MAX_ENERGY_REGEN_BASE) {
			console.log(`Energy Regen must be between 0 and ${config.MAX_ENERGY_REGEN_BASE}`);
		}
		else if (data.healthPerLevel < 0 || data.healthPerLevel > config.MAX_HEALTH_PER_LEVEL) {
			console.log(`Health Per Level must be between 0 and ${config.MAX_HEALTH_PER_LEVEL}`);
		}
		else if (data.energyPerLevel < 0 || data.energyPerLevel > config.MAX_ENERGY_PER_LEVEL) {
			console.log(`Energy Per Level must be between 0 and ${config.MAX_ENERGY_PER_LEVEL}`);
		}
		else {
			this.scene.client.emitAddPlayerTemplate(data);
		}
	}

	onKeyDown(key) {
		if (this.scene.inputKeys[key.toUpperCase()]) {
			if (key === 'Left') {	// Move cursor left
				// TODO: Move cursor left
			}
			else if (key === 'Right') {	// Move cursor right
				// TODO: Move cursor right
			}
			else if (key === 'Tab') {	//	Switch selected template
				
			}
			else if (key === 'Enter') {	// Add player
				if (this.activeBox === this.nameBox) {
					this.setActiveBox(this.spriteBox);
				}
				else if (this.activeBox === this.spriteBox) {
					this.setActiveBox(this.healthMaxBox);
				}
				else if (this.activeBox === this.healthMaxBox) {
					this.setActiveBox(this.energyMaxBox);
				}
				else if (this.activeBox === this.energyMaxBox) {
					this.setActiveBox(this.damageBox);
				}
				else if (this.activeBox === this.damageBox) {
					this.setActiveBox(this.defenceBox);
				}
				else if (this.activeBox === this.defenceBox) {
					this.setActiveBox(this.rangeBox);
				}
				else if (this.activeBox === this.rangeBox) {
					this.setActiveBox(this.healthRegenBox);
				}
				else if (this.activeBox === this.healthRegenBox) {
					this.setActiveBox(this.energyRegenBox);
				}
				else if (this.activeBox === this.energyRegenBox) {
					this.setActiveBox(this.healthPerLevelBox);
				}
				else if (this.activeBox === this.healthPerLevelBox) {
					this.setActiveBox(this.energyPerLevelBox);
				}
				else if (this.activeBox === this.energyPerLevelBox) {
					this.addPlayerTemplate();
					this.setActiveBox(this.nameBox);
				}
			}
			else if (key === 'Escape') {	// Return to player select
				this.scene.switchPanel("addPlayer");
			}
			else if (key === 'Space') {
				this.activeBox.addChar(' ');
			}
			else if (key === 'Backspace' || key === 'Delete') {
				this.activeBox.removeChar();
			}
		}
		else {
			if (this.scene.inputKeys.SHIFT.isDown) key = key.toUpperCase();
			this.activeBox.addChar(key);
		}
	}
}
