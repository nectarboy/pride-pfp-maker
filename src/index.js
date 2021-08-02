console.log('what u doing sneakin around in the code huh ...');

// --- get all elements
const mainCanvas = document.getElementById('mainCanvas');
const mainCtx = mainCanvas.getContext('2d');

const uploadDiv = document.getElementById('uploadDiv');
    const uploadButton = document.getElementById('uploadButton');

const exportDiv = document.getElementById('exportDiv');
    const continueEditing = document.getElementById('continueEditing');
    const exportEl = document.getElementById('exportEl');

const editorDiv = document.getElementById('editorDiv');
    const flagButtonDiv = document.getElementById('flagButtonDiv');
    const otherFlagInput = document.getElementById('otherFlagInput');
    const imgScaleInput = document.getElementById('imgScaleInput');
    const ringScaleInput = document.getElementById('ringScaleInput');
    const chooseNewButton = document.getElementById('chooseNewButton');
    const exportButton = document.getElementById('exportButton');

var currentDiv = uploadDiv;

// --- helper functions
function selectDiv(div) {
    currentDiv.style.display = 'none';

    currentDiv = div;
    currentDiv.style.display = 'inherit';
}

function loadImgFromFile(file, callback) {
    const img = new Image();
    img.onload = () => callback(img);
    img.onerror = () => alert('bitch the fuck did u give me !');

    img.src = URL.createObjectURL(file); // set src to blob url
}

function onPfpUpload(img) {
    resetEditor();

    editor.loadPfpImg(img);
    editor.refreshCanvas();
    defaultInputValues();

    selectDiv(editorDiv);
}

function defaultInputValues() {
    imgScaleInput.value = editor.pfpImgScale;
    ringScaleInput.value = 1 - editor.pfpRingScale;

    console.log(imgScaleInput.value, ringScaleInput.value);
}

function getCanvasUrl(canvas) {
    return mainCanvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
}

var refreshing = false;
const refreshCool = 25;
function requestRefresh() {
    if (refreshing)
        return;
    refreshing = true;

    setTimeout(() => {
        refreshing = false;
        editor.refreshCanvas();
    }, refreshCool);
}

// editor
var editor = null;
function resetEditor() {
    editor = new Editor(mainCanvas);
    editor.flagId = 1; // Gay flag
}

// --- editing
// generate flag buttons
for (var i = 0; i < presetFlags.length; i++) {
    // create elements
    const wrapper = document.createElement('div');
    const div = document.createElement('div');
    const span = document.createElement('span');

    // generate text
    const canv = document.createElement('canvas');
        canv.width = canv.height = 24;
        canv.style.border = '1px solid white';
        presetFlags[i].obj.DrawFlagOnCanvas(canv);

    const title = document.createElement('span');
        title.innerHTML = presetFlags[i].name + '<br>';

    span.appendChild(title);
    span.appendChild(canv);

    div.className = 'button flagButton';
    wrapper.className = 'flagButtonWrapper';

    // append all elements
    div.appendChild(span);
    wrapper.appendChild(div);
    flagButtonDiv.appendChild(wrapper);

    // button functionality
    (function(ii) {
        div.onclick = function() {
            editor.clearFlagImg();

            editor.flagId = ii;
            editor.refreshCanvas();
        };
    })(i);
}

// generate other flag upload button
otherFlagInput.onchange = function() {
    if (this.files && this.files[0]) {
        loadImgFromFile(this.files[0], img => {
            editor.loadFlagImg(img);
            editor.refreshCanvas();
        });
    }
};

(function() {
    // create elements
    const wrapper = document.createElement('div');
    const label = document.createElement('label');
    const div = document.createElement('div');

    label.htmlFor = 'otherFlagInput';

    div.className = 'button otherFlagButton';
    div.innerHTML = 'Custom<br>Image';
    wrapper.className = 'flagButtonWrapper';

    // append all elements
    label.appendChild(div);
    wrapper.appendChild(label);
    flagButtonDiv.appendChild(wrapper);
})();

// more settings
imgScaleInput.oninput = function() {
    editor.pfpImgScale = this.value;
    requestRefresh();
};

ringScaleInput.oninput = function() {
    editor.pfpRingScale = 1 - this.value;
    requestRefresh();
};

// export buttons
chooseNewButton.onclick = function() {
    if (confirm('are you sure you want to start over ?'))
        selectDiv(uploadDiv);
};

exportButton.onclick = function() {
    // download as file method - ehh
    // window.open(
    //     getCanvasUrl(mainCanvas),
    //     '_blank'
    // );

    // let user manually save - better for phones ig :,3
    exportEl.onload = function() {
        selectDiv(exportDiv);
    };

    exportEl.onerror = () => alert('there was an error exporting ! try again ? o_o;');

    exportEl.src = getCanvasUrl(mainCanvas);
    
};

// --- uploading
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      uploadDiv.addEventListener(eventName, function(e) {
            e.preventDefault();
            e.stopPropagation();
        });
    });

uploadDiv.ondrop = function(e) {
    const files = e.dataTransfer.files;
    if (files && files[0])
        loadImgFromFile(files[0], onPfpUpload);
};

// button click
uploadButton.onchange = function() {
    if (this.files && this.files[0])
        loadImgFromFile(this.files[0], onPfpUpload);
};

// --- exporting
continueEditing.onclick = function() {
    selectDiv(editorDiv);

    exportEl.onerror = null;
    exportEl.src = ''; // unneeded !
};

// --- execute
selectDiv(uploadDiv);

console.log('no errors :D');