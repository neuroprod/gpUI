attribute  vec3 aVertex;
attribute  vec3 aNormal;

varying vec3 vNormal;

uniform mat4 view;
uniform mat4 model;
uniform mat4 projection;

void main(void) {

    vNormal =mat3(model) *aNormal;
    vec3 inPos  = aVertex;
    gl_Position  =projection *view *model  *vec4(inPos, 1.0);

}
