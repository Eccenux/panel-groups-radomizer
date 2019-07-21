/**
 * Group generation settings.
 */
class SettingsModel {
	constructor() {
		this.openingInformation = ko.observable('');
		this.totalCount = ko.observable(0);
		this.groupMax = ko.observable(0);
		this.stagesCount = ko.observable(0);

		/**
		 * Mapping properties to HTML names.
		 */
		this.settingsNames = {
			openingInformation : 'opening_information',
			totalCount : 'total_count',
			groupMax : 'group_max',
			stagesCount : 'stages_count',
		};
	}

	/**
	 * Read settings from the form.
	 */
	readForm() {
		let settingsParent = document.getElementById('settings');
		let settings = {};
		for (const property in this.settingsNames) {
			if (this.settingsNames.hasOwnProperty(property)) {
				const htmlName = this.settingsNames[property];
				const element = settingsParent.querySelector(`[name=${htmlName}]`);
				if (element.getAttribute('type') === 'number') {
					settings[property] = parseInt(element.value, 10);
				} else {
					settings[property] = element.value;
				}
			}
		}
		return settings;
	}

	/**
	 * Update properties.
	 * @param {Object} settings 
	 */
	update(settings) {
		if (typeof settings !== 'object') {
			settings = this.readForm();
		}
		for (const property in this.settingsNames) {
			if (this.settingsNames.hasOwnProperty(property)) {
				this[property](settings[property]);
			}
		}
	}
}

export {SettingsModel}