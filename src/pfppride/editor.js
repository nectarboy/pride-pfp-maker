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

        // pfp
        this.pfpMode = 0; // 0: ring, 1: background
        this.flagId = 0;

        // flag
        this.flagImg = null;
        this.customFlag = false;

        // event latches - configurable !
        // this.onImgLoad = () => {};
    };

    // standard methods
    loadPfpImg(img) {
        this.pfpImg = img;
        this.resetSettingsDefault();
    }

    loadFlagImg(img) {
        this.flagImg = img;
        this.customFlag = true;
    }

    clearFlagImg() {
        this.flagImg = null;
        this.customFlag = false;
    }

    // refreshing the main canvas
    refreshCanvas() {
        const flagCanvas = document.createElement('canvas');

        this.canvas.width = flagCanvas.width =
        this.canvas.height = flagCanvas.height = this.pfpImg.width; // force canvas into square

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // setting width|height should've cleared it,
                                                                         // but just in case :3

        const flag = presetFlags[this.flagId];

        switch (this.pfpMode) {
            case 0: {
                this.drawFlag(flagCanvas, flag);
                flag.obj.EraseCircleOnCanvas(flagCanvas, this.pfpRingScale);

                this.drawPfpImg();
                this.ctx.drawImage(flagCanvas, 0, 0, this.canvas.width, this.canvas.height);
                break;
            }
            case 1: {
                this.drawFlag(flagCanvas, flag);

                this.ctx.drawImage(flagCanvas, 0, 0, this.canvas.width, this.canvas.height);
                this.drawPfpImg();
                break;
            }

            default: throw 'ERROR: invalid pfp mode ?';
        }
    }

    // -- helper
    drawPfpImg() {
        const scaledWidth = this.pfpImgScale * this.pfpImg.width;
        const scaledHeight = this.pfpImgScale * this.pfpImg.height;

        const widthHeightRatio = this.pfpImg.width / this.pfpImg.height;

        this.ctx.drawImage(
            this.pfpImg,
            -(scaledWidth - this.pfpImg.width)/2 + this.pfpImgScale * this.pfpImgOffX,
            -(scaledHeight - this.pfpImg.height*widthHeightRatio)/2 + this.pfpImgScale * this.pfpImgOffY,
            scaledWidth,
            scaledHeight
        );
    }

    drawFlag(canvas, flag) {
        // Custom flag loaded
        if (this.customFlag) {
            const ctx = canvas.getContext('2d');

            const canvScale = this.canvas.height / this.flagImg.height;
            const widthMul = Math.max(
                1,
                this.flagImg.height / this.flagImg.width
            ) * canvScale;

            const scaledWidth = this.flagImg.width * widthMul;
            const scaledHeight = this.flagImg.height * widthMul;

            ctx.drawImage(
                this.flagImg,
                (this.pfpImg.width - scaledWidth)/2,
                (this.pfpImg.height - scaledHeight)/2,
                scaledWidth,
                scaledHeight
            );
        }
        // Standard flag
        else {
            flag.obj.DrawFlagOnCanvas(canvas);
        }
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

}