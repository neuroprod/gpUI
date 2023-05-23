precision lowp float;


varying vec3 vNormal;
uniform vec3 lightDir;
uniform vec4 color;
void main() {
    float l =dot(vNormal,lightDir)*0.5+0.5;
    l*=0.9;
    l+=0.1;
    gl_FragColor = vec4(l*color.xyz,1.0);
}
