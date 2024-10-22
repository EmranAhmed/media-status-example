/**
 * WordPress dependencies
 */

import {
	createPluginInstance,
	getPluginInstance,
	triggerEvent,
} from '@storepress/utils';

/**
 * Internal dependencies
 */
import { Plugin } from './Plugin';
import './style.scss';

function ToggleInit() {
	const Toggle = {
		getInstance(element, options) {
			return createPluginInstance(element, options, Plugin);
		},

		getPluginInstance(element) {
			return getPluginInstance(element);
		},

		reInitWith(el, options) {
			this.destroyWith(el);
			this.initWith(el, options);
		},

		initWith(el, options) {
			const instance = this.getInstance(el, options);

			for (const { element, reset } of instance) {
				element.addEventListener('destroy', reset);
			}

			return instance;
		},

		destroyWith(el) {
			for (const { destroy } of this.getInstance(el)) {
				destroy();
			}
		},
	};

	// Toggle ReInit.
	document.addEventListener('toggle_re_init', (event) => {
		const defaultSettings = {};
		const settings = { ...defaultSettings, ...event.detail?.settings };
		const element = event.detail?.element;

		if (Array.isArray(element)) {
			for (const el of element) {
				Toggle.reInitWith(el, settings);
			}
		} else {
			Toggle.reInitWith(element, settings);
		}
	});

	// Toggle Init.
	document.addEventListener('toggle_init', (event) => {
		const defaultSettings = {};
		const settings = { ...defaultSettings, ...event.detail?.settings };
		const element = event.detail?.element;

		if (Array.isArray(element)) {
			for (const el of element) {
				Toggle.initWith(el, settings);
			}
		} else {
			Toggle.initWith(element, settings);
		}
	});

	// Destroy
	document.addEventListener('toggle_destroy', (event) => {
		const element = event.detail?.element;

		if (Array.isArray(element)) {
			for (const el of element) {
				Toggle.destroyWith(el);
			}
		} else {
			Toggle.destroyWith(element);
		}
	});

	/*
	triggerEvent( document, 'toggle_init', {
		element: [ '.button-one', '.button-two' ],
		settings: {},
	} );
	*/
}

document.addEventListener('DOMContentLoaded', () => {
	// Init
	ToggleInit();
	// Dispatch / trigger Events:

	triggerEvent(document, 'toggle_init', {
		element: 'button',
		settings: {},
	});

	/*	triggerEvent( document, 'slider_init', {
		element: '.base',
		settings: {},
	} );*/
});

export default ToggleInit;
