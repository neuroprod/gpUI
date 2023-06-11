import { Matrix4, Vector3 } from "math.gl";
import UniformGroup from "./UniformGroup";

export default class Camera extends UniformGroup {
  public view: Matrix4 = new Matrix4();
  public projection: Matrix4 = new Matrix4();
  public viewProjection: Matrix4 = new Matrix4();
  public cameraWorld: Vector3 = new Vector3(1, 5, 5);
  public cameraLookAt: Vector3 = new Vector3(0, 0, 0);
  public cameraUp: Vector3 = new Vector3(0, 1, 0);
  private name: string;

  private _ratio: number = 1;
  private viewProjectionInv!: Matrix4;
  public get ratio(): number {
    return this._ratio;
  }
  public set ratio(value: number) {
    if (this._ratio == value) return;
    this._ratio = value;
    this.isDirty = true;
  }
  public set eye(value: Vector3) {
    if (this.cameraWorld.equals(value)) return;
    this.cameraWorld = value;
    this.isDirty = true;
  }
  constructor(device: GPUDevice, name: string = "Camera") {
    super(device, name);
    this.typeID = -1;
    this.name = name;

    //16 for viewProjection+ 4 forCameraWorld
    this.makeBuffers(GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, 16+16 + 4);
    this.isDirty = true;

    // this.updateData()
  }

  static getShaderUniforms(id: number) {
    let data = /* wgsl */ `        
////////////////////////////////////////////////////////////////////////
struct Camera
{
    viewProjection : mat4x4 <f32>,
    viewProjectionInv : mat4x4 <f32>,
    cameraWorld : vec3<f32>,
}
@group( ${id} ) @binding(0)  var<uniform> camera : Camera;
////////////////////////////////////////////////////////////////////////
`;
    return data;
  }

  updateData() {
    this.projection.perspective({
      fovy: 1,
      aspect: this._ratio,
      near: 0.1,
      far: 50,
    });

    this.view.lookAt({
      eye: this.cameraWorld,
      center: this.cameraLookAt,
      up: this.cameraUp,
    });
    this.viewProjection.identity();
    this.viewProjection.multiplyRight(this.projection);
    this.viewProjection.multiplyRight(this.view);
    this.isDirty = true;
    this.viewProjectionInv =this.viewProjection.clone();
    this.viewProjectionInv.invert();

    this.bufferData.set(this.viewProjection, 0);
    this.bufferData.set(this.viewProjectionInv, 16);
    this.bufferData.set(this.cameraWorld, 32);
  }
}
