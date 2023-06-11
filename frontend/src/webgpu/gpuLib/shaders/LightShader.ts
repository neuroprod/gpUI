import Shader from "../Shader";
import Camera from "../Camera";
import Transform from "../Transform";
import { Vector2, Vector4 } from "math.gl";

export default class LightShader extends Shader {
  constructor(device: GPUDevice) {
    super(device, "LightShader");

    this.addAttribute("position", 3);

    this.addUniform("color", new Vector4(20, 10, 1, 1));
    this.addUniform("lightPos", new Vector4(1, 1, 1, 1));
    this.addUniform("size", new Vector2(1, 1));
    this.addUniform("extra", new Vector2(1, 1));
    this.addTexture("textureNormal", "unfilterable-float");
    this.addTexture("texturePosition", "unfilterable-float");
    this.addTexture("textureAlbedo", "unfilterable-float");

    this.makeShaders();
  }

  getShader(): string {
    return /* wgsl */ `
///////////////////////////////////////////////////////////      
struct VertexOutput
{
    @builtin(position) position : vec4f,
    @location(0) uvScreen: vec2f,  
}
${this.getShaderTexturesSamplers(0)}
${this.getShaderUniforms(1)}
${Camera.getShaderUniforms(2)}
${Transform.getShaderUniforms(3)}

const PI = 3.14159265359;

fn fresnelSchlick(cosTheta:f32, F0:vec3f)-> vec3f
{
    return F0 + (1.0 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
}
fn DistributionGGX( N:vec3f,  H:vec3f,  roughness:f32)-> f32
{
    let a      = roughness*roughness;
    let a2     = a*a;
    let NdotH  = max(dot(N, H), 0.0);
    let NdotH2 = NdotH*NdotH;

    let num   = a2;
    var denom = (NdotH2 * (a2 - 1.0) + 1.0);
    denom = PI * denom * denom;

    return num / denom;
}
fn GeometrySmith( N:vec3f,  V:vec3f,  L:vec3f, roughness:f32)-> f32
{
    let NdotV = max(dot(N, V), 0.0);
    let NdotL = max(dot(N, L), 0.0);
    let ggx2  = GeometrySchlickGGX(NdotV, roughness);
    let ggx1  = GeometrySchlickGGX(NdotL, roughness);

    return ggx1 * ggx2;
}
fn GeometrySchlickGGX(NdotV:f32,  roughness:f32)-> f32
{
    let r = (roughness + 1.0);
    let k = (r*r) / 8.0;

    let num   = NdotV;
    let denom = NdotV * (1.0 - k) + k;

    return num / denom;
}




@vertex
fn mainVertex( ${this.getShaderAttributes()} ) -> VertexOutput
{
    var output : VertexOutput;
    var proj = camera.viewProjection*transform.worldMatrix* vec4( position,1.0);
    
    output.position =proj;
    output.uvScreen =((proj.xy/proj.w)*0.5)+0.5;
    output.uvScreen.y =1.0-output.uvScreen.y;
    
    return output;
}


@fragment
fn mainFragment(@location(0) uvScreen: vec2f) -> @location(0) vec4f
{
    let roughness =0.5;
    let uvPos = vec2<i32>(floor(uvScreen*uniforms.size.xy));
     let position=textureLoad(texturePosition,  uvPos ,0).xyz;
      if(position.x>1000.0){return  vec4f(0.0);}
    let fragDist = distance(position,uniforms.lightPos.xyz);
    if(fragDist>1.0){
        return vec4f(0.0);
    }
 
    let albedo=pow(textureLoad(textureAlbedo,   uvPos ,0).xyz,vec3f(2.2));
    let N=textureLoad(textureNormal,  uvPos ,0).xyz*2.0-1.0;
    
    let F0 = vec3f(0.04);
  
    let V = normalize(camera.cameraWorld - position);   
    let L = normalize(uniforms.lightPos.xyz - position);
    let H = normalize(V + L);
    let NdotV = max(0.0, dot(N, V));
    let attenuation =pow(1.0-fragDist,2.0);
    let radiance =uniforms.color.xyz  * attenuation;

    let NDF = DistributionGGX(N, H, roughness);
    let G   = GeometrySmith(N, V, L, roughness);
    let F    = fresnelSchlick(max(dot(H, V), 0.0), F0);

    let kS = F;
    let kD = vec3(1.0) - kS;
      

    let numerator    = NDF * G * F;
    let denominator = 4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0) + 0.0001;
    let specular     = numerator / denominator;

       
    let NdotL = max(dot(N, L), 0.0);
    var color= (kD * albedo / PI + specular) * radiance * NdotL;


    return vec4f(color,1.0);
}
///////////////////////////////////////////////////////////
`;
  }
}
