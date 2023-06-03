import Shader from "../Shader";



export default class FullScreenTexture extends Shader
{

    constructor(device: GPUDevice) {
        super(device,'TextureShader3D');

        //set needed atributes
        this.addAttribute("position",3);
        this.addAttribute("uv0",2);
        //set needed uniforms
        //  this.addUniform("color",new Vector4(1,0,0,1));
        this.addSampler("sampler1");
        this.addTexture("texture1");//implement texture types


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

${this.getShaderTexturesSamplers(0)}


@vertex
fn mainVertex( ${this.getShaderAttributes()} ) -> VertexOutput
{
    var output : VertexOutput;
    output.position = vec4( position,1.0);
    output.uv = uv0;
    return output;
}

@fragment
fn mainFragment(@location(0) uv: vec2f,) -> @location(0) vec4f
{
     return textureSample(texture1, sampler1, uv);
}
///////////////////////////////////////////////////////////
`;
    }
}
