/**
 * Main entry point.
 */
import {SimpleI18n} from './SimpleI18n.js';

// for exposing API/objects
window.app = {};

let i18n = new SimpleI18n();
app.i18n = i18n;

document.addEventListener("DOMContentLoaded", function() {
	console.log('i18n.setupHtml');
	i18n.setupHtml();
});
