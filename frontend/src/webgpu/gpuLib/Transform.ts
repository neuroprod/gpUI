import UniformGroup from "./UniformGroup";
import {Matrix4, Vector3} from "math.gl";

export default class Transform extends UniformGroup
{
    private name: String;
    private worldMatrix: Matrix4;




    constructor(device:GPUDevice,name:string) {
        super(device,name);
        this.name= name;
        this.getAtModel =true;
        this.typeID =-2;
        this.worldMatrix =new Matrix4();
        //16 for matrix
        this.makeBuffers(GPUShaderStage.VERTEX,16)
        this.updateData();
    }

    static getShaderData(id: number) {
        let data = /* wgsl */`
////////////////////////////////////////////////////////////////////       
@group( ${id} ) @binding(0) var<uniform> worldMatrix  : mat4x4 <f32>;
////////////////////////////////////////////////////////////////////    
`
        return data;
    }
    setPosition(position:Vector3)
    {

        this.worldMatrix.identity()
        this.worldMatrix.translate(position);
        this.updateData()
    }
    updateData()
    {
        this.bufferData.set(this.worldMatrix,0)
        this.updateBuffer();
    }
}
