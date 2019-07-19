import messagesPl from '../_locales/pl/messages.js';
import messagesEn from '../_locales/en/messages.js';

let messages = {
	'pl' : messagesPl,
	'en' : messagesEn,
};

/*
if (typeof window._i18nMessages !== 'object') {
	window._i18nMessages = {
		missing: {
			pl: {},
			en: {},
		}
	};
}
*/

/**
 * Simple I18n functions.
 * 
 * Note! Run `setupHtml` when HTML is ready.
 */
class SimpleI18n {
	constructor() {
		/**
		 * User language.
		 * 
		 * Simplified (e.g. `en-US` -> `en`)
		 */
		this.lang = 'pl';
		/**
		 * Supported languages.
		 * 
		 * Note! Keep it in sync. with actually supported languages.
		 */
		this.supported = Object.keys(messages);
		/**
		 * Enables reporting missing i18n.
		 * 
		 * Adds a bit of performanace penalty.
		 */
		this.reportMissing = true;

		/**
		 * Actually used messages.
		 */
		this.messages = {};

		// pre-init
		this.initLanguage();
		if (this.lang in messages) {
			this.messages = messages[this.lang];
		}
	}

	/**
	 * Init language from browser language.
	 */
	initLanguage() {
		let browserLanguage = window.navigator.userLanguage || window.navigator.language;
		browserLanguage = browserLanguage.replace(/[-_]\w+$/, '');
		if (this.supported.indexOf(browserLanguage) >= 0) {
			this.lang = browserLanguage;
		} else {
			console.warn(`Unsportted language: ${browserLanguage}`);
		}
	}

	/**
	 * Setup i18n in HTML.
	 * 
	 * Must be run when HTML is ready.
	 */
	setupHtml() {
		let me = this;

		// remove all elements marked with language attribute that is different then current
		document.querySelectorAll('[data-lang]').forEach(function(el){
			if (lang != el.getAttribute('data-lang')) {
				el.parentNode.removeChild(el);
			}
		})

		// other HTML content not setup in controllers
		document.querySelectorAll('*[data-i18n-key]').forEach(function(el)
		{
			var key = el.getAttribute('data-i18n-key');
			el.textContent = me.getI18n(key);
		});

		// atributes (note - for input button data-i18n-key is automatically put in it's value)
		document.querySelectorAll('*[data-i18n-key-attribute]').forEach(function(el)
		{
			var mapping = el.getAttribute('data-i18n-key-attribute').split(':');
			var key = mapping[0];
			var attribute = mapping[1];

			var content = me.getI18n(key);
			el.setAttribute(attribute, content);
		});
	}
	
	/**
	 * Get I18n string.
	 */
	getI18n(messageName) {
		let message = null;
		if ((messageName in this.messages)) {
			message = this.messages[messageName].message;
		}

		// display key if missing
		if (message === null) {
			message = messageName
				// underscore to space
				.replace(/_/g, ' ')
				// just the final part
				.replace(/^.+\./, '')
			;
		}

		// report missing
		if (this.reportMissing) {
			console.warn('TODO reportMissing');
		}

		return message;
	}

	// //console.log('i18nhelper', messagesPl, messagesEn, wikiTemplateEngine);
	// reportMessage(messageName, message) {
	// 	let obj = {
	// 		'message' : message
	// 	};
	// 	if (!(messageName in messagesPl)) {
	// 		console.log('pl: ', messageName)
	// 		_i18nMessages.missing.pl[messageName] = obj;
	// 	}
	// 	if (!(messageName in messagesEn)) {
	// 		console.log('en: ', messageName)
	// 		_i18nMessages.missing.en[messageName] = obj;
	// 	}
	// }	
}

export { SimpleI18n };