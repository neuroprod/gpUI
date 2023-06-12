import Mesh from "./Mesh";
import {AbstractMaterial} from "./materials/AbstractMaterial";
import Transform from "./Transform";
import Camera from "./Camera";

export class AbstractModel {
    public mesh: Mesh;
    public material: AbstractMaterial;
    public name: string;
    public transform: Transform;
    constructor(
        name: string,
        mesh: Mesh,
        material: AbstractMaterial) {
        this.name = name;
        this.material = material;
        this.mesh = mesh;


    }
}
