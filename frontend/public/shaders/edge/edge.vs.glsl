attribute  vec3 aVertex;
attribute  vec2 aUV0;


varying vec2 vUV;
void main(void) {


    vec3 inPos  = aVertex;
    gl_Position  =vec4(inPos,1.0);
    vUV =aUV0;
}
