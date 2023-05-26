import {pipeline} from "stream";

export default class Material
{
    vertexShader:GPUShaderModule;
    fragmentShader:GPUShaderModule;
    uniformBuffer:any
    pipeLine:any;
    uniformBindGroup:any
    constructor(device:GPUDevice,presentationFormat:any) {

    let frag =
        'struct Uniforms {'+
        '   color : vec4<f32>,'+
        '}'+
        '@binding(0) @group(0) var<uniform> uniforms : Uniforms;'+

        '@fragment\n'+
        'fn main() -> @location(0) vec4<f32> {\n'+
        'return uniforms.color;\n'+
        '}';

    let vert = 'struct VertexOutput {\n'+
    '@builtin(position) position : vec4<f32>\n'+
    '}\n'+
    '@vertex\n'+
    'fn main(\n'+
      '  @location(0) position : vec2<f32>\n'+
       ' ) -> VertexOutput {\n'+
      '  var output : VertexOutput;\n'+
     '   output.position = vec4( position,0.0,1.0);\n'+

    '    return output;\n'+
    '}\n';
    this.vertexShader =device.createShaderModule({
        code: vert,
    });
    this.fragmentShader =device.createShaderModule({
        code: frag,
    });

     this.pipeline = device.createRenderPipeline({
            layout: 'auto',
            vertex: {
                module: this.vertexShader,
                entryPoint: 'main',
                buffers: [
                    {
                        arrayStride: 2*4,
                        attributes: [
                            {
                                // position
                                shaderLocation: 0,
                                offset:0,
                                format: 'float32x2',
                            },
                        ],
                    },
                ],
            },
            fragment: {
                module: this.fragmentShader,
                entryPoint: 'main',
                targets: [
                    {
                        format: presentationFormat,
                    },
                ],
            },
            primitive: {
                topology: 'triangle-list',
            },
        });
        const uniformBufferSize = 4 * 4;
        this.uniformBuffer = device.createBuffer({
            size: uniformBufferSize,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        this.uniformBindGroup = device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this.uniformBuffer,
                    },
                },
            ],
        });
        let f =new Float32Array([1.0,0.6,0.0,1.0]);

        device.queue.writeBuffer(
            this.uniformBuffer,
            0,
            f.buffer,
            f.byteOffset,
            f.byteLength
        );
}




}
