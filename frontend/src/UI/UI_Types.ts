import {Vector2, Vector3, Vector4} from "math.gl";

export  type UI_VEC2  = Vector2;

export function getUI_VEC2(){
    return new Vector2();
}
export function isUI_VEC2(val:any){
    return typeof val;
}
export type UI_VEC3 =Vector3;
export type UI_VEC4 =Vector4;
