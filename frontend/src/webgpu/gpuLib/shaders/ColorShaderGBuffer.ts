import Shader from "../Shader";
import Camera from "../Camera";
import Transform from "../Transform";
import { Vector4 } from "math.gl";

export default class ColorShaderGBuffer extends Shader {
  constructor(device: GPUDevice) {
    super(device, "ColorShaderGBuffer");

    this.addAttribute("position", 3);
    this.addAttribute("normal", 3);
    this.addUniform("color", new Vector4(1, 0, 0, 1));
    this.makeShaders();
  }

  getShader(): string {
    return /* wgsl */ `
///////////////////////////////////////////////////////////      
struct VertexOutput
{
    @builtin(position) position : vec4f,
    @location(0) fragPosition: vec3f,  
    @location(1) fragNormal: vec3f,  
}
struct GBufferOutput {
  @location(0) position : vec4f,
  @location(1) normal : vec4f,
  @location(2) albedo : vec4f,
}

${this.getShaderUniforms(0)}
${Camera.getShaderUniforms(1)}
${Transform.getShaderUniforms(2)}



@vertex
fn mainVertex( ${this.getShaderAttributes()} ) -> VertexOutput
{
    var output : VertexOutput;
    output.position =camera.viewProjection*transform.worldMatrix* vec4( position,1.0);
    output.fragPosition =(transform.worldMatrix* vec4( position,1.0)).xyz;
    output.fragNormal =transform.normalMatrix* normal;
    return output;
}


@fragment
fn mainFragment( @location(0) fragPosition: vec3f, @location(1) fragNormal: vec3f,) -> GBufferOutput
{
  var output : GBufferOutput;
  output.position = vec4(fragPosition, 1.0);
  output.normal = vec4(normalize(fragNormal), 1.0);
  output.albedo = uniforms.color;

  return output;
}
///////////////////////////////////////////////////////////
`;
  }
}
