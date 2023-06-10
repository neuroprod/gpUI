import { Vector4 } from "math.gl";
import AbstractRenderPass from "./AbstractRenderPass";

export default class TextureDepthRenderPass extends AbstractRenderPass {
    width: number = 1;
    height: number = 1;
    public texture: GPUTexture;
    public format: GPUTextureFormat;
    private depthTexture: GPUTexture;
    setDepthTexture(depthTexture: GPUTexture) {
        this.depthTexture =depthTexture;
    }
    constructor(device: GPUDevice, format: GPUTextureFormat = "rgba8unorm") {
        super(device, "TextureRenderPass");
        this.format = format;
    }
    public update(width: number, height: number) {
        if (this.width == width && this.height == height) return;

        this.width = width;
        this.height = height;
        if (this.texture) this.texture.destroy();
        this.texture = this.device.createTexture({
            size: [this.width, this.height],
            usage:
                GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
            format: this.format,
        });

        this.renderPassDescriptor = {
            label: this.label,
            colorAttachments: [
                {
                    view: this.texture.createView(),
                    clearValue: {
                        r: 0,
                        g: 0,
                        b: 0,
                        a: 1.0,
                    },
                    loadOp: "clear",
                    storeOp: "store",
                },
            ],
            depthStencilAttachment: {
                view: this.depthTexture.createView(),

                depthClearValue: 1.0,
                depthLoadOp: "load",
                depthStoreOp: "store",
            }
        };


    }


}
