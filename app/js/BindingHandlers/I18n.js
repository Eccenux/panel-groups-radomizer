class I18n {
	update(el, valueAccessor) {
		let value = valueAccessor();
		// Next, whether or not the supplied model property is observable, get its current value
		let key = ko.unwrap(value);
		el.textContent = app.i18n.getI18n(key);
	}
}

export default I18n;