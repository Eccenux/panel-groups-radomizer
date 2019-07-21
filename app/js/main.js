/**
 * Main entry point.
 */
import {SimpleI18n} from './SimpleI18n.js';
import {GroupRandomizer} from './GroupRandomizer.js';
import {AppViewModel} from './AppViewModel.js';

// for exposing API/objects
window.app = {};

// setup i18n
let i18n = new SimpleI18n();
app.i18n = i18n;
document.addEventListener("DOMContentLoaded", function() {
	console.log('i18n.setupHtml');
	i18n.setupHtml();
});

// setup GR
app.GroupRandomizer = GroupRandomizer;

// view model(s)
app.viewModel = new AppViewModel();
ko.applyBindings(app.viewModel);