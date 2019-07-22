import {SettingsModel} from './SettingsModel.js';
import {ResultsModel} from './ResultsModel.js';
import {GroupRandomizer} from './GroupRandomizer.js';

class AppViewModel {
	constructor() {
		this.cards = ko.observableArray([1,2]);
		this.settings = new SettingsModel();
		this.results = new ResultsModel();
		this.stagesCount = 6;
	}

	generateClick() {
		let settings = this.settings.readForm();
		this.settings.update(settings);
		let gr = new GroupRandomizer(
			settings.totalCount, settings.groupMax, settings.stagesCount
		);
		app.gr = gr;	// keep ref in the app
		gr.run();
		this.results.update(settings, gr);
	}
}

export {AppViewModel}