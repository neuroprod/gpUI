import Shader from "../Shader";
import {Vector2, Vector4} from "math.gl";

export default class DofBlurShader extends Shader {
  private horizontal: boolean;
  constructor(device: GPUDevice,horizontal:boolean=true) {
    super(device, "dofBlurShader");
    this.horizontal =horizontal;
    //set needed atributes
    this.addAttribute("position", 3);
    this.addAttribute("uv0", 2);
    //set needed uniforms
    this.addUniform("size", new Vector2(1, 1));
    this.addUniform("steps",6);
    this.addUniform("extra",0);
    this.addTexture("texture1", "unfilterable-float"); //implement texture types

    this.makeShaders();
  }
  getDir():string
  {
    if(this.horizontal)return "1,0";
    return "0,1"
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
    let uvPos =vec2<i32>(floor(uv*uniforms.size.xy ));
    let rC =textureLoad(texture1,  uvPos,0);
   /* if(rC.w<0.001){
        return rC; //this is faster if there is not to much blur
    }*/
 
    var color =vec3f(0.0);
    var div =0.0;
    var w = 0.0;
    
    let base = rC.xyz;
    let m = rC.w;
    let dir =vec2<i32>(${this.getDir()});
    let step =i32 (round(uniforms.steps/2));
    for(var i=-step;i<(step+1);i+=1)
    {
        
            let uv =uvPos+dir*i;
            let r =textureLoad(texture1,   uv,0);

            color+=r.xyz *r.w;
            div+=r.w;
        
    }

 
    color/=div;
    color = clamp(color,vec3f(0.0),vec3f(1.0));
    let b =base*(1.0-m) +color*(m);

     return vec4(b,rC.w);
}
///////////////////////////////////////////////////////////
`;
  }
}
