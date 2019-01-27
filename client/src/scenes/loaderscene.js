import { Scene } from '../lib/phaser.js';
import config from '../config.js';

export default class LoaderScene extends Scene {
	constructor() {
		super({key: 'loaderScene'});
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
		// Create Anims
		for (let sprite = 0; sprite < config.SPRITE_COUNT; sprite++) {
			const frame = sprite * config.SPRITE_FRAMES;

			this.anims.create({
				key: sprite + 'walkleft',
				frames: this.anims.generateFrameNumbers('sprites', { frames: [frame + 6, frame + 7, frame + 6] }),
				frameRate: 5
			});
			this.anims.create({
				key: sprite + 'walkright',
				frames: this.anims.generateFrameNumbers('sprites', { frames: [frame + 9, frame + 10, frame + 9] }),
				frameRate: 5
			});
			this.anims.create({
				key: sprite + 'walkup',
				frames: this.anims.generateFrameNumbers('sprites', { frames: [frame + 3, frame + 4, frame + 3] }),
				frameRate: 5
			});
			this.anims.create({
				key: sprite + 'walkdown',
				frames: this.anims.generateFrameNumbers('sprites', { frames: [frame + 0, frame + 1, frame + 0] }),
				frameRate: 5
			});
		}
		
		this.scene.start('clientScene');
	}
}
