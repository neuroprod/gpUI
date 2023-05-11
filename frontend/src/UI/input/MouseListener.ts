import Vec2 from "../math/Vec2";

export default class MouseListener {
    private element: HTMLElement;

    private preventDefault = false;
    public mousePos: Vec2;
    public mousePosDown: Vec2;
    public isDown: boolean =false;
    public isDownThisFrame: boolean =false;
    public isUpThisFrame: boolean =false;
    public isDirty: number =2;


    constructor(element:HTMLElement) {
        this.element = element;

        this.element.addEventListener('mousemove', this.mouseMoveListener.bind(this), false);
        this.element.addEventListener('touchmove', this.touchMoveListener.bind(this), {passive: true});


        this.element.addEventListener('touchstart', this.touchStartListener.bind(this), {passive: true});
        this.element.addEventListener('mousedown', this.mouseDownListener.bind(this), false);

        this.element.addEventListener('touchend', this.mouseUp.bind(this), false);
        this.element.addEventListener('mouseup', this.mouseUp.bind(this), false);

        this.element.addEventListener('mousecancel', this.endListener.bind(this), false);
        this.element.addEventListener('mouseout', this.endListener.bind(this), false);
        this.element.addEventListener('touchcancel', this.endListener.bind(this), false);
        this.element.addEventListener('touchcancel', this.endListener.bind(this), false);


        this.mousePos = new Vec2(-1, -1);
        this.mousePosDown = new Vec2(-1, -1);

    }



    touchStartListener(e) {
        this.setMousePosition(e.targetTouches[0]);
        if (this.preventDefault) {
            e.preventDefault();
        }
        this.mouseDown();
    }

    mouseDownListener(e) {
        if (e.which - 1 == 0) {
            this.setMousePosition(e);
            if (this.preventDefault) {
                e.preventDefault();
            }
            this.mouseDown();
        }
    }

    touchMoveListener(e) {
        this.setMousePosition(e.targetTouches[0]);
        if (this.preventDefault) {
            e.preventDefault();
        }
    }

    mouseMoveListener(e) {

        this.setMousePosition(e);
        if (this.preventDefault) {
            e.preventDefault();
        }
    }

    endListener() {

        this.isDown = false;
        this.isDownThisFrame = false;
        this.isDirty =2;
    }

    mouseDown() {
        this.isDown = true;
        this.isDownThisFrame = true;
        this.mousePosDown = this.mousePos.clone();
        this.isDirty =2;
    }

    mouseUp() {
        this.isDown = false;
        this.isUpThisFrame = true;
        this.isDirty =2;
    }

    setMousePosition(e) {

        this.mousePos.x = e.offsetX;
        this.mousePos.y = e.offsetY;
        this.isDirty =2;
    }

    reset() {
        this.isUpThisFrame = false;
        this.isDownThisFrame = false;
        this.isDirty --;
    }

}

