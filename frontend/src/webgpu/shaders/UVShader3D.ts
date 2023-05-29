import Shader from "../gpuLib/Shader";
import Camera from "../gpuLib/Camera";
import Transform from "../gpuLib/Transform";


export default class UVShader3D extends Shader
{

    constructor(device: GPUDevice) {
        super(device,'UVShader3D');

        this.addAttribute("position",3);
        this.addAttribute("uv0",2);


        this.makeShaders();
    }

    getShader(): string {
        return /* wgsl */`
///////////////////////////////////////////////////////////      
struct VertexOutput
{
    @location(0) uv : vec2f,
    @builtin(position) position : vec4f
  
}


${Camera.getShaderUniforms(0)}
${Transform.getShaderUniforms(1)}


@vertex
fn mainVertex( ${this.getShaderAttributes()} ) -> VertexOutput
{
    var output : VertexOutput;
    output.position =camera.viewProjection*transform.worldMatrix* vec4( position,1.0);
    output.uv = uv0;
    return output;
}


@fragment
fn mainFragment(@location(0) uv: vec2f,) -> @location(0) vec4f
{
     return vec4(uv,0.0,1.0);
}
///////////////////////////////////////////////////////////
`;
    }
}
