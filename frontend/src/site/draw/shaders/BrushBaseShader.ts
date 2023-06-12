
import { Vector4 } from "math.gl";
import Shader from "../../../webgpu/gpuLib/Shader";
import Transform from "../../../webgpu/gpuLib/Transform";
import Camera2D from "../twoD/Camera2D";

export default class BrushBaseShader extends Shader {
    constructor(device: GPUDevice) {
        super(device, "TextureShader3D");

        //set needed atributes
        this.addAttribute("position", 3);
        this.addAttribute("uv0", 2);
        //set needed uniforms


        this.makeShaders();
    }

    getShader(): string {
        return /* wgsl */ `
///////////////////////////////////////////////////////////      
struct VertexOutput
{
    @location(0) uv : vec2f,
    @builtin(position) position : vec4f
  
}
${Camera2D.getShaderUniforms(0)}
${Transform.getShaderUniforms(1)}



@vertex
fn mainVertex( ${this.getShaderAttributes()} ) -> VertexOutput
{
    var output : VertexOutput;
    output.position = camera.viewProjection*transform.worldMatrix*vec4( position,1.0);
    output.uv = uv0;
    return output;
}

@fragment
fn mainFragment(@location(0) uv: vec2f,) -> @location(0) vec4f
{
      var color = vec4f(smoothstep(0.0,0.5,uv.x),1.0,0.0,1.0);

     return color;
}
///////////////////////////////////////////////////////////
`;
    }
}
