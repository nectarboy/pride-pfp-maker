class Mouse {
	drag = false;
	fn = () => undefined;
	constructor(element, fn) {
		this.fn = fn;
		element.addEventListener("mousedown", this.down.bind(this), false);
		document.addEventListener("mouseup", this.up.bind(this), false);
		element.addEventListener("mousemove", this.move.bind(this), false);
	}
	down(e) {
		this.drag = true;
		this.fn(e);
	}
	up() {
		this.drag = false;
	}
	move(e) {
		if (this.drag) {
			this.fn(e);
		}
	}
}
