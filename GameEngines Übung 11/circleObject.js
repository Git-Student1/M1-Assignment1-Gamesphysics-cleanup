/*eslint no-unused-vars: ["error", { "argsIgnorePattern": "CircleObject" }]*/
import { kXi, kYi } from "./Game_Uebung_11";

export default class CircleObject {
	constructor(centerX, centerY, diameter, color, mass) {
		if (this.constructor == CircleObject) {
			throw new Error(
				"Class is of abstract type and can't be instantiated"
			);
		}
		this.centerX = centerX;
		this.centerY = centerY;
		this.diameter = diameter;
		this.centerXStart = centerX;
		this.centerYStart = centerY;
		this.color = color;
		this.mass = mass;
	}
	/**
	 *
	 * @param {*} rotationValue
	 * @param {*} fulcrumX - x value of rotation center
	 * @param {*} fulcrumY - y value of rotation center
	 * @returns
	 */
	rotateAroundCenter(rotationValue, fulcrumX, fulcrumY) {
		//tranlate to origin
		let x1 = this.centerXStart - fulcrumX;
		let y1 = this.centerYStart - fulcrumY;

		//rotate
		let x2 = x1 * Math.cos(rotationValue) + y1 * Math.sin(rotationValue);
		let y2 = -x1 * Math.sin(rotationValue) + y1 * Math.cos(rotationValue);

		//tranlate back to the previous position

		this.centerX = x2 + fulcrumX;
		this.centerY = y2 + fulcrumY;

		return { x: this.centerX, y: this.centerY };
	}

	/**
	 * draws a circle object
	 * @param {*} M
	 */
	draw(M) {
		if (this.color) fill(this.color);
		ellipse(
			kXi(this.centerX * M),
			kYi(this.centerY * M),
			this.diameter * M,
			this.diameter * M
		);
	}
}

window.CircleObject = CircleObject;
