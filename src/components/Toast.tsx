import React, { useState, useEffect } from 'react';
import { string, number, bool, func, shape, node, oneOfType } from 'prop-types';

import Icons from './Icons';
import { CTOptions } from '../../index.d';

const colors = {
	success: '#6EC05F',
	info: '#1271EC',
	warn: '#FED953',
	error: '#D60A2E',
	loading: '#0088ff',
};

type CToastProps = CTOptions & {
	id: number;
	type: string;
	text: string;
	show: boolean;
	onHide: Function;
	onClick: Function;
	hideAfter: number;
};

const Toast: React.FC<CToastProps> = (props) => {
	const place = (props.position || 'top-center').includes('bottom') ? 'Bottom' : 'Top';
	const marginType = `margin${place}`;

	const className = [
		'ct-toast',
		props.onClick ? ' ct-cursor-pointer' : '',
		`ct-toast-${props.type}`,
	].join(' ');
	const borderLeft = `${props.bar?.size || '3px'} ${props.bar?.style || 'solid'} ${props.bar
		?.color || colors[props.type]}`;

	const CurrentIcon = Icons[props.type];

	const [animStyles, setAnimStyles]: [any, Function] = useState({ opacity: 0, [marginType]: -15 });

	const style = {
		paddingLeft: props.heading ? 25 : undefined,
		minHeight: props.heading ? 50 : undefined,
		borderLeft,
		...animStyles,
	};

	const handleHide = () => {
		setAnimStyles({ opacity: 0, [marginType]: '-15px' });

		setTimeout(() => {
			props.onHide(props.id, props.position);
		}, 300);
	};

	useEffect(() => {
		const animTimeout = setTimeout(() => {
			setAnimStyles({ opacity: 1, [marginType]: '15px' });
		}, 50);

		let hideTimeout;

		if (props.hideAfter !== 0) {
			hideTimeout = setTimeout(() => {
				handleHide();
			}, props.hideAfter * 1000);
		}

		return () => {
			clearTimeout(animTimeout);

			if (hideTimeout) {
				clearTimeout(hideTimeout);
			}
		};
	}, []);

	useEffect(() => {
		if (!props.show) {
			handleHide();
		}
	}, [props.show]);

	const clickProps = {
		tabIndex: 0,
		onClick: props.onClick,
		onKeyPress: (e: any) => {
			if (e.keyCode === 13) {
				props.onClick(e);
			}
		},
	};

	return (
		<div
			className={className}
			role={props.role ? props.role : 'status'}
			style={style}
			{...(props.onClick ? clickProps : {})}
		>
			{props.renderIcon ? props.renderIcon() : <CurrentIcon />}
			<div className={props.heading ? 'ct-text-group-heading' : 'ct-text-group'}>
				{props.heading && <h4 className="ct-heading">{props.heading}</h4>}
				<div className="ct-text">{props.text}</div>
			</div>
		</div>
	);
};

Toast.propTypes = {
	type: string.isRequired,
	text: oneOfType([string, node]).isRequired,
	show: bool,
	onHide: func,
	id: oneOfType([string, number]),
	hideAfter: number,
	heading: string,
	position: string,
	renderIcon: func,
	bar: shape({}),
	onClick: func,
	role: string,
};

Toast.defaultProps = {
	id: undefined,
	show: true,
	onHide: undefined,
	hideAfter: 3,
	heading: undefined,
	position: 'top-center',
	renderIcon: undefined,
	bar: {},
	onClick: undefined,
	role: 'status',
};

export default Toast;
