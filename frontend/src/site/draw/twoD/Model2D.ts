
import Camera2D from "./Camera2D";
import Mesh from "../../../webgpu/gpuLib/Mesh";
import {AbstractMaterial} from "../../../webgpu/gpuLib/materials/AbstractMaterial";
import {AbstractModel} from "../../../webgpu/gpuLib/AbstractModel";
import Transform from "../../../webgpu/gpuLib/Transform";

export class Model2D extends AbstractModel {





    constructor(
        device: GPUDevice,
        name: string,
        mesh: Mesh,
        material: AbstractMaterial,
        needsTransform: boolean = true,
        camera?: Camera2D
    ) {
        super(name,mesh,material);

        if (camera) this.material.addUniformGroup(camera);
        if (needsTransform) {
            this.transform = new Transform(device, this.name + "transform");
            this.material.addUniformGroup(this.transform);
        }

    }
}
