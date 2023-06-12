import AbstractRenderPass from "../../../webgpu/gpuLib/renderPass/AbstractRenderPass";

export default class BrushBasePass extends AbstractRenderPass
{
    constructor(device:GPUDevice,label:string,texture:GPUTexture) {
        super(device,label);


        this.renderPassDescriptor = {
            label: this.label,
            colorAttachments: [
                {
                    view: texture.createView(),
                    clearValue: {
                        r: 0.2,
                        g: 0.2,
                        b: 0.2,
                        a: 1.0,
                    },
                    loadOp: "load",
                    storeOp: "store",
                },

            ],
        };


    }


}
