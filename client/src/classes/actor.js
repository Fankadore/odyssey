"use strict";

import config from '../config.js';
import Entity from './entity.js';

export default class Actor extends Entity {
	constructor(scene, data) {
		super(scene, data.id, data.name, data.x, data.y, data.sprite, 'sprites');
		this.setOrigin(0, 0.5);
		this.anims.setCurrentFrame(this.anims.animationManager.anims.entries[data.sprite + 'walk_' + data.direction].frames[0]);
		
		this.direction = data.direction;
		this.grid.destinationX = data.destinationX;
		this.grid.destinationY = data.destinationY;
		this.grid.lerp = data.lerp;
		this.z = data.z;

		this.isRunning = data.isRunning;
		this.isAttacking = data.isAttacking;
		this.isDead = data.isDead;
	}

	setDead(isDead) {
		this.isDead = isDead;

		if (isDead) {
			this.setOrigin(0, 0);
		}
		else {
			this.setOrigin(0, 0.5);
		}
	}
	
	update(data) {
		if (!data) return;

		if (data.name !== undefined) this.name = data.name;
		if (data.sprite !== undefined) this.sprite = data.sprite;
		if (data.direction !== undefined) this.direction = data.direction;

		if (data.x !== undefined) this.grid.x = data.x;
		if (data.y !== undefined) this.grid.y = data.y;
		if (data.z !== undefined && this.depth !== data.z) this.setDepth(data.z);
		if (data.destinationX !== undefined) this.grid.destinationX = data.destinationX;
		if (data.destinationY !== undefined) this.grid.destinationY = data.destinationY;
		if (data.lerp !== undefined) this.grid.lerp = data.lerp;

		if (data.isRunning !== undefined) this.isRunning = data.isRunning;
		if (data.isAttacking !== undefined) this.isAttacking = data.isAttacking;
		if (data.isDead !== undefined && this.isDead !== data.isDead) this.setDead(data.isDead);

		// Death Status
		if (this.isDead) {
			this.anims.setCurrentFrame(this.anims.animationManager.anims.entries[this.sprite + 'dead'].frames[0]);
			return;
		}

		// Update position
		/* this.grid.lerp is a float between 0 and 1, showing the distance between tiles.
		** 0 = on starting tile, 1 = on destination tile, 0.5 = half way, etc. */

		let x = this.grid.x * config.TILESIZE;
		let y = this.grid.y * config.TILESIZE;
		let lerp = this.grid.lerp * config.TILESIZE;

		if (this.grid.x > this.grid.destinationX) {	// Moving Left
			this.x = x - lerp;
			this.y = y;
		}
		else if (this.grid.x < this.grid.destinationX) {	// Moving Right
			this.x = x + lerp;
			this.y = y;
		}
		else if (this.grid.y > this.grid.destinationY) {	// Moving Up
			this.x = x;
			this.y = y - lerp;
		}
		else if (this.grid.y < this.grid.destinationY) {	// Moving Down
			this.x = x;
			this.y = y + lerp;
		}
		else {	// Standing Still
			this.x = x;
			this.y = y;
		}
		
		// Animations
		if (this.isRunning) {
			this.anims.setTimeScale(1.89);
		}
		else {
			this.anims.setTimeScale(1);
		}
		
		if (this.isAttacking) {	// Attacking animations
			this.anims.setCurrentFrame(this.anims.animationManager.anims.entries[this.sprite + 'attack_' + this.direction].frames[0]);
		}
		else {	// Walking animations
			let animKey = this.sprite + 'walk_' + this.direction;
			
			if (this.grid.x === this.grid.destinationX && this.grid.y === this.grid.destinationY) {
				this.anims.setCurrentFrame(this.anims.animationManager.anims.entries[animKey].frames[0]);
			}
			else {
				if (!this.anims.isPlaying || this.anims.currentAnim.key !== animKey) {
					this.play(animKey);
				}
			}
		}
	}
}
