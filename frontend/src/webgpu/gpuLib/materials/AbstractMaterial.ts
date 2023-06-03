import Shader from "../Shader";
import MathArray from "@math.gl/core/dist/classes/base/math-array";
import {BindGroup} from "../BindGroup";
import UniformGroup from "../UniformGroup";
import {TextureGroup} from "../TextureGroup";
import UniqueObject from "../UniqueObject";

export abstract class AbstractMaterial  extends UniqueObject {

    public pipeLine: GPURenderPipeline;
    public shader: Shader;
    public bindGroups: Array<BindGroup> = []
    protected device: GPUDevice;
    protected bindGroupsLayouts: Array<GPUBindGroupLayout> = []// @group(0),group(1)
    public label: string;
    private shaderUniforms: UniformGroup;
    private shaderTextures: TextureGroup;
    protected colorTargets:Array<GPUColorTargetState>=[]


    protected pipelineLayout: GPUPipelineLayout;
    constructor(device: GPUDevice, label: string, shader: Shader)
    {
        super();
        this.device =device;
        this.shader = shader;
        this.label = label;

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
    setTexture(name: string, texture: GPUTexture) {

        this.shaderTextures.setTexture(texture,name)
    }

    setSampler(name: string, sampler: GPUSampler) {

        this.shaderTextures.setSampler(sampler,name)
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


        this.pipelineLayout = this.device.createPipelineLayout({
            label: 'Material_pipelineLayout_' + this.label,
            bindGroupLayouts:
            this.bindGroupsLayouts
            ,
        });

        this.pipeLine = this.device.createRenderPipeline(this.getPipeLineDescriptor());

    }
    abstract getPipeLineDescriptor():GPURenderPipelineDescriptor



}
