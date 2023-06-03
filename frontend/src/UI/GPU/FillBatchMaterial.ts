

export default class FillBatchMaterial{
    private device: GPUDevice;
    private shader: GPUShaderModule;
    public pipeLine:GPURenderPipeline;

    constructor(device: GPUDevice, presentationFormat: GPUTextureFormat, mvpBindGroupLayout: GPUBindGroupLayout)
    {
        this.device = device;

        this.shader = this.device.createShaderModule({
            label:"UI_Shader_FillBatchMaterial",
            code: this.getShader(),
        });
        const pipelineLayout = this.device.createPipelineLayout({
            label: 'UI_PipelineLayout_FillBatchMaterial' ,
            bindGroupLayouts:[mvpBindGroupLayout],
        });

        this.pipeLine = this.device.createRenderPipeline({
            label:  'UI_Pipeline_FillBatchMaterial',
            layout: pipelineLayout,
            vertex: {
                module: this.shader,
                entryPoint: 'mainVertex',
                buffers: [
                    {
                      arrayStride: 24,
                      attributes: [
                        {
                          // position
                          shaderLocation: 0,
                          offset: 0,
                          format: 'float32x2',
                        },
                        {
                          // color
                          shaderLocation: 1,
                          offset: 8,
                          format: 'float32x4',
                        },
                      ],
                    },
                  ]
                ,
            },
            fragment: {
                module: this.shader,
                entryPoint: 'mainFragment',
                targets: [
                    {
                        format: presentationFormat,
                        blend: {
                            color: {
                                srcFactor: 'one',
                                dstFactor: 'one-minus-src-alpha',
                                operation: 'add',
                            },
                             alpha: {
                                 srcFactor: 'one',
                                 dstFactor: 'one-minus-src-alpha',
                                 operation: 'add',
                             },
                        },
                    },
                ],
            },
            primitive: {
                topology: 'triangle-list',
            },

           /* depthStencil: {
                depthWriteEnabled: false,
                depthCompare: 'less',

                format: 'depth24plus',
            },*/
            multisample: {
                count: 4,
            },
        });

    }

    getShader()
    {
        return /* wgsl */`
///////////////////////////////////////////////////////////      
struct VertexOutput{
    @builtin(position) position : vec4f,
    @location(0) color : vec4f,
}

@group(0) @binding(0) var<uniform> mvp :  mat4x4 <f32>;
@vertex
fn mainVertex( 
    @location(0) position : vec2f,
    @location(1) color : vec4f, 
) -> VertexOutput
{
    var output : VertexOutput;
    output.position = mvp*vec4( position,0.0,1.0);

    output.color =color;

    return output;
}


@fragment
fn mainFragment(
    @location(0) color: vec4f,
) -> @location(0) vec4f
{
     return vec4f(color.xyz*color.w,color.w);
}
///////////////////////////////////////////////////////////
`;


    }


}
