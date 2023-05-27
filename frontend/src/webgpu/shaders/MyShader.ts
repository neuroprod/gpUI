import Shader, {ShaderType} from "../gpuLib/Shader";
import Camera from "../gpuLib/Camera";
import Transform from "../gpuLib/Transform";

export default class MyShader extends Shader
{

    constructor(device: GPUDevice) {
        super(device,'myShader')

        this.addUniform("color",ShaderType.vec4,[1,0,1,1])
        this.makeShaders();

    }

    getShader(): string {
      return `
struct VertexOutput
{
    @builtin(position) position : vec4<f32>
}

${this.getShaderData(2)}
${Camera.getShaderData(0)}
${Transform.getShaderData(1)}


@vertex
fn mainVertex(
    @location(0) position : vec3<f32>
    ) -> VertexOutput
{
    var output : VertexOutput;
    output.position =camera.viewProjection*worldMatrix* vec4( position,1.0);
    return output;
}


@fragment
fn mainFragment() -> @location(0) vec4<f32>
{
//doyour stuff
    return vec4<f32>(1.0,0.0,0.0,1.0);
}

`;
    }
}
