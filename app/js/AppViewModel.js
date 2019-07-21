class AppViewModel {
	constructor() {
		this.cards = ko.observableArray([1,2]);
		this.stagesCount = 6;
	}
}

export {AppViewModel}