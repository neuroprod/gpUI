import Shader from "../Shader";
import Camera from "../Camera";
import Transform from "../Transform";


export default class NormalShader3D extends Shader
{

    constructor(device: GPUDevice) {
        super(device,'NormalShader3D');

        this.addAttribute("position",3);
        this.addAttribute("normal",3);


        this.makeShaders();
    }

    getShader(): string {
        return /* wgsl */`
///////////////////////////////////////////////////////////      
struct VertexOutput
{
    @location(0) normal : vec3f,
    @builtin(position) position : vec4f
  
}


${Camera.getShaderUniforms(0)}
${Transform.getShaderUniforms(1)}


@vertex
fn mainVertex( ${this.getShaderAttributes()} ) -> VertexOutput
{
    var output : VertexOutput;
    output.position =camera.viewProjection*transform.worldMatrix* vec4( position,1.0);
    output.normal = transform.normalMatrix* normal;
    return output;
}


@fragment
fn mainFragment(@location(0) normal: vec3f,) -> @location(0) vec4f
{
     return vec4(normalize(normal),1.0);
}
///////////////////////////////////////////////////////////
`;
    }
}
