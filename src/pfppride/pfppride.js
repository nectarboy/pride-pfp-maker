/* FlagObject
 * - class used to create a flag object  that can draw itself onto any given canvas
 */
class FlagObject {
	constructor(colors) {
		this.hexColors = [];
		for (var i = 0; i < colors.length; i++) {
			const color = colors[i];

			const colorTrimmed = color.split("");
			colorTrimmed.shift();
			const parsedColor = colorTrimmed.join("");

			if (
				color.length !== 7 ||
				color[0] !== "#" ||
				parsedColor !== parsedColor
			)
				throw `invalid hex color at ${i} !`;

			this.hexColors[i] = color;
		}
	}

	// canvas methods !
	DrawFlagOnCanvas(canvas, blur = false) {
		if (blur) {
			this.DrawBlurredFlag(canvas);
			return;
		}
		this.Render(canvas);
	}

	DrawBlurredFlag(canvas) {
		const ctx = canvas.getContext("2d");
		canvas.width = canvas.width + offSetBlurWidth;
		this.Render(canvas);
		ctx.filter = getFilter();
		this.Render(canvas);
		ctx.filter = "none";
	}

	Render(canvas) {
		const ctx = canvas.getContext("2d");
		const rowHeight = canvas.height / this.hexColors.length;
		for (var i = 0; i < this.hexColors.length; i++) {
			ctx.fillStyle = this.hexColors[i];
			ctx.fillRect(0, rowHeight * i, canvas.width, canvas.height);
		}
	}

	EraseCircleOnCanvas(canvas, scale) {
		const ctx = canvas.getContext("2d");
		const radius = (scale * canvas.height) / 2;

		ctx.globalCompositeOperation = "destination-out";
		ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI);
		ctx.fill();

		ctx.globalCompositeOperation = "source-over"; // default
	}
}
