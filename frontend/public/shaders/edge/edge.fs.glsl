precision lowp float;

varying vec2 vUV;
uniform  sampler2D texture;

uniform vec2 screen;
uniform vec3 kernel[8];
uniform vec4 color;
void main() {
    vec2 step =1.0/screen;




    float t = texture2D(texture, vUV).x;


    float col =0.0;

    for (int i=0;i<8;i++)
    {
        vec3 uvOff = kernel[i];
        float tOff = texture2D(texture, vUV+step*uvOff.xy).x;
        if (abs(t-tOff)>0.0){
            col+=uvOff.z;
        }
    }

    col =min(col/2.0, 1.0)*color.w;

    gl_FragColor=vec4(color.xyz, col);


    gl_FragColor.xyz*=col;
}
