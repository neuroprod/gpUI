import Shader from "../gpuLib/Shader";
import Camera from "../gpuLib/Camera";
import Transform from "../gpuLib/Transform";
import {Vector4} from "math.gl";


export default class TextureShader3D extends Shader
{

    constructor(device: GPUDevice) {
        super(device,'TextureShader3D');

        //set needed atributes
        this.addAttribute("position",3);
        this.addAttribute("uv0",2);
        //set needed uniforms
        this.addUniform("color",new Vector4(1,0,0,1));
        this.addTexture("texture1");
        this.addSampler("sampler");

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

${this.getShaderUniforms(1)}
${Camera.getShaderUniforms(2)}
${Transform.getShaderUniforms(3)}

@group(0) @binding(0) var mySampler: sampler;
@group(0) @binding(1) var myTexture: texture_2d<f32>;

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
     return textureSample(myTexture, mySampler, uv);
}
///////////////////////////////////////////////////////////
`;
    }

}
