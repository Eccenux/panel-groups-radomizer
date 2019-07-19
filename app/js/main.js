/**
 * Main entry point.
 */
import {SimpleI18n} from './SimpleI18n.js';

let i18n = new SimpleI18n();

document.addEventListener("DOMContentLoaded", function() {
	console.log('i18n.setupHtml');
	i18n.setupHtml();
});
