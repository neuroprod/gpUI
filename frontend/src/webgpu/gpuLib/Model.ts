import Mesh from "./Mesh";

import Transform from "./Transform";
import Camera from "./Camera";
import { AbstractMaterial } from "./materials/AbstractMaterial";
import {AbstractModel} from "./AbstractModel";

export class Model extends AbstractModel {




  constructor(
    device: GPUDevice,
    name: string,
    mesh: Mesh,
    material: AbstractMaterial,
    needsTransform: boolean = true,
    camera?: Camera
  ) {
    super(name,mesh,material);

    if (camera) this.material.addUniformGroup(camera);
    if (needsTransform) {
      this.transform = new Transform(device, this.name + "transform");
      this.material.addUniformGroup(this.transform);
    }
    ///this.material.addUniformGroup(camera)
  }
}
