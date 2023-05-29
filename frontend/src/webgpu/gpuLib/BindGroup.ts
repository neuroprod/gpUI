import UniqueObject from "./UniqueObject";

export class BindGroup extends UniqueObject{

    public device: GPUDevice;
    public label:string;
    public slot:number

    public bindGroupLayout: GPUBindGroupLayout;
    public bindGroup: GPUBindGroup;
    public typeID =0
    constructor(device:GPUDevice,label:string) {
        super();
        this.typeID =this.uID;
        this.device = device;
        this.label =label;
    }








}
