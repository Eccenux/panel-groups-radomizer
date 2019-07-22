import {SettingsModel} from './SettingsModel.js';
import {GroupRandomizer} from './GroupRandomizer.js';

/**
 * Group generation results.
 */
class ResultsModel extends SettingsModel {
	constructor() {
		super();

		/**
		 * Group numbers for each person.
		 * 
		 * person index -> group numbers per stage
		 * 
		 * e.g:
		 * 0: 3,5,6,7,6,1,5,2,8,5
		 * 1: 4,1,5,6,6,8,4,1,6,8
		 * ...
		 */
		this.groupNumbers = ko.observableArray();

		// stats
		this.groupSizes = ko.observableArray();
		this.minGroupSize = ko.observable(0);
		this.maxGroupSize = ko.observable(0);
		this.groupCount = ko.observable(0);
	}

	/**
	 * Update properties.
	 * @param {Object} settings 
	 * @param {GroupRandomizer} gr
	 */
	update(settings, gr) {
		super.update(settings);

		// copy mapping
		this.groupNumbers(JSON.parse(JSON.stringify(gr.results.memberGroups)));

		// calculate sizes
		let groupSizes = gr.groups.map(group=>group.members.length);
		this.groupSizes(groupSizes);
		if (groupSizes.length) {
			this.minGroupSize(groupSizes.reduce((min, current) => Math.min(min, current)));
			this.maxGroupSize(groupSizes.reduce((max, current) => Math.max(max, current)));
		} else {
			this.minGroupSize(0);
			this.maxGroupSize(0);
		}
		this.groupCount(gr.groupCount);		

		//console.log('groupSizes: ', groupSizes.join(','));
		//gr.results.dump();
	}
}

export {ResultsModel}