import MathArray from "@math.gl/core/dist/classes/base/math-array";
import { Matrix4, NumericArray, Vector4 } from "math.gl";

export enum UniformType{
    float,
    vec4,
    mat4,

}

export default class UniformShaderData
{
    public name:string;
    public type:UniformType
    public defaultValue: MathArray|number
    public size =1;
    public offset=0;

    constructor(name: string, value: MathArray| number) {

        this.name =name;
       
        if( typeof value =="number" ){
            this.defaultValue =value;
            //[value];
            this.type =UniformType.float;
            this.size =1;
        }else {
            if(value.length==1){
                this.type =UniformType.float;
                this.size =1;
            }
            if(value.length==4){
                this.type =UniformType.vec4;
                this.size =4;
            }else{
                this.type =UniformType.mat4;
                this.size =16;
            }
            this.defaultValue =value ;
        }
    }

    cloneValue()
    {
        if(typeof this.defaultValue =="number")return this.defaultValue
        return this.defaultValue.clone()

        //return  new this.defaultValue.constructor().copy(this.defaultValue);
    
    }

}
