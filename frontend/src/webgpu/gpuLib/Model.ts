import Mesh from "./Mesh";

import Transform from "./Transform";
import Camera from "./Camera";
import {AbstractMaterial} from "./materials/AbstractMaterial";

export class Model {
    public mesh: Mesh;
    public material: AbstractMaterial;
    public transform: Transform;
    private name: string;

    constructor(device: GPUDevice, name: string, mesh: Mesh, material: AbstractMaterial, needsTransform: boolean = true, camera?: Camera) {
        this.name = name;

        this.material = material

        this.mesh = mesh;
        if (camera) this.material.addUniformGroup(camera)
        if (needsTransform) {
            this.transform = new Transform(device, this.name + "transform")
            this.material.addUniformGroup(this.transform)
        }
        ///this.material.addUniformGroup(camera)


    }
}
