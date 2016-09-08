import React from 'react';

export class StyleCommand {
	do(map) {
		throw new TypeError("Do not implemented");
	}
	undo(map) {
		throw new TypeError("Undo not implemented");
	}
}

export class StyleEditor {
	constructor(map, style) {
		this.map = map;
		this.style = style;
		this.history = [];
	}

	layers() {
		return this.style.layers;
	}

	execute(command) {
		this.history.push(command);
		command.do(this.map);
	}
}
