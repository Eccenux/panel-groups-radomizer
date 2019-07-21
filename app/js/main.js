/**
 * Main entry point.
 */
import {SimpleI18n} from './SimpleI18n.js';
import {GroupRandomizer} from './GroupRandomizer.js';
import {AppViewModel} from './AppViewModel.js';
import BindingHandlersI18n from './BindingHandlers/I18n.js';

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

//
// Knockout
//

// binding handlers
ko.bindingHandlers.i18n = new BindingHandlersI18n();

// view model(s)
app.viewModel = new AppViewModel();
ko.applyBindings(app.viewModel);