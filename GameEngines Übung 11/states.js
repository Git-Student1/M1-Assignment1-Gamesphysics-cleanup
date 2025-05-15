export default class State {
	constructor() {
		this.ONSEESAW = "onSeesaw";
		this.ONFLIGHT = "onFlight";
		this.ONSLOPE = "onSlope";

		this.state = this.ONSEESAW;
	}

	changeStateTo(newState) {
		if (!this._stateInStates(newState)) {
			throw new Error("state is invalid: " + newState);
		}
		this.ballState = newState;
	}

	/**
	 * returns whether the inserted parameter is one of the valid states
	 * @param {*} newState
	 * @returns
	 */
	_stateInStates(newState) {
		if (Object.values(this.ballStates).includes(newState)) return true;
		return false;
	}
}
