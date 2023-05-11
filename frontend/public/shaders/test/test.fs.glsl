precision lowp float;

uniform vec4 tl;
uniform vec4 tr;
uniform vec4 bl;
uniform vec4 br;
uniform vec2 size;
varying vec2 vUv;
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}


void main() {
    vec2 uv =vUv;

    float grid= mod(dot(vec2(1.0), step(vec2(0.5), fract(uv * (size/vec2(10.0,10.0))))), 2.0);
    grid =grid*0.2+0.8;
    vec4 colorT = mix(tr,tl,uv.x);
    vec4 colorV = mix(br,bl,uv.x);
    vec4 color = mix(colorT,colorV,uv.y);
    vec3 rgb =hsv2rgb(color.xyz);
    vec3 result =mix(vec3 (grid),rgb,color.a);
    gl_FragColor = vec4(result,1.0);
}
