const colorBlock = document.getElementById("color-block");
const colorStrip = document.getElementById("color-strip");

const block = {
	ctx: colorBlock.getContext("2d"),
	w: colorBlock.width,
	h: colorBlock.height,
};

const strip = {
	ctx: colorStrip.getContext("2d"),
	w: colorStrip.width,
	h: colorStrip.height,
};

const getRGBA = (c) => "rgba(" + c[0] + "," + c[1] + "," + c[2] + ",1)";

let x = 0;
let y = 0;
let rgbaColor = "rgba(255,0,0,1)";

const setupColors = () => {
	block.ctx.rect(0, 0, block.w, block.h);
	fillGradient();

	strip.ctx.rect(0, 0, strip.w, strip.h);
	let grd1 = strip.ctx.createLinearGradient(0, 0, 0, block.h);
	grd1.addColorStop(0, "rgba(255, 0, 0, 1)");
	grd1.addColorStop(0.17, "rgba(255, 255, 0, 1)");
	grd1.addColorStop(0.34, "rgba(0, 255, 0, 1)");
	grd1.addColorStop(0.51, "rgba(0, 255, 255, 1)");
	grd1.addColorStop(0.68, "rgba(0, 0, 255, 1)");
	grd1.addColorStop(0.85, "rgba(255, 0, 255, 1)");
	grd1.addColorStop(1, "rgba(255, 0, 0, 1)");
	strip.ctx.fillStyle = grd1;
	strip.ctx.fill();
};

const fillGradient = () => {
	const { ctx } = block;
	ctx.fillStyle = rgbaColor;
	ctx.fillRect(0, 0, block.w, block.h);

	let grdWhite = strip.ctx.createLinearGradient(0, 0, block.w, 0);
	grdWhite.addColorStop(0, "rgba(255,255,255,1)");
	grdWhite.addColorStop(1, "rgba(255,255,255,0)");
	ctx.fillStyle = grdWhite;
	ctx.fillRect(0, 0, block.w, block.h);

	let grdBlack = strip.ctx.createLinearGradient(0, 0, 0, block.h);
	grdBlack.addColorStop(0, "rgba(0,0,0,0)");
	grdBlack.addColorStop(1, "rgba(0,0,0,1)");
	ctx.fillStyle = grdBlack;
	ctx.fillRect(0, 0, block.w, block.h);
};

const blockColor = (e) => {
	x = e.offsetX;
	y = e.offsetY;
	updateColor();
};

const updateColor = () => {
	let imageData = block.ctx.getImageData(x, y, 1, 1).data;
	const ctx = document.getElementById("color").getContext("2d");
	rgbaColor = getRGBA(imageData);
	ctx.fillStyle = rgbaColor;
	ctx.fillRect(0, 0, 512, 512);
	editor.loadFlagImg(flagColor);
	editor.refreshCanvas();
};

const stripColor = (e) => {
	const { offsetX: ex, offsetY: ey } = e;
	let imageData = strip.ctx.getImageData(ex, ey, 1, 1).data;
	rgbaColor = getRGBA(imageData);
	fillGradient();
	updateColor();
};

setupColors();
new Mouse(colorStrip, stripColor);
new Mouse(colorBlock, blockColor);
