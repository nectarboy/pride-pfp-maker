class Editor {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // image
        this.pfpImg = null;

        // pfp variables / settings
        this.pfpImgScale = 0;
        this.pfpRingScale = 0;

        this.pfpImgOffInc = 2;
        this.pfpImgOffX = 0;
        this.pfpImgOffY = 0;

        this.pfpMode = 0; // 0: ring, 1: background
        this.pfpFlagID = 0;

        // event latches - configurable !
        this.onImgLoad = () => {};
    };

    // standard methods
    loadPfpImg(src) {
        this.pfpImg = new Image();
        this.pfpImg.src = src;
        // this.pfpImg.crossOrigin = 'anonymous'; // !!

        const that = this;
        this.pfpImg.onload = function() {
            that.resetSettingsDefault();
            that.onImgLoad();
        };
    }

    resetSettingsDefault() {
        this.pfpImgOffX = 0;
        this.pfpImgOffY = 0;

        this.pfpImgScale =
        this.pfpImg.width > this.pfpImg.height ?
            this.pfpImg.width / this.pfpImg.height :
            this.pfpImg.height / this.pfpImg.width;

        // pfp mode cases !
        switch (this.pfpMode) {
            case 0: {
                this.pfpRingScale = 0.875;
                this.pfpImgScale *= this.pfpRingScale;
                break;
            }
        }

    }

    // refreshing the main canvas
    refreshCanvas() {
        var flagCanvas = document.createElement('canvas');

        this.canvas.width = flagCanvas.width =
        this.canvas.height = flagCanvas.height = this.pfpImg.width; // force canvas into square

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // setting width|height should've cleared it,
                                                                         // but just in case :3

        var flag = presetFlags[this.pfpFlagID];

        switch (this.pfpMode) {
            case 0: {
                flag.obj.DrawFlagOnCanvas(flagCanvas);
                flag.obj.EraseCircleOnCanvas(flagCanvas, this.pfpRingScale);

                this.drawPfpImg();
                this.ctx.drawImage(flagCanvas, 0, 0, this.canvas.width, this.canvas.height);
                break;
            }
            case 1: {
                flag.obj.DrawFlagOnCanvas(flagCanvas);

                this.ctx.drawImage(flagCanvas, 0, 0, this.canvas.width, this.canvas.height);
                this.drawPfpImg();
                break;
            }

            default: throw 'ERROR: invalid pfp mode ?'
        }
    }

    // -- helper
    drawPfpImg() {
        var scaledWidth = this.pfpImgScale * this.pfpImg.width;
        var scaledHeight = this.pfpImgScale * this.pfpImg.height;

        var widthHeightRatio = this.pfpImg.width / this.pfpImg.height;

        this.ctx.drawImage(
            this.pfpImg,
            -(scaledWidth - this.pfpImg.width)/2 + this.pfpImgScale * this.pfpImgOffX,
            -(scaledHeight - this.pfpImg.height*widthHeightRatio)/2 + this.pfpImgScale * this.pfpImgOffY,
            scaledWidth,
            scaledHeight
        );
    }

}