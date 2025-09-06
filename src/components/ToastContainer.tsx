import React, { useState, useEffect } from 'react';
import { shape } from 'prop-types';

import Toast from './Toast';

const camelCase = (str: string) => str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

const defaultToasts = {
	topLeft: [],
	topCenter: [],
	topRight: [],
	bottomLeft: [],
	bottomCenter: [],
	bottomRight: [],
};

type CToastItem = {
	id: number;
	text: string;
	type: string;
	show: boolean; // Add a `show` property to control visibility
	position?: string;
	hideAfter: number;
	onClick: any;
	onHide: any;
};

// --- Start of Changes ---

// 1. Update props to accept the event emitter
type CToastContainerProps = {
	events: {
		on: (event: string, callback: (data: any) => void) => void;
		off: (event: string, callback: (data: any) => void) => void;
	};
};

const ToastContainer: React.FC<CToastContainerProps> = ({ events }) => {
	const [allToasts, setToasts] = useState(defaultToasts);

	// 2. Use useEffect to subscribe and unsubscribe from events
	useEffect(() => {
		const addToast = (toast) => {
			setToasts((prevToasts) => {
				const position = camelCase(toast.position || 'top-center');
				// Add `show: true` to the new toast object
				return { ...prevToasts, [position]: [...prevToasts[position], { ...toast, show: true }] };
			});
		};

		const hideToast = (id: number) => {
			setToasts((prevToasts) => {
				const newToasts = { ...prevToasts };
				// Find the toast with the matching ID and set its `show` property to false
				for (const position in newToasts) {
					newToasts[position] = newToasts[position].map((toast: CToastItem) => {
						if (toast.id === id) {
							return { ...toast, show: false };
						}
						return toast;
					});
				}
				return newToasts;
			});
		};

		// Subscribe
		events.on('add', addToast);
		events.on('hide', hideToast);

		// Unsubscribe on component unmount
		return () => {
			events.off('add', addToast);
			events.off('hide', hideToast);
		};
	}, [events]); // Dependency array includes events

	// 3. handleRemove is now simpler, it just removes the toast from state
	const handleRemove = (id: number, position: string) => {
		setToasts((prevToasts) => {
			const toastPosition = camelCase(position || 'top-center');
			return {
				...prevToasts,
				[toastPosition]: prevToasts[toastPosition].filter((item: CToastItem) => item.id !== id),
			};
		});
	};
	
	// --- End of Changes ---

	const rows = ['top', 'bottom'];
	const groups = ['Left', 'Center', 'Right'];

	return (
		<>
			{rows.map((row) => (
				<div key={`row_${row}`} className="ct-row">
					{groups.map((group) => {
						const type = `${row}${group}`;
						const className = ['ct-group', row === 'bottom' ? 'ct-flex-bottom' : ''].join(' ');
						return (
							<div key={type} className={className}>
								{allToasts[type].map((item: CToastItem) => (
									// @ts-ignore
									<Toast
										key={`${type}_${item.id}`}
										{...item}
										id={item.id}
										text={item.text}
										type={item.type}
										onClick={item.onClick}
										hideAfter={item.hideAfter}
										// 4. `show` now comes from the toast's state, not a separate prop
										show={item.show}
										// onHide will call handleRemove to delete it from state after the animation
										onHide={handleRemove}
									/>
								))}
							</div>
						);
					})}
				</div>
			))}
		</>
	);
};


export default ToastContainer;