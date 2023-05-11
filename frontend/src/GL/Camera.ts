import {mat4, vec3} from "gl-matrix";

export default class Camera {

    constructor(glMain) {
        this.glMain = glMain;

        // this.glMain.regResize(this.resize.bind(this));

        this.viewMatrix = mat4.create();

        this.eye = vec3.fromValues(0, 0, 0);
        this.target = vec3.fromValues(0, 0, 0);
        this.up = vec3.fromValues(0, 1, 0);
        this.fov = 1.0;
        this.distance = 12;

        this.perspectiveMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        this.scrollPos =0;
        this.realScrollPos =0;
        this.posX =0;
        this.posY =0;
        this.update();

    }
    update(introPageValue) {



        this.scrollPos =- (this.realScrollPos-0.5 )*30 -15*0.3333;


       let screenHeight =10;
        let screenWidth=screenHeight*this.glMain.ratio;

        let targetPosX = this.glMain.uiListener.mousePos.x/this.glMain.viewportWidth;
        targetPosX = (targetPosX-0.5)*-4*(1-introPageValue);

        let targetPosY =this.glMain.uiListener.mousePos.y/this.glMain.viewportHeight;
        targetPosY = (targetPosY-0.5)*-4*(1-introPageValue);
        if(!isNaN(targetPosY)){
        this.posX +=(targetPosX-this.posX)/80;
            this.posY +=(targetPosY-this.posY)/80;
        }

        this.eye[0] = this.posX*2;
        this.eye[1] =this.posY*2+this.scrollPos//-(Math.pow(introPageValue,2))*5;
        this.eye[2] = this.distance +(introPageValue)*20;


        this.target[0] = this.eye[0] ;
        this.target[1] =this.eye[1];
        this.target[2] = (introPageValue)*20;

        mat4.lookAt(this.viewMatrix, this.eye, this.target, this.up);

        let halfAngle = Math.atan2(screenHeight  / 2, this.distance );
        this.fov =halfAngle*2;
        let lensShiftX = - this.eye[0] / (screenWidth / 2);
        let lensShiftY = - (this.eye[1]-this.scrollPos) / (screenHeight / 2);
        mat4.lookAt(this.viewMatrix, this.eye, this.target, this.up);
        mat4.perspective(this.perspectiveMatrix, this.fov,this.glMain.ratio, 0.01, 100);
        this.setProjection(this.fov,this.glMain.ratio, 0.01, 50,lensShiftX,lensShiftY);
    }
    lerp(value1, value2, amount) {

        return value1 + (value2 - value1) * amount;
    }
    setProjection(fov,ratio,nearClip,farClip,lensShiftX=0,lensShiftY=0)
    {
       let  mFrustumTop		=  nearClip * Math.tan( fov * 0.5);
        let mFrustumBottom	= -mFrustumTop;
        let mFrustumRight	=  mFrustumTop * ratio;
        let mFrustumLeft	= -mFrustumRight;



        if( lensShiftY != 0.0 ) {

        mFrustumTop = this.lerp(0.0, 2.0 * mFrustumTop, 0.5 + 0.5 * lensShiftY);
        mFrustumBottom = this.lerp(2.0 * mFrustumBottom, 0.0, 0.5 + 0.5 * lensShiftY);
    }

        if( lensShiftX != 0.0 ) {
        mFrustumRight = this.lerp(2.0 * mFrustumRight, 0.0, 0.5 - 0.5 * lensShiftX);
        mFrustumLeft = this.lerp(0.0, 2.0 * mFrustumLeft, 0.5 - 0.5 * lensShiftX);
    }

        this.perspectiveMatrix[0] =  2.0 * nearClip / ( mFrustumRight - mFrustumLeft );
        this.perspectiveMatrix[4]  =  0.0;
        this.perspectiveMatrix[8]  =  ( mFrustumRight + mFrustumLeft ) / ( mFrustumRight - mFrustumLeft );
        this.perspectiveMatrix[12]  =  0.0;

        this.perspectiveMatrix[1] =  0.0;
        this.perspectiveMatrix[5] =  2.0 * nearClip / ( mFrustumTop - mFrustumBottom );
        this.perspectiveMatrix[9] =  ( mFrustumTop + mFrustumBottom ) / ( mFrustumTop - mFrustumBottom );
        this.perspectiveMatrix[13]  =  0.0;

        this.perspectiveMatrix[2] =  0.0;
        this.perspectiveMatrix[6] =  0.0;
        this.perspectiveMatrix[10] = -( farClip + nearClip ) / ( farClip - nearClip );
        this.perspectiveMatrix[14]  = -2.0 * farClip * nearClip / ( farClip - nearClip );

        this.perspectiveMatrix[3] =  0.0;
        this.perspectiveMatrix[7]  =  0.0;
        this.perspectiveMatrix[11]  = -1.0;
        this.perspectiveMatrix[15]  =  0.0;


    }
}
