import { Matrix4, Vector3 } from "math.gl";
import UniformGroup from "../../../webgpu/gpuLib/UniformGroup";


export default class Camera2D extends UniformGroup {

    public viewProjection: Matrix4 = new Matrix4();

    private name: string;
    private width: number=1024;
    private height: number=1024;


    constructor(device: GPUDevice, name: string = "Camera2D") {
        super(device, name);
        this.typeID = -1;
        this.name = name;

        //16 for viewProjection+ 4 forCameraWorld
        this.makeBuffers(GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, 16);
        this.isDirty = true;

        // this.updateData()
    }

    static getShaderUniforms(id: number) {
        let data = /* wgsl */ `        
////////////////////////////////////////////////////////////////////////
struct Camera
{
    viewProjection : mat4x4 <f32>,
}
@group( ${id} ) @binding(0)  var<uniform> camera : Camera;
////////////////////////////////////////////////////////////////////////
`;
        return data;
    }

    updateData() {

        this.viewProjection.identity();
        this.viewProjection.ortho({left:0,right:1024,bottom:1024,top:0,near:1,far:-1});



        this.bufferData.set(this.viewProjection, 0);

    }
}
