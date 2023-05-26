import Mesh from "./gpuLib/Mesh";
import Mesh2 from "./gpuLib/Mesh2";
import Material from "./gpuLib/Material";

export default class Main{
    private canvas: HTMLCanvasElement;
    private context: GPUCanvasContext;
    private device:GPUDevice;
    private mesh: Mesh;
    private mesh2: Mesh2;
    private material: Material;
    private presentationFormat:  GPUTextureFormat;
    constructor(canvas:HTMLCanvasElement) {
        this.canvas =canvas;
        this.setup();
    }
    async setup()
    {
        const adapter = await navigator.gpu.requestAdapter();

        const device = await adapter.requestDevice();
        this.device =device;
        this.canvas.width=window.innerWidth;
        this.canvas.height=window.innerHeight;
        this.context = this.canvas.getContext('webgpu') as GPUCanvasContext;
        this.presentationFormat = navigator.gpu.getPreferredCanvasFormat();


        this.context.configure({device, format: this.presentationFormat,
            alphaMode: 'premultiplied',
        });

        this.mesh =new Mesh(this.device)
        this.mesh2 =new Mesh2(this.device)
        this.material=new Material(this.device,this.presentationFormat);
        requestAnimationFrame(this.draw.bind(this))
    }
    draw()
    {
        const commandEncoder = this.device.createCommandEncoder();
        const textureView = this.context.getCurrentTexture().createView();

        const renderPassDescriptor: GPURenderPassDescriptor = {
            colorAttachments: [
                {
                    view: textureView,
                    clearValue: { r: 0.5, g: 0.5, b: 0.5, a: 1.0 },
                    loadOp: 'clear',
                    storeOp: 'store',
                },
            ],
        };

        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

        passEncoder.setPipeline(this.material.pipeLine);
        passEncoder.setBindGroup(0, this.material.uniformBindGroup);
        passEncoder.setVertexBuffer(0, this.mesh.verticesBuffer);

        passEncoder.draw(3, 1, 0, 0);

        passEncoder.setVertexBuffer(0, this.mesh2.verticesBuffer);
        passEncoder.draw(3, 1, 0, 0);
        passEncoder.end();

        this.device.queue.submit([commandEncoder.finish()]);
        requestAnimationFrame(this.draw.bind(this))
    }
}
