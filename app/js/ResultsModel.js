import {SettingsModel} from './SettingsModel.js';
import {GroupRandomizer} from './GroupRandomizer.js';

/**
 * Group generation results.
 */
class ResultsModel extends SettingsModel {
	constructor() {
		super();

		/**
		 * Group numbers for each person (divided to pages).
		 * 
		 * person index -> group numbers per stage
		 * 
		 * e.g:
		 * 0: 3,5,6,7,6,1,5,2,8,5
		 * 1: 4,1,5,6,6,8,4,1,6,8
		 * ...
		 */
		this.pages = ko.observableArray();

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

		// create group numbers divded to pages
		let pageSize = 2;
		let groupNumbers = JSON.parse(JSON.stringify(gr.results.memberGroups));
		let pages = new Array(Math.ceil(gr.totalCount / pageSize));
		for (let index = 0, pageIndex = 0; index < groupNumbers.length; index+=pageSize, pageIndex++) {
			pages[pageIndex] = [];
			for (let cardIndex = 0; cardIndex < pageSize && index + cardIndex < groupNumbers.length; cardIndex++) {
				pages[pageIndex].push(groupNumbers[index + cardIndex]);
			}
		}
		//console.log({groupNumbers, pages});
		this.pages(pages);

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