import Shader from "../gpuLib/Shader";
import Camera from "../gpuLib/Camera";
import Transform from "../gpuLib/Transform";
import { Vector4 } from "math.gl";

export default class MyShader extends Shader
{
    constructor(device: GPUDevice) {
        super(device,'myShader');
        this.addUniform("color",new Vector4(1,0,1,1));
        this.makeShaders();
    }

    getShader(): string {
      return /* wgsl */`
///////////////////////////////////////////////////////////      
struct VertexOutput
{
    @builtin(position) position : vec4<f32>
}

${this.getShaderData(0)}
${Camera.getShaderData(1)}
${Transform.getShaderData(2)}


@vertex
fn mainVertex( @location(0) position : vec3<f32> ) -> VertexOutput
{
    var output : VertexOutput;
    output.position =camera.viewProjection*worldMatrix* vec4( position,1.0);
    return output;
}


@fragment
fn mainFragment() -> @location(0) vec4<f32>
{
     return uniforms.color;
}
///////////////////////////////////////////////////////////
`;
    }
}
