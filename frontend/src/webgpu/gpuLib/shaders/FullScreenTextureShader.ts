import Shader from "../Shader";
import { Vector4 } from "math.gl";

export default class FullScreenTextureShader extends Shader {
  constructor(device: GPUDevice) {
    super(device, "TextureShader3D");

    //set needed atributes
    this.addAttribute("position", 3);
    this.addAttribute("uv0", 2);
    //set needed uniforms
    this.addUniform("size", new Vector4(1, 1, 0, 1));

    this.addTexture("texture1", "unfilterable-float"); //implement texture types

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

${this.getShaderTexturesSamplers(0)}
${this.getShaderUniforms(1)}

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
var color = textureLoad(texture1,   vec2<i32>(floor(uv*uniforms.size.xy)),0);

color.w =1.0;
     return color;
}
///////////////////////////////////////////////////////////
`;
  }
}
