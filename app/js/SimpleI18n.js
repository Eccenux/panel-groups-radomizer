import messagesPl from '../_locales/pl/messages.js';
import messagesEn from '../_locales/en/messages.js';

let messages = {
	'pl' : messagesPl,
	'en' : messagesEn,
};

/**
 * Simple I18n functions.
 * 
 * Note! Run `setupHtml` when HTML is ready.
 * 
 * Language selection:
 * 1. From URL hash e.g.: `#lang=en`.
 * 2. From browser language (`window.navigator.language`).
 * 
 * To get missing i18n use one of:
 * ```
 * copy(app.i18n.dumpMissing())
 * copy(app.i18n.dumpMissing('pl'))
 * copy(app.i18n.dumpMissing('en'))
 * ```
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
		 * Messages to be used (in user language).
		 */
		this.messages = {};

		/**
		 * Missing messages.
		 */
		this.missing = {};

		// pre-init lang and messages
		this.initLanguage();
		if (this.lang in messages) {
			this.messages = messages[this.lang];
		}
		// pre-init missing
		for (let index = 0; index < this.supported.length; index++) {
			const key = this.supported[index];
			this.missing[key] = {};
		}
	}

	/**
	 * Get language from URL (hash).
	 * 
	 * @returns 'code' or false if lang parameter was not found in hash.
	 */
	getUrlLanguage() {
		if (location.hash.indexOf('lang=')) {
			let language = '';
			location.hash.replace(/lang=([a-z]+)/, (a, lang) => {
				language = lang;
			});
			return language.length ? language : false;
		}
		return false;
	}
	/**
	 * Get browser's language.
	 * 
	 * Typically this is from a browser's language directly or from son lang-changing add-on.
	 * 
	 * @returns 'code' (addtions after '-' and '_' are removed; so 'en-US' => 'en').
	 */
	getBrowserLanguage() {
		let language = window.navigator.userLanguage || window.navigator.language;
		language = language.replace(/[^a-z].+$/, '');
		return language;
	}

	/**
	 * Init language from browser language.
	 */
	initLanguage() {
		let language = this.getUrlLanguage();
		if (typeof language !== 'string') {
			language = this.getBrowserLanguage();
		}
		if (this.supported.indexOf(language) >= 0) {
			this.lang = language;
		} else {
			console.warn(`Unsportted language: ${language}`);
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
			this.reportMessage(messageName, message);
		}

		return message;
	}

	/**
	 * 
	 * @param {String} messageName Name (key).
	 * @param {String} message Default message or current translation.
	 */
	reportMessage(messageName, message) {
		let obj = {
			'message' : message
		};
		for (let index = 0; index < this.supported.length; index++) {
			const lang = this.supported[index];
			if (!(messageName in messages[lang])) {
				console.warn(`missing ${lang}: `, messageName)
				this.missing[lang][messageName] = obj;
			}
		}
	}

	/**
	 * Dump missing trans.
	 * @param {String?} lang 
	 */
	dumpMissing(lang) {
		if (typeof lang !== 'string') {
			lang = 'pl';
		}
		return JSON.stringify(app.i18n.missing[lang], null, '\t');
	}
}

export { SimpleI18n };