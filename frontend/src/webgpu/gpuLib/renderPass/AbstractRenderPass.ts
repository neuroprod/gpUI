import {Model} from "../Model";
import UniqueObject from "../UniqueObject";

export default class AbstractRenderPass  extends UniqueObject
{
    protected device: GPUDevice;
    protected label: string;
    protected models: Array<Model> = []
    protected renderPassDescriptor:GPURenderPassDescriptor;
    constructor(device: GPUDevice,label:string) {
        super();
        this.device =device;
        this.label =label;

    }

    draw(commandEncoder: GPUCommandEncoder)
    {
        const passEncoder = commandEncoder.beginRenderPass(this.renderPassDescriptor);
        this.preDraw(passEncoder)
        this.drawModels( passEncoder);
        this.postDraw(passEncoder)

        passEncoder.end();
    }
    public drawModels(passEncoder:GPURenderPassEncoder)
    {
        let pipelineID = -1;
        let bufferArray;
        for (let model of this.models) {

            if (model.material.uID !== pipelineID) {
                pipelineID = model.material.uID
                bufferArray = new Array(model.material.bindGroups.length).fill(-1);
                model.material.makePipeLine()
                passEncoder.setPipeline(model.material.pipeLine);
            }
            let count =0

            for (let uniforms of model.material.bindGroups) {

               if( uniforms.typeID==-2){
                   passEncoder.setBindGroup(count, model.transform.bindGroup);
               }else{
                   if (bufferArray[count] != uniforms.uID) {
                       bufferArray[count] = uniforms.uID
                       passEncoder.setBindGroup(count, uniforms.bindGroup);

                       }
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
    }
    protected preDraw(passEncoder:GPURenderPassEncoder) {
    }
    protected postDraw(passEncoder:GPURenderPassEncoder) {

    }
    public add(model: Model) {
        this.models.push(model)

    }


}
