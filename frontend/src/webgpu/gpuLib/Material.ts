import MathArray from "@math.gl/core/dist/classes/base/math-array";
import Shader from "./Shader";
import UniformGroup from "./UniformGroup";
import UniqueObject from "./UniqueObject";
import {BindGroup} from "./BindGroup";


export default class Material extends UniqueObject {


    pipeLine: GPURenderPipeline;
    shader: Shader;
    public bindGroups: Array<BindGroup> = []
    texture: GPUTexture;
    private device: GPUDevice;
    private bindGroupsLayouts: Array<GPUBindGroupLayout> = []// @group(0),group(1)
    private name: string;
    private presentationFormat: GPUTextureFormat
    private shaderUniforms: UniformGroup;
    private sampler: GPUSampler;
    private textureBG: BindGroup;


    constructor(device: GPUDevice, name: string, shader: Shader, presentationFormat: GPUTextureFormat) {
        super();
        this.device = device;
        this.presentationFormat = presentationFormat;
        this.shader = shader;
        this.name = name;


        this.shaderUniforms = this.shader.getUniformGroup();

    }

    test() {
        if (this.texture) {

            this.textureBG = new BindGroup(this.device, this.name + "TextureBindGroup")

            this.textureBG.bindGroupLayout = this.device.createBindGroupLayout({
                label: "testTextureLayout",
                entries: [{
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {}
                },
                    {
                        binding: 1,
                        visibility: GPUShaderStage.FRAGMENT,
                        texture: {}
                    }]
            });

            this.textureBG.bindGroup = this.device.createBindGroup({
                label: "testTextureBindgroup",
                layout:   this.textureBG.bindGroupLayout,
                entries: [
                    {
                        binding: 0,
                        resource: this.sampler,
                    },
                    {
                        binding: 1,
                        resource: this.texture.createView(),
                    },
                ],
            });

        }
    }

    setUniform(name: string, value: MathArray | number) {
        for (let f of this.shaderUniforms.uniforms) {
            if (f.name == name) {
                if (typeof f.defaultValue == "number" && typeof value == "number") {
                    this.shaderUniforms.bufferData[f.offset] = value
                } else if (typeof value != "number") {
                    this.shaderUniforms.bufferData.set(value, f.offset)
                }

                break;
            }
        }
        this.shaderUniforms.isDirty = true;

    }

    addUniformGroup(data: UniformGroup) {
        for (let udata of this.bindGroups) {
            if (udata.typeID == data.typeID) return;
        }
        this.bindGroups.push(data);

    }

    makePipeLine() {
        if (this.pipeLine) return;
        if (this.shaderUniforms) this.bindGroups.unshift(this.shaderUniforms)
        if(this.textureBG)this.bindGroups.unshift(  this.textureBG);
        let slot = 0;
        if (this.texture) slot = 1;
        for (let data of this.bindGroups) {
            this.bindGroupsLayouts.push(data.bindGroupLayout)
            data.slot = slot;
            slot++
        }
console.log(this.bindGroups)

        const pipelineLayout = this.device.createPipelineLayout({
            label: 'Material_pipelineLayout_' + this.name,
            bindGroupLayouts:
            this.bindGroupsLayouts
            ,
        });

        this.pipeLine = this.device.createRenderPipeline({
            label: "Material_pipeLine" + this.name,
            layout: pipelineLayout,
            vertex: {
                module: this.shader.shader,
                entryPoint: 'mainVertex',
                buffers: this.shader.getVertexBufferLayout()
                ,
            },
            fragment: {
                module: this.shader.shader,
                entryPoint: 'mainFragment',
                targets: [
                    {
                        format: this.presentationFormat,

                    },
                ],
            },
            primitive: {
                topology: 'triangle-list',
            },
            depthStencil: {
                depthWriteEnabled: true,
                depthCompare: 'less',

                format: 'depth24plus',
            },
            multisample: {
                count: 4,
            },
        });

    }


    setTexture(name: string, texture: GPUTexture) {
        this.texture = texture;
    }

    setSampler(name: string, sampler: GPUSampler) {
        this.sampler = sampler;
    }
}
