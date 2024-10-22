/**
 * External dependencies
 */
import { getOptionsFromAttribute } from '@storepress/utils';

function Plugin(element, options) {
	// Default Settings
	const DEFAULTS = {
		defaultClass: 'default',
		toggledClass: 'toggle',
	};

	// Collecting settings from html attribute
	const ATTRIBUTE = 'toggle'; // data-toggle="{}"

	// Do what you need and return expose fn.
	const init = () => {
		this.$element = element; // wrapper
		this.settings = {
			...DEFAULTS,
			...options,
			...getOptionsFromAttribute(this.$element, ATTRIBUTE),
		};

		addEvents();

		return expose();
	};

	const addEvents = () => {
		this.$element.addEventListener('click', handleToggle);
	};

	const handleToggle = () => {
		if (this.$element.classList.contains(this.settings.defaultClass)) {
			this.$element.classList.replace(
				this.settings.defaultClass,
				this.settings.toggledClass
			);
			return;
		}

		this.$element.classList.replace(
			this.settings.toggledClass,
			this.settings.defaultClass
		);
	};

	const removeEvents = () => {
		this.$element.removeEventListener('click', handleToggle);
	};

	const removeClasses = () => {
		this.$element.classList.remove(
			this.settings.toggledClass,
			this.settings.defaultClass
		);
		this.$element.classList.add(this.settings.defaultClass);
	};

	const reset = () => {
		removeEvents();
		removeClasses();
	};

	// Expose to public.
	const expose = () => ({
		reset,
	});

	return init();
}

export { Plugin };
