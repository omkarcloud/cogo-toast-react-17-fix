import React from 'react';
import ReactDOM from 'react-dom/client';

import ToastContainer from './components/ToastContainer';
import Toast from './components/Toast';

import { CToast, CTReturn } from '../index.d';

import './styles/styles.css';

// --- Start of Changes ---

// 1. Create a simple event emitter (Pub/Sub)
const events = {
	listeners: {},
	on(event, callback) {
		if (!this.listeners[event]) this.listeners[event] = [];
		this.listeners[event].push(callback);
	},
	off(event, callback) {
		if (this.listeners[event]) {
			this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
		}
	},
	emit(event, data) {
		if (this.listeners[event]) {
			this.listeners[event].forEach((callback) => callback(data));
		}
	},
};

let ctToastCount = 0;
let root;

const cogoToast: CToast = (text, options?) => {
	// 2. The setup logic now only runs ONCE to render the container
	if (!root) {
		let rootContainer = document.getElementById('ct-container');
		if (!rootContainer) {
			rootContainer = document.createElement('div');
			rootContainer.id = 'ct-container';
			document.body.appendChild(rootContainer);
		}
		root = ReactDOM.createRoot(rootContainer);
		// The container is rendered once, without any props. It will listen for events.
		root.render(<ToastContainer events={events} />);
	}

	ctToastCount += 1;
	const toast = { id: ctToastCount, text, ...options };

	// 3. Instead of rendering, we EMIT an 'add' event with the toast data
	events.emit('add', toast);

	const hide = () => {
		// 4. The hide function now EMITS a 'hide' event with the ID
		events.emit('hide', toast.id);
	};

	const hideTime = (options?.hideAfter === undefined ? 3 : options.hideAfter) * 1000;
	const completePromise: CTReturn = new Promise<void>((resolve) => {
		// This part can remain for promise resolution, but the actual hiding is event-driven
		if (hideTime > 0) {
			setTimeout(() => {
				hide(); // We can also automatically trigger the hide event
				resolve();
			}, hideTime);
		}
	});

	completePromise.hide = hide;

	return completePromise;
};

// --- End of Changes ---

cogoToast.success = (t, o) => cogoToast(t, { ...o, type: 'success' });
cogoToast.warn = (t, o) => cogoToast(t, { ...o, type: 'warn' });
cogoToast.info = (t, o) => cogoToast(t, { ...o, type: 'info' });
cogoToast.error = (t, o) => cogoToast(t, { ...o, type: 'error' });
cogoToast.loading = (t, o) => cogoToast(t, { ...o, type: 'loading' });

export { Toast };

export default cogoToast;