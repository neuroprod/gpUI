import Shader from "../Shader";
import { Vector4 } from "math.gl";
import Camera from "../Camera";

export default class CombineShader extends Shader {
  constructor(device: GPUDevice) {
    super(device, "CombineShader");

    //set needed atributes
    this.addAttribute("position", 3);
    this.addAttribute("uv0", 2);
    //set needed uniforms
    this.addUniform("size", new Vector4(1, 1, 0, 1));

    this.addTexture("ao", "unfilterable-float");
    this.addTexture("albedo", "unfilterable-float");
    this.addTexture("normal", "unfilterable-float");
    this.addTexture("light", "unfilterable-float");
    this.addTexture("positionTexture", "unfilterable-float");
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
${Camera.getShaderUniforms(2)}
const m1 = mat3x3f(
    0.59719, 0.07600, 0.02840,
    0.35458, 0.90834, 0.13383,
    0.04823, 0.01566, 0.83777
    );
const m2 = mat3x3f(
    1.60475, -0.10208, -0.00327,
    -0.53108,  1.10813, -0.07276,
    -0.07367, -0.00605,  1.07602
    );
fn acestonemap( color:vec3f)->vec3f{
  
    let v = m1 * color;
    let a = v * (v + 0.0245786) - 0.000090537;
    let b = v * (0.983729 * v + 0.4329510) + 0.238081;
    let r=m2 * (a / b);
    return pow(clamp(r, vec3f(0.0), vec3f(1.0)), vec3f(1. / 2.2));
}


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
    let uvS =  vec2<i32>(floor(uv*uniforms.size.xy));
      let uvSH =  vec2<i32>(floor(uv*uniforms.size.xy*0.5));
    let ao = textureLoad(ao, uvSH,0).x;
    var l = textureLoad(light, uvS,0).xyz;
    let alb =textureLoad(albedo, uvS,0);
    let worldPos =textureLoad(positionTexture, uvS,0).xyz;
    var color =pow( alb.xyz,vec3f(2.2));;
    let N = textureLoad(normal,  uvS,0).xyz;
    let tempLight =(dot(N,vec3f(0.0,1.0,0.0))*0.5+0.5)*0.07+0.02 ;
    color*=vec3f((ao)*tempLight);
    color+=max(l,vec3f(0.0));
    color+= alb.xyz*alb.w*5.0;
     
    color =acestonemap(color);
    // color -=vec3f(1.0);
    var distance =distance(camera.cameraWorld ,worldPos);
    distance  =smoothstep(4.5,5.5,distance);
    return  vec4(color,distance);
}
///////////////////////////////////////////////////////////
`;
  }
}
