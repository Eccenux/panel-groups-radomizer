/**
 * The messages format is roughly the same as for WebExtensions.
 * 
 * Descriptions are optional (only needed to provide context etc).
 */
export default {
	"appName": {
		"message": "Panel Groups Randomizer",
		"description": "The name of the application",
	},
	"Print": {
		"message": "Print",
	},
	"settings.Settings_form": {
		"message": "Settings",
	},
	"results.Results_summary": {
		"message": "Results summary"
	},
	"settings.opening_information": {
		"message": "Opening information"
	},
	"settings.Default_info": {
		"message": `
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean malesuada tincidunt ligula vitae dictum. Phasellus et tellus tortor. In luctus vel nisi eu scelerisque. Quisque eu congue velit. Aenean elementum elit fermentum bibendum rutrum. Pellentesque rhoncus iaculis lacus ultricies vestibulum. Proin sit amet lacus urna.
		`.replace(/^\s+/, '').replace(/\n\t+/, '\n')
	},
	"settings.total_count": {
		"message": "Total count"
	},
	"settings.group_max": {
		"message": "Group max"
	},
	"settings.stages_count": {
		"message": "Stages count"
	},
	"settings.Generate": {
		"message": "Generate"
	},
}
