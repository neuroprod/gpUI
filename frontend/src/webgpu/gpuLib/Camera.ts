import {Matrix4, Vector3} from "math.gl";
import UniformData from "./UniformData";


export default class Camera extends UniformData {

    public view: Matrix4 = new Matrix4()
    public projection: Matrix4 = new Matrix4()
    public viewProjection: Matrix4 = new Matrix4()
    public cameraWorld: Vector3 = new Vector3(0, 0, -2);
    public cameraLookAt: Vector3 = new Vector3(0, 0, 0);
    public cameraUp: Vector3 = new Vector3(0, 1, 0);
    private name: string;

    constructor(device: GPUDevice, name: string = "Camera") {

        super(device)
        this.typeID = -1;
        this.name = name;
        this.view = new Matrix4()
        this.view.lookAt({eye: this.cameraWorld, center: this.cameraLookAt, up: this.cameraUp})
        this.projection.perspective({fovy: 1, aspect: 1, near: 0.1, far: 5})

        this.viewProjection.multiplyRight(this.projection)
        this.viewProjection.multiplyRight(this.view)

        //16 for viewProjection+ 4 forCameraWorld
        this.makeBuffers(this.name, GPUShaderStage.VERTEX, 16 + 4)


        this.updateData()

    }

    static getShaderData(id: number) {
        let data = `        
struct Camera
{
    viewProjection : mat4x4 <f32>,
    cameraWorld : vec3<f32>,
}
@group( ${id} ) @binding(0)  var<uniform> camera : Camera;
`
        return data;
    }

    update() {
        this.cameraWorld.x = Math.sin(Date.now() / 1000);
        this.view.lookAt({eye: this.cameraWorld, center: this.cameraLookAt, up: this.cameraUp})
        this.viewProjection.identity()
        this.viewProjection.multiplyRight(this.projection)
        this.viewProjection.multiplyRight(this.view)
        //if is dirty blabalbal
        this.updateData()
    }

    updateData() {
        this.bufferData.set(this.viewProjection, 0)
        this.bufferData.set(this.cameraWorld, 16)
        this.updateBuffer();
    }
}
