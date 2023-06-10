import PreLoader from "../shared/PreLoader";

import { BindGroup } from "./gpuLib/BindGroup";
import UI from "../UI/UI";

import CanvasManager from "./gpuLib/CanvasManager";

import ForwardTest from "./ForwardTest";
import DeferredTest from "./DeferredTest";

export default class Main {
  private canvas: HTMLCanvasElement;
  private context: GPUCanvasContext;
  private device: GPUDevice;

  private presentationFormat: GPUTextureFormat;

  private preloader: PreLoader;

  private canvasManager: CanvasManager;

  private forwardTest: ForwardTest;
  private deferredTest: DeferredTest;
  private showForward: boolean = false;
  private useTimeStampQuery: boolean =true;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvasManager = new CanvasManager(this.canvas);
    this.setup().then(() => {
      this.preloader = new PreLoader(() => {}, this.init.bind(this));
      this.forwardTest = new ForwardTest(
        this.device,
        this.preloader,
        this.presentationFormat,
        this.canvas
      );
      this.deferredTest = new DeferredTest(
        this.device,
        this.preloader,
        this.presentationFormat,
        this.canvas
      );
      this.deferredTest.useTimeStampQuery =this.useTimeStampQuery;
    });
  }

  async setup() {
    const adapter = await navigator.gpu.requestAdapter();
    //--disable-dawn-features=disallow_unsafe_apis
    // on mac: /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --disable-dawn-features=disallow_unsafe_apis
    ///https://omar-shehata.medium.com/how-to-use-webgpu-timestamp-query-9bf81fb5344a test this
    if(this.useTimeStampQuery) {
      this.device = await adapter.requestDevice({requiredFeatures: ["timestamp-query"],});
    }else{
      this.device = await adapter.requestDevice();
    }
    this.context = this.canvas.getContext("webgpu") as GPUCanvasContext;
    this.presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    this.context.configure({
      device: this.device,
      format: this.presentationFormat,
      alphaMode: "premultiplied",
    });
  }

  init() {
    UI.setWebGPU(this.device, this.canvas, this.presentationFormat);
    this.forwardTest.init();
    this.deferredTest.init();
    requestAnimationFrame(this.step.bind(this));
  }

  step() {
    this.update();
    this.prepDraw();
    this.draw();
    requestAnimationFrame(this.step.bind(this));
  }

  update() {
    UI.pushWindow("main");
    this.showForward = UI.LBool("Forward render test", false);
    UI.popWindow();

    if (this.showForward) {
      this.forwardTest.update();
    } else {
      this.deferredTest.update();
    }

    //UI.UpdateGPU
  }

  prepDraw() {
    BindGroup.updateGroups();

    if (this.showForward) {
      this.forwardTest.prepDraw(this.context);
    } else {
      this.deferredTest.prepDraw(this.context);
    }
    UI.updateGPU();
  }

  draw() {
    const commandEncoder = this.device.createCommandEncoder();

    if (this.showForward) {
      this.forwardTest.draw(commandEncoder);
    } else {
      this.deferredTest.draw(commandEncoder);
    }

    this.device.queue.submit([commandEncoder.finish()]);
    if (!this.showForward &&  this.useTimeStampQuery) {
      this.deferredTest.tsq.finish();
    }
  }
}
