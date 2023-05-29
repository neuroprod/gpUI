import {Model} from "./Model";

;

export default class RenderPass {
    renderPassDescriptor: GPURenderPassDescriptor
    width: number = 1;
    height: number = 1;
    presentationFormat: GPUTextureFormat;
    private texture: GPUTexture;
    private depthTexture: GPUTexture;
    private models: Array<Model> = []
    private sharedBuffer: GPUBuffer;
    private device: GPUDevice;

    constructor(device: GPUDevice, presentationFormat: GPUTextureFormat) {
        this.device = device
        this.presentationFormat = presentationFormat
    }

    public updateTexture(width: number, height: number, context: GPUCanvasContext) {


        if (width != this.width || height != this.height) {
            this.width = width;
            this.height = height;

            if (this.depthTexture) this.depthTexture.destroy()
            this.depthTexture = this.device.createTexture({
                size: [width, height],
                format: 'depth24plus',
                sampleCount:4,
                usage: GPUTextureUsage.RENDER_ATTACHMENT,
            });

            if (this.texture) this.texture.destroy()
            this.texture = this.device.createTexture({
                size: [width, height],
                sampleCount:4,
                format: this.presentationFormat,
                usage: GPUTextureUsage.RENDER_ATTACHMENT,
            });


        }

        this.renderPassDescriptor = {
            colorAttachments: [
                {
                    view: this.texture.createView(),
                    resolveTarget: context.getCurrentTexture().createView(),
                    clearValue: {r: 0.5, g: 0.5, b: 0.5, a: 1.0},
                    loadOp: 'clear',
                    storeOp: 'store',
                },
            ],
            depthStencilAttachment: {
                view: this.depthTexture.createView(),

                depthClearValue: 1.0,
                depthLoadOp: 'clear',
                depthStoreOp: 'store',
            },
        };


    }

    draw(commandEncoder: GPUCommandEncoder) {

        const passEncoder = commandEncoder.beginRenderPass(this.renderPassDescriptor);
        let pipelineID = -1;
        let bufferArray;
        for (let model of this.models) {

            if (model.material.uID !== pipelineID) {
                pipelineID = model.material.uID
                bufferArray = new Array(model.material.bindGroups.length).fill(-1);
                passEncoder.setPipeline(model.material.pipeLine);


            }
       let count =0
            for (let uniforms of model.material.bindGroups) {
                if (uniforms.getAtModel) {
                    uniforms = model.transform
                }
                if (bufferArray[count] != uniforms.uID) {
                    bufferArray[count] = uniforms.uID

                    passEncoder.setBindGroup(count, uniforms.bindGroup);

                }
                count++;
            }
            for(let attribute of model.material.shader.attributes)
            {
                passEncoder.setVertexBuffer(attribute.slot, model.mesh.getBufferByName(attribute.name))
            }

            if(model.mesh.hasIndices){
                passEncoder.setIndexBuffer( model.mesh.indexBuffer, 'uint16');
                passEncoder.drawIndexed(model.mesh.numIndices,1,0,0);
            }else{
                passEncoder.draw(model.mesh.numVertices, 1, 0, 0);
            }


        }
        passEncoder.end();
    }

    add(model: Model) {
        this.models.push(model)

    }

    setBuffer(buffer: GPUBuffer) {
        this.sharedBuffer = buffer;
    }
}
