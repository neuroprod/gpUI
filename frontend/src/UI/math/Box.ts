import Vec2 from "./Vec2";

export default class Box
{
    public marginRight =0;
    public marginLeft =0;
    public marginTop =0;
    public marginBottom =0;

    public paddingRight =0;
    public paddingLeft =0;
    public paddingTop =0;
    public paddingBottom =0;
    public size=new Vec2(-1,-1);

    constructor() {
    }

    setPadding(val: number) {
        this.paddingRight =val;
        this.paddingLeft =val;
        this.paddingTop =val;
        this.paddingBottom =val;
    }
}
