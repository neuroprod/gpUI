struct VertexOutput
{
    @builtin(position) position : vec4<f32>
}


struct Camera
{
    viewProjection : mat4x4 <f32>,
    cameraWorld : vec3<f32>,
}
@group(0) @binding(0)  var<uniform> camera : Camera;
@group(1) @binding(0)  var<uniform> worldMatrix  : mat4x4 <f32>;

@vertex
fn mainVertex(
    @location(0) position : vec3<f32>
    ) -> VertexOutput
{
    var output : VertexOutput;
    output.position =camera.viewProjection*worldMatrix* vec4( position,1.0);
    return output;
}


@fragment
fn mainFragment() -> @location(0) vec4<f32>
{
    return vec4<f32>(1.0,0.0,0.0,1.0);
}
