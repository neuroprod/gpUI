/* eslint-disable */
import {mat4, vec3, vec4, vec2} from "gl-matrix"

export default class Ray {
    constructor()
    {

        this.rayOrigin = vec3.create();
        this.rayDir = vec3.create();
    }
    setRay(camPos, camProjection,camView,uv)
    {

        this.rayOrigin =camPos;
        let tempMatrix =mat4.create();
        mat4.invert(tempMatrix,camProjection);



        let tempVec = vec4.fromValues(uv[0],uv[1],1,1);
        vec4.transformMat4(tempVec,tempVec,tempMatrix)

        tempVec[2] =-1;
        tempVec[3] = 0;

        mat4.invert(tempMatrix,camView);
        vec4.transformMat4(tempVec,tempVec,tempMatrix)

        this.rayDir=vec3.fromValues( tempVec[0],tempVec[1],tempVec[2]);


        vec3.normalize(   this.rayDir, this.rayDir);

    }
    intersectPlane(n, p0) {

        let pos =vec3.create();
        let denom = vec3.dot(n, this.rayDir);

        if (denom > 1e-6) {
            let sub =vec3.create();
            vec3.subtract(sub, this.rayOrigin,p0);
            let t =vec3.dot(sub, n)/denom;
            let scale=vec3.create();
            vec3.scale(scale,this.rayDir,-t)

            vec3.add(pos,scale,this.rayOrigin );

        }
        return pos;
    }
}
