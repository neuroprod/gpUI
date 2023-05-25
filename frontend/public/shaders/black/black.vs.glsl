attribute  vec3 aVertex;



uniform mat4 view;
uniform mat4 model;
uniform mat4 projection;

void main(void) {


    vec3 inPos  = aVertex;
    gl_Position  =projection *view *model  *vec4(inPos,1.0);

}
