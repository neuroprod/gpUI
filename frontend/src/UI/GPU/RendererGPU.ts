
import DrawBatch from "../draw/DrawBatch";

import DrawBatchGPU from "./DrawBatchGPU";
import UI_I from "../UI_I";
import FillBatchMaterial from "./FillBatchMaterial";


export default class RendererGPU{
    private canvas: HTMLCanvasElement;
    private device: GPUDevice;
    private presentationFormat: GPUTextureFormat;
    private drawArray: Array<DrawBatchGPU>=[]
    private drawBatches: Map<number, DrawBatchGPU> = new Map<number, DrawBatchGPU>();
    private fillBatchMaterial: FillBatchMaterial;
    constructor() {
    }
    init(device:GPUDevice,canvas:HTMLCanvasElement,presentationFormat:GPUTextureFormat) {

        this.canvas = canvas;
        this.device = device;
        this.presentationFormat = presentationFormat

        this.fillBatchMaterial = new FillBatchMaterial(device,presentationFormat)
        /*this.fillRenderer = new FillRenderer(gl);
        this.textRenderer = new TextRenderer(gl);
        this.textureRenderer = new TextureRenderer(gl);*/
    }

    setDrawBatches(drawBatches: Array<DrawBatch>) {

        for(let a of this.drawArray)
        {
            a.useThisUpdate =false;
        }



        let tempArr =[]
        for (let batch of drawBatches) {
            let id = batch.id;
            if (this.drawBatches.has(id)) {
                let drawBatch = this.drawBatches.get(id)
                if (batch.isDirty) {
                    drawBatch.setBatchData(batch)
                }
                drawBatch.useThisUpdate =true
                tempArr.push(drawBatch)
            } else {

                let drawBatch = new DrawBatchGPU(batch.id, this.device)
                drawBatch.setBatchData(batch)
                this.drawBatches.set(batch.id, drawBatch)
                drawBatch.useThisUpdate =true
                tempArr.push(drawBatch)

            }

            batch.isDirty = false;
        }
        for(let a of this.drawArray)
        {
            if(!a.useThisUpdate)
            {
                a.destroy()
                this.drawBatches.delete(a.id);

            }
        }

        this.drawArray =tempArr

    }

    draw(passEncoder: GPURenderPassEncoder) {
        UI_I.numDrawCalls =0


        let vpSize = UI_I.screenSize;

        //this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

        for (let batch of this.drawArray) {

            /*
            passEncoder.setPipeline(model.material.pipeLine);
            passEncoder.setBindGroup(0, uniforms.bindGroup);
            passEncoder.setVertexBuffer(attribute.slot, model.mesh.getBufferByName(attribute.name))
            passEncoder.setIndexBuffer( model.mesh.indexBuffer, 'uint16');
            passEncoder.drawIndexed(model.mesh.numIndices,1,0,0);
            */
        }
    }
}
