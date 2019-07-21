import {SettingsModel} from './SettingsModel.js';
import {GroupRandomizer} from './GroupRandomizer.js';

class AppViewModel {
	constructor() {
		this.cards = ko.observableArray([1,2]);
		this.settings = new SettingsModel();
		this.stagesCount = 6;
	}

	generateClick() {
		this.settings.update();
		let gr = new GroupRandomizer(
			this.settings.totalCount(), this.settings.groupMax(), this.settings.stagesCount()
		);
		gr.run();
	}
}

export {AppViewModel}