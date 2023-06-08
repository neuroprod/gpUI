import { Matrix4, Vector3 } from "math.gl";
import UI from "../../UI/UI";
import ColorV from "../../shared/ColorV";

export default class SceneCube {
  private static id = 0;
  public name: string;
  public color: ColorV;
  public model: Matrix4 = new Matrix4();
  public unID = 0;
  private scale: Vector3;
  private pos: Vector3;
  private rotation: Vector3;

  constructor(
    name: string,
    pos = new Vector3((Math.random() - 0.5) * 5, 0, (Math.random() - 0.5) * 5),
    scale: Vector3 = new Vector3(1, 1, 1),
    rotation: Vector3 = new Vector3(),
    color: ColorV = new ColorV(Math.random(), Math.random(), Math.random(), 1)
  ) {
    this.name = name;
    this.scale = scale;
    this.pos = pos;
    this.rotation = rotation;
    this.color = color;
    this.unID = SceneCube.id;
    SceneCube.id++;
    this.updateMatrix();
  }

  updateMatrix() {
    this.model.identity();
    this.model.translate(this.pos);
    this.model.rotateXYZ(this.rotation);
    this.model.scale(this.scale);
  }

  generateCode() {
    let code =
      'this.cubes.push(new SceneCube("' +
      this.name +
      '",' +
      "new Vector3(" +
      this.pos.x.toFixed(2) +
      "," +
      this.pos.y.toFixed(2) +
      "," +
      this.pos.z.toFixed(2) +
      ")," +
      "new Vector3(" +
      this.scale.x.toFixed(2) +
      "," +
      this.scale.y.toFixed(2) +
      "," +
      this.scale.z.toFixed(2) +
      ")," +
      "new Vector3(" +
      this.rotation.x.toFixed(2) +
      "," +
      this.rotation.y.toFixed(2) +
      "," +
      this.rotation.z.toFixed(2) +
      ")," +
      "new Color(" +
      this.color.r.toFixed(2) +
      "," +
      this.color.g.toFixed(2) +
      "," +
      this.color.b.toFixed(2) +
      ",1)));" +
      "\n";
    return code;
  }

  drawUI() {
    UI.pushID(this.unID + "");
    this.name = UI.LTextInput("name", this.name);
    UI.LVector("Position", this.pos);
    UI.LVector("Scale", this.scale);
    UI.LVector("Rotation", this.rotation);
    UI.LColor("Color", this.color);
    this.updateMatrix();
    UI.popID();
  }
}
