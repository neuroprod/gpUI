import Shader from "../Shader";
import Camera from "../Camera";
import Transform from "../Transform";
import { Vector4 } from "math.gl";

export default class ColorShader3D extends Shader
{

    constructor(device: GPUDevice) {
        super(device,'ColorShader3D');

        this.addAttribute("position",3);
        this.addUniform("color",new Vector4(1,0,0,1));
        this.makeShaders();
    }

    getShader(): string {
      return /* wgsl */`
///////////////////////////////////////////////////////////      
struct VertexOutput
{
    @builtin(position) position : vec4f
}

${this.getShaderUniforms(0)}
${Camera.getShaderUniforms(1)}
${Transform.getShaderUniforms(2)}



@vertex
fn mainVertex( ${this.getShaderAttributes()} ) -> VertexOutput
{
    var output : VertexOutput;
    output.position =camera.viewProjection*transform.worldMatrix* vec4( position,1.0);
    return output;
}


@fragment
fn mainFragment() -> @location(0) vec4f
{
     return uniforms.color;
}
///////////////////////////////////////////////////////////
`;
    }
}
