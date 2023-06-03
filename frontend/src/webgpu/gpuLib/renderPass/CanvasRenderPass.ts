import {Model} from "../Model";
import UI from "../../../UI/UI";
import AbstractRenderPass from "./AbstractRenderPass";

;

export default class CanvasRenderPass extends AbstractRenderPass{

    width: number = 1;
    height: number = 1;
    presentationFormat: GPUTextureFormat;
    private texture: GPUTexture;
    private depthTexture: GPUTexture;


    private device: GPUDevice;
    private needsDepth: boolean;

    constructor(device: GPUDevice, presentationFormat: GPUTextureFormat,needsDepth:boolean=true) {
        super (device,"canvasRenderPass")
        this.device = device
        this.presentationFormat = presentationFormat
        this.needsDepth = needsDepth;
    }

    public updateForCanvas(width: number, height: number, context: GPUCanvasContext) {


        if (width != this.width || height != this.height) {
            this.width = width;
            this.height = height;
            if(this.needsDepth) {
                if (this.depthTexture) this.depthTexture.destroy()
                  this.depthTexture = this.device.createTexture({
                      size: [width, height],
                      format: 'depth24plus',
                      sampleCount:4,
                      usage: GPUTextureUsage.RENDER_ATTACHMENT,
                  });
            }
            if (this.texture) this.texture.destroy()
            this.texture = this.device.createTexture({
                size: [width, height],
                sampleCount:4,
                format: this.presentationFormat,
                usage: GPUTextureUsage.RENDER_ATTACHMENT,
            });


        }

        this.renderPassDescriptor = {
            label:this.label,
            colorAttachments: [
                {
                    view: this.texture.createView(),
                    resolveTarget: context.getCurrentTexture().createView(),
                    clearValue: {r: 0.5, g: 0.5, b: 0.5, a: 1.0},
                    loadOp: 'clear',
                    storeOp: 'store',
                },
            ],
        };
        if(this.needsDepth) {

            this.renderPassDescriptor.depthStencilAttachment= {
                view: this.depthTexture.createView(),
                    depthClearValue: 1.0,
                    depthLoadOp: 'clear',
                    depthStoreOp: 'store',
            }
        }

    }



    protected postDraw(passEncoder: GPURenderPassEncoder) {
        UI.drawGPU(passEncoder,this.needsDepth)
    }

}
