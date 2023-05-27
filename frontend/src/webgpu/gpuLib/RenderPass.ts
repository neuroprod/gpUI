import {Model} from "./Model";
;

export default class RenderPass {
    renderPassDescriptor: GPURenderPassDescriptor
    private texture: GPUTexture;
    private models: Array<Model>=[]
    private sharedBuffer: GPUBuffer;

    constructor(target: GPUTexture) {
        this.updateTexture(target);
    }

    public updateTexture(target: GPUTexture) {
        this.texture = target;
        this.renderPassDescriptor = {
            colorAttachments: [
                {
                    view: target.createView(),
                    clearValue: {r: 0.5, g: 0.5, b: 0.5, a: 1.0},
                    loadOp: 'clear',
                    storeOp: 'store',
                },
            ],
        };
    }

    draw(commandEncoder: GPUCommandEncoder) {

        const passEncoder = commandEncoder.beginRenderPass(this.renderPassDescriptor);
        let pipelineID=-1;
        let  bufferArray;
        for(let model of this.models){

            if(model.material.uID !== pipelineID) {
                pipelineID =model.material.uID
                bufferArray= new Array(model.material.uniformData.length).fill(-1);
                passEncoder.setPipeline(model.material.pipeLine);


            }
            let count =0;
            for(let uniforms of  model.material.uniformData) {
                if(uniforms.getAtModel){
                    uniforms =model.transform
                }
                if(bufferArray[count] != uniforms.uID){
                    bufferArray[count]= uniforms.uID
                    passEncoder.setBindGroup(count, uniforms.bindGroup);

                }

                count++;
            }

            passEncoder.setVertexBuffer(0, model.mesh.verticesBuffer);


          //  passEncoder.setVertexBuffer(0, model.mesh.verticesBuffer);
            passEncoder.draw(model.mesh.numVertices, 1, 0, 0);

        }
        passEncoder.end();
    }

    add(model: Model) {
        this.models.push(model)

    }

    setBuffer(buffer: GPUBuffer) {
       this.sharedBuffer =buffer;
    }
}
