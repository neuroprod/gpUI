attribute  vec3 aVertex;
attribute  vec2 aUV0;

varying vec2 vUv;

void main(void) {

    vec3 inPos  = aVertex;
    vUv =aUV0;
    gl_Position  = vec4(inPos,1.0);

}
