import Rect from "../math/Rect";
import DrawBatch from "../draw/DrawBatch";
import FillBatchGPU from "./FillBatchGPU";

export default class DrawBatchGPU {
    public id: number
    //  public fillBatchGL: FillBatchGL|null =null;
    // public textBatchGL: TextBatchGL|null =null;
    //public textureBatch: TextureBatch|null =null;
    private fillBatchGPU: FillBatchGPU;


    public clipRect: Rect | null;
    public needsClipping: boolean = false;
    public useThisUpdate: boolean = true;

    private device: GPUDevice;


    constructor(id: number, device: GPUDevice) {
        this.device = device;
        this.id = id;
    }


    setBatchData(batch: DrawBatch) {
        this.clipRect = batch.clipRect;
        this.needsClipping = batch.needsClipping;
        if (batch.fillBatch) {

             if(!this.fillBatchGPU)this.fillBatchGPU =new FillBatchGPU(this.device)
            this.fillBatchGPU.setRenderData(batch.fillBatch)
        }
         if(batch.textBatch)
         {
                // console.log(batch.textBatch)
         }
        /* if(batch.textureBatch)
         {

             this.textureBatch=batch.textureBatch;
         }*/
    }

    destroy() {
        /*if (this.fillBatchGL) {
            this.fillBatchGL.destroy()
        }
        if (this.textBatchGL) {
            this.textBatchGL.destroy()
        }*/
    }
}
