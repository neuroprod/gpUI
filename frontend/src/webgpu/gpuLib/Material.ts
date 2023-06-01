import MathArray from "@math.gl/core/dist/classes/base/math-array";
import Shader from "./Shader";
import UniformGroup from "./UniformGroup";
import UniqueObject from "./UniqueObject";
import {BindGroup} from "./BindGroup";
import {TextureGroup} from "./TextureGroup";


export default class Material extends UniqueObject {


    pipeLine: GPURenderPipeline;
    shader: Shader;
    public bindGroups: Array<BindGroup> = []

    private device: GPUDevice;
    private bindGroupsLayouts: Array<GPUBindGroupLayout> = []// @group(0),group(1)
    private name: string;
    private presentationFormat: GPUTextureFormat
    private shaderUniforms: UniformGroup;
    private shaderTextures: TextureGroup;




    constructor(device: GPUDevice, name: string, shader: Shader, presentationFormat: GPUTextureFormat) {
        super();
        this.device = device;
        this.presentationFormat = presentationFormat;
        this.shader = shader;
        this.name = name;

        this.shaderTextures =this.shader.getTextureGroup()
        this.shaderUniforms = this.shader.getUniformGroup();

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
        if(this.shaderTextures)this.bindGroups.unshift( this.shaderTextures);
        let slot = 0;
        for (let data of this.bindGroups) {
            this.bindGroupsLayouts.push(data.bindGroupLayout)
            data.slot = slot;
            slot++
        }


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
                cullMode: 'back',
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

        this.shaderTextures.setTexture(texture,name)
    }

    setSampler(name: string, sampler: GPUSampler) {

        this.shaderTextures.setSampler(sampler,name)
    }
}
