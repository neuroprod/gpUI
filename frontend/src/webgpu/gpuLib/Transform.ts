import UniformGroup from "./UniformGroup";
import { Matrix3, Matrix4, Vector3 } from "math.gl";

export default class Transform extends UniformGroup {
  private name: String;
  private worldMatrix: Matrix4;
  private normalMatrix: Matrix4;
  private _position: Vector3 = new Vector3();
  private _scale: Vector3 = new Vector3(1, 1, 1);
  private _rotation: Vector3 = new Vector3(0,0,0);

  public get position(): Vector3 {
    return this._position;
  }
  public set position(value: Vector3) {
    if (value.equals(this._position)) return;
    this._position.copy(value);
    this.isDirty = true;
  }

  public get rotation(): Vector3 {
    return this._rotation;
  }
  public set rotation(value: Vector3) {
    if (value.equals(this._rotation)) return;
    this._rotation.copy(value);
    this.isDirty = true;
  }

  public get scale(): Vector3 {
    return this._scale;
  }
  public set scale(value: Vector3) {
    if (value.equals(this._scale)) return;
    this._scale.copy(value);
    this.isDirty = true;
  }

  constructor(device: GPUDevice, name: string) {
    super(device, name);
    this.name = name;
    this.getAtModel = true;
    this.typeID = -2;
    this.worldMatrix = new Matrix4();
    this.normalMatrix = new Matrix4();
    //16 for matrix
    this.makeBuffers(GPUShaderStage.VERTEX, 16 + 16);
    this.updateData();
  }

  static getShaderUniforms(id: number) {
    let data = /* wgsl */ `
////////////////////////////////////////////////////////////////////       
struct Transform
{
    worldMatrix : mat4x4f,
    normalMatrix : mat3x3f,
}
@group( ${id} ) @binding(0)  var<uniform> transform : Transform;
////////////////////////////////////////////////////////////////////    
`;
    return data;
  }

  updateData() {
    this.worldMatrix.identity();

    this.worldMatrix.translate(this._position);
    this.worldMatrix.scale(this._scale);
    this.worldMatrix.rotateXYZ(this._rotation);

    this.normalMatrix.copy(this.worldMatrix);
    this.normalMatrix.invert();
    this.normalMatrix.transpose();

    this.bufferData.set(this.worldMatrix, 0);
    this.bufferData.set(this.normalMatrix, 16);
  }
}
