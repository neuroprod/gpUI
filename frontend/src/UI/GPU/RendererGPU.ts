import DrawBatch from "../draw/DrawBatch";

import DrawBatchGPU from "./DrawBatchGPU";
import UI_I from "../UI_I";
import FillBatchMaterial from "./FillBatchMaterial";
import {Matrix4} from "math.gl";
import FontTextureData from "../draw/FontTextureData";
import TextBatchMaterial from "./TextBatchMaterial";


export default class RendererGPU {
    private canvas: HTMLCanvasElement;
    private device: GPUDevice;
    private presentationFormat: GPUTextureFormat;
    private drawArray: Array<DrawBatchGPU> = []
    private drawBatches: Map<number, DrawBatchGPU> = new Map<number, DrawBatchGPU>();
    private fillBatchMaterial: FillBatchMaterial;
    private textBatchMaterial: TextBatchMaterial;
    private mvpBuffer: GPUBuffer;
    private mvpBufferData: Float32Array;
    private mvpBindGroupLayout: GPUBindGroupLayout;
    private mvpBindGroup: GPUBindGroup;
    private fontTexture: GPUTexture;
    private sampler: GPUSampler;
    private fontBindGroup: GPUBindGroup;
    private fontBindGroupLayout: GPUBindGroupLayout;

    constructor() {
    }

    init(device: GPUDevice, canvas: HTMLCanvasElement, presentationFormat: GPUTextureFormat) {

        this.canvas = canvas;
        this.device = device;
        this.presentationFormat = presentationFormat
        this.mvpBufferData =new Float32Array(16)
        this.mvpBuffer = this.device.createBuffer({
            label:"UI_mvpBuffer",
            size: 16*4,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        this.mvpBindGroupLayout =this.device.createBindGroupLayout({
            label:"UI_mvp_BindGroupLayout",
            entries: [{
                binding: 0,
                visibility:GPUShaderStage.VERTEX,
                buffer: {},
            }]
        });


        this.mvpBindGroup = this.device.createBindGroup({
            label : "UI_mvp_BindGroup",
            layout:  this.mvpBindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer:  this.mvpBuffer,
                    },
                },
            ],
        });


       this.fontTexture = this.device.createTexture({
            label:"UI_fontTexture",
            size: [FontTextureData.width, FontTextureData.height, 1],
            format: 'r8unorm',
            usage:
                GPUTextureUsage.TEXTURE_BINDING |
                GPUTextureUsage.COPY_DST |
                GPUTextureUsage.RENDER_ATTACHMENT,
        });
        this.device.queue.writeTexture(
            { texture:  this.fontTexture },
            FontTextureData.getData(),
            { bytesPerRow: FontTextureData.width  },
            [FontTextureData.width, FontTextureData.height]
        );
       this.sampler = device.createSampler({
            magFilter: 'linear',
            minFilter: 'linear',
        });
        this.fontBindGroupLayout =this.device.createBindGroupLayout({
            label:"UI_font_BindGroupLayout",
            entries: [{
                binding: 0,
                visibility:GPUShaderStage.FRAGMENT,
                sampler: {},
            },{
                binding: 1,
                visibility:GPUShaderStage.FRAGMENT,
                texture: {},
            }]
        });
        this.fontBindGroup = device.createBindGroup({
            layout:   this.fontBindGroupLayout ,
            entries: [
                {
                    binding: 0,
                    resource: this.sampler,
                },
                {
                    binding: 1,
                    resource: this.fontTexture.createView(),
                },
            ],
        });

        this.fillBatchMaterial = new FillBatchMaterial(device, presentationFormat,   this.mvpBindGroupLayout)
        this.textBatchMaterial = new TextBatchMaterial(device, presentationFormat,   this.mvpBindGroupLayout, this.fontBindGroupLayout)
        /*this.fillRenderer = new FillRenderer(gl);
        this.textRenderer = new TextRenderer(gl);
        this.textureRenderer = new TextureRenderer(gl);*/
    }
    delete(id: number) {
        if (this.drawBatches.has(id)) {
            let drawBatch = this.drawBatches.get(id)
            drawBatch.destroy();
            this.drawBatches.delete(id);
            console.log("delete")
        }
    }
    setDrawBatches(drawBatches: Array<DrawBatch>) {
        this.setProjection()
        for (let a of this.drawArray) {
            a.useThisUpdate = false;
        }


        let tempArr = []
        for (let batch of drawBatches) {
            let id = batch.id;
            if (this.drawBatches.has(id)) {
                let drawBatch = this.drawBatches.get(id)
                if (batch.isDirty) {
                    drawBatch.setBatchData(batch)
                }
                drawBatch.useThisUpdate = true
                tempArr.push(drawBatch)
            } else {

                let drawBatch = new DrawBatchGPU(batch.id, this.device)
                drawBatch.setBatchData(batch)
                this.drawBatches.set(batch.id, drawBatch)
                drawBatch.useThisUpdate = true
                tempArr.push(drawBatch)

            }

            batch.isDirty = false;
        }
        for (let a of this.drawArray) {
            if (!a.useThisUpdate) {
                a.destroy()

                this.drawBatches.delete(a.id);

            }
        }

        this.drawArray = tempArr

    }

    draw(passEncoder: GPURenderPassEncoder) {
        UI_I.numDrawCalls = 0


        let vpSize = UI_I.screenSize;

        //this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

        for (let batch of this.drawArray) {

            if (batch.fillBatchGPU.numIndices > 0) {
                passEncoder.setPipeline(this.fillBatchMaterial.pipeLine);
                passEncoder.setBindGroup(0,  this.mvpBindGroup);

                passEncoder.setVertexBuffer(0, batch.fillBatchGPU.vertexBuffer)
                passEncoder.setIndexBuffer(batch.fillBatchGPU.indexBuffer, 'uint16');
                passEncoder.drawIndexed(batch.fillBatchGPU.numIndices, 1, 0, 0);
            }
            if (batch.textBatchGPU.numIndices > 0) {
                passEncoder.setPipeline(this.textBatchMaterial.pipeLine);
                passEncoder.setBindGroup(0,  this.mvpBindGroup);
                passEncoder.setBindGroup(1,  this.fontBindGroup);
                passEncoder.setVertexBuffer(0, batch.textBatchGPU.vertexBuffer)
                passEncoder.setIndexBuffer(batch.textBatchGPU.indexBuffer, 'uint16');
                passEncoder.drawIndexed(batch.textBatchGPU.numIndices, 1, 0, 0);
            }
        }
    }

    private setProjection() {
        let m =new Matrix4()
        m.ortho({left:0,right:this.canvas.width,top:0,bottom:this.canvas.height,far:1,near:-1});
        this.mvpBufferData.set(m,0)
        this.device.queue.writeBuffer(
            this.mvpBuffer,
            0,
            this.mvpBufferData.buffer,
            this.mvpBufferData.byteOffset,
            this.mvpBufferData.byteLength
        );


    }
}
