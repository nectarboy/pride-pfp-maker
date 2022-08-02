//document.onload = function() {

console.log("loading the app babe");

// --- get all elements
const mainCanvas = document.getElementById("mainCanvas");
const mainCtx = mainCanvas.getContext("2d");

const uploadDiv = document.getElementById("uploadDiv");
const uploadButton = document.getElementById("uploadButton");

const exportDiv = document.getElementById("exportDiv");
const continueEditing = document.getElementById("continueEditing");
const exportEl = document.getElementById("exportEl");

const editorDiv = document.getElementById("editorDiv");
// Flag buttons
const flagButtonDiv = document.getElementById("flagButtonDiv");
const otherFlagInput = document.getElementById("otherFlagInput");

// Setting buttons
const imgScaleInput = document.getElementById("imgScaleInput");
const ringScaleInput = document.getElementById("ringScaleInput");

// Reset buttons
const resetImageScaleButton = document.getElementById("resetImageScaleButton");
const resetRingScaleButton = document.getElementById("resetRingScaleButton");
const resetDragOffButton = document.getElementById("resetDragOffButton");

// Flag mode objects
const flagModeText = document.getElementById("flagModeText");
const flagModeToggle = document.getElementById("flagModeToggle");
const flagModeToggleHandle = document.getElementById("flagModeToggleHandle");
const flagModePreview = document.getElementById("flagModePreview");

//Flag Color
const flagColor = document.getElementById("color");

// Export & choose new img buttons
const chooseNewButton = document.getElementById("chooseNewButton");
const exportButton = document.getElementById("exportButton");

var currentDiv = uploadDiv;

// --- helper functions
function selectDiv(div) {
	currentDiv.style.display = "none";

	currentDiv = div;
	currentDiv.style.display = "inherit";
}

function loadImgFromFile(file, callback) {
	const img = new Image();
	img.onload = () => callback(img);
	img.onerror = () => alert("bitch the fuck did u give me !");

	img.src = URL.createObjectURL(file); // set src to blob url
}

function getCanvasUrl(canvas) {
	return mainCanvas
		.toDataURL("image/png")
		.replace("image/png", "image/octet-stream");
}

const canvasRefreshCooldown = 25;
var canvasRefreshing = false;
function requestRefresh() {
	if (canvasRefreshing) return;
	canvasRefreshing = true;

	setTimeout(() => {
		canvasRefreshing = false;
		editor.refreshCanvas();
	}, canvasRefreshCooldown);
}

// editor
var editor = null;
var editorloaded = false;
function resetEditor() {
	editorloaded = true;
	editor = new Editor(mainCanvas);
	editor.flagId = 0; // Rainbow flag
}

// --- editing
// generate flag buttons
for (var i = 0; i < presetFlags.length; i++) {
	// create elements
	const wrapper = document.createElement("div");
	const div = document.createElement("div");
	const span = document.createElement("span");

	// generate text
	const canv = document.createElement("canvas");
	canv.width = canv.height = 24;
	canv.style.border = "1px solid white";
	presetFlags[i].obj.DrawFlagOnCanvas(canv);

	const title = document.createElement("span");
	title.innerHTML = presetFlags[i].name + "<br>";

	span.appendChild(title);
	span.appendChild(canv);

	div.className = "button flagButton";
	wrapper.className = "flagButtonWrapper";

	// append all elements
	div.appendChild(span);
	wrapper.appendChild(div);
	flagButtonDiv.appendChild(wrapper);

	// button functionality
	(function (ii) {
		div.onclick = function () {
			editor.clearFlagImg();
			editor.flagId = ii;
			editor.refreshCanvas();
		};
	})(i);
}

// generate other flag upload button
otherFlagInput.onchange = function () {
	if (this.files && this.files[0]) {
		loadImgFromFile(this.files[0], (img) => {
			editor.loadFlagImg(img);
			editor.refreshCanvas();
		});
	}
};

(function () {
	// create elements
	const wrapper = document.createElement("div");
	const label = document.createElement("label");
	const div = document.createElement("div");

	label.htmlFor = "otherFlagInput";

	div.className = "button otherFlagButton";
	div.innerHTML = "Custom<br>Image";
	wrapper.className = "flagButtonWrapper";

	// append all elements
	label.appendChild(div);
	wrapper.appendChild(label);
	flagButtonDiv.appendChild(wrapper);
})();

flagColor.getContext("2d").canvas.hidden = true;
flagColor.onchange = function () {
	editor.loadFlagImg(flagColor);
	editor.refreshCanvas();
};

// more settings
imgScaleInput.oninput = function () {
	editor.setPfpImageScale(this.value);
	requestRefresh();
};

ringScaleInput.oninput = function () {
	editor.pfpRingScale = 1 - this.value;
	requestRefresh();
};

// export buttons
chooseNewButton.onclick = function () {
	if (confirm("are you sure you want to start over ?")) selectDiv(uploadDiv);
};

exportButton.onclick = function () {
	// download as file method - ehh
	// window.open(
	//     getCanvasUrl(mainCanvas),
	//     '_blank'
	// );

	// let user manually save - better for phones ig :,3
	exportEl.onload = function () {
		selectDiv(exportDiv);
	};

	exportEl.onerror = () =>
		alert("there was an error exporting ! try again ? o_o;");

	exportEl.src = getCanvasUrl(mainCanvas);
};

// offset dragging
var dragX = 0;
var dragY = 0;
var dragPreX = 0;
var dragPreY = 0;
var dragging = false;
var movedBefore = false;

function setDragPos(x, y) {
	if (!dragging || canvasRefreshing) return;

	dragPreX = dragX;
	dragPreY = dragY;
	dragX = x;
	dragY = y;

	if (movedBefore) {
		editor.pfpImgOffX += dragX - dragPreX;
		editor.pfpImgOffY += dragY - dragPreY;

		requestRefresh();
	} else {
		movedBefore = true;

		dragPreX = dragX;
		dragPreY = dragY;
	}
}

mainCanvas.onmousedown = mainCanvas.ontouchstart = (e) => {
	dragging = true;
};
document.onmouseup = mainCanvas.ontouchend = (e) => {
	dragging = false;
	movedBefore = false;
};

// Mouse dragging
document.onmousemove = (e) => {
	const rect = mainCanvas.getBoundingClientRect();
	const scale = mainCanvas.width / rect.width;

	setDragPos(scale * (e.x - rect.left), scale * (e.y - rect.top));
};

// Finger dragging
mainCanvas.ontouchmove = (e) => {
	const rect = mainCanvas.getBoundingClientRect();
	const scale = mainCanvas.width / rect.width;

	setDragPos(
		scale * (e.touches[0].pageX - rect.left),
		scale * (e.touches[0].pageY - rect.top)
	);
};

// resetting settings
function resetDragOffset() {
	editor.pfpImgOffX = 0;
	editor.pfpImgOffY = 0;
}

function resetRingScale() {
	editor.resetPfpRingScale();
	ringScaleInput.value = 1 - editor.pfpRingScale;
}

function resetImageScale() {
	editor.fitImgScaleToRing();
	imgScaleInput.value = editor.pfpImgScale;
}

function defaultInputValues() {
	resetRingScale();
	resetImageScale();
	resetDragOffset();

	console.log(imgScaleInput.value, ringScaleInput.value);
}

// resetting button functionality
[
	[resetImageScaleButton, resetImageScale],
	[resetRingScaleButton, resetRingScale],
	[resetDragOffButton, resetDragOffset],
].forEach((pack) => {
	pack[0].onclick = function () {
		pack[1]();
		requestRefresh();
	};
});

// --- Pfp mode functionally
var flagmode = false;
var flagModePreviewEditor = new Editor(flagModePreview);
var lilguyImage = new Image();
lilguyImage.onload = function () {
	lilguyImageLoaded = true;
	flagModePreviewEditor.loadPfpImg(lilguyImage);

	setFlagMode(flagmode); // update preview :p
};
lilguyImage.src = "src/assets/lilguy_32.png";
var lilguyImageLoaded = false;

function setFlagMode(val) {
	flagmode = val;
	if (editorloaded) {
		editor.bgMode = val;
		resetRingScale();
		resetImageScale();
		editor.refreshCanvas();
	}

	// style
	var computedtoggle = getComputedStyle(flagModeToggle);
	var computedtogglehandle = getComputedStyle(flagModeToggleHandle);
	var togglerectwidth = parseFloat(computedtoggle.width);
	var togglerectborder = parseFloat(computedtoggle.border);
	var togglerecthandlewidth = parseFloat(computedtogglehandle.width);

	// toggled on
	if (val) {
		flagModeToggle.style.backgroundColor = "#1cc959";
		flagModeToggleHandle.style.left =
			togglerectwidth -
			togglerecthandlewidth -
			togglerectborder * 2 +
			"px";
		flagModeText.innerHTML = "flag mode: BACKGROUND";
	}
	// toggled off
	else {
		flagModeToggle.style.backgroundColor = "#333333";
		flagModeToggleHandle.style.left = "0";
		flagModeText.innerHTML = "flag mode: RING";
	}

	if (lilguyImageLoaded) {
		flagModePreviewEditor.setBgMode(val);
		flagModePreviewEditor.setPfpImageScale(1);
		flagModePreviewEditor.pfpRingScale = 0.8;

		flagModePreviewEditor.refreshCanvas();
	}
}

flagModeToggle.onclick = function () {
	setFlagMode(!flagmode);
};

// --- uploading
function onPfpUpload(img) {
	resetEditor();

	editor.loadPfpImg(img);
	defaultInputValues();
	editor.refreshCanvas();

	selectDiv(editorDiv);
}

["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
	uploadDiv.addEventListener(eventName, function (e) {
		e.preventDefault();
		e.stopPropagation();
	});
});

uploadDiv.ondrop = function (e) {
	const files = e.dataTransfer.files;
	if (files && files[0]) loadImgFromFile(files[0], onPfpUpload);
};

// button click
uploadButton.onchange = function () {
	if (this.files && this.files[0])
		loadImgFromFile(this.files[0], onPfpUpload);
};

// --- exporting
continueEditing.onclick = function () {
	selectDiv(editorDiv);

	exportEl.onerror = null;
	exportEl.src = ""; // free memory (?) !
};

// --- execute
selectDiv(uploadDiv);
setFlagMode(false);

console.log("running; no errors :D");

//};

// phew ,,, that was a hot hot mess ,,,
// this code rlly needs some refactoring (especially in the names)
// i suck complete ass at variable names n shit ..
// well everything works so its all good for now :3
