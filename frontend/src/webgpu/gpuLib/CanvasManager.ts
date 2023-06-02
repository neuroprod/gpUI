export default class CanvasManager {
    private canvas: HTMLCanvasElement;
    private _resizeTimeOut:  ReturnType<typeof setTimeout>;
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.resize()
        window.onresize =this.delayedResize.bind(this);
    }
    resize()
    {
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height =window.innerHeight+ 'px';
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;


    }
    delayedResize()
    {
        clearTimeout(this._resizeTimeOut);

        this._resizeTimeOut = setTimeout (this.resize.bind(this), 100);

    }
}
