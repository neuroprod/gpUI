import UI from "./UI/UI";
import {Vector2, Vector3, Vector4} from "math.gl";
import UIUtils from "./UI/UIUtils";
import SelectItem from "./UI/math/SelectItem";
import {TestEnum} from "./Main";
import Color from "./UI/math/Color";
import Texture from "./glLib/Texture";
import UITexture from "./UI/draw/UITexture";
import GL from "./glLib/GL";


export default class ExampleUI
{
    private color1: Color = new Color(0.12,0.63,0.86,1.00);
    private color2: Color = new Color(0.98,0.36,0.57,0.58);

    private myFloat = 0.5;
    private myFloat2 = 0.5;
    private myBool = false;
    private myText = "hello Tokyo"
    private myVec3: Vector3 = new Vector3(100, -200, 1.0);

    private parrotTextureGL: Texture;
    private parrotTexture: UITexture;

    private testIndex = 0;

    constructor(glMain:GL) {



        this.parrotTextureGL = new Texture(glMain);
        this.parrotTextureGL.load("test.png");
        this.parrotTexture = new UITexture();
    }
    init(){
        this.parrotTexture.setTextureGL(this.parrotTextureGL.texture, this.parrotTextureGL.width, this.parrotTextureGL.height);

    }
    update()
    {
        UI.pushWindow("Examples");
        //text
        UI.LText("hello world " + this.myFloat, "label")
        UI.LText("Een lange lap tekst of kort en bondig? De woorden zeggen het al: 'een lange lap' klinkt saai, terwijl 'kort en bondig' vlot overkomt. Maar betekent dat dat je lange teksten dan altijd moet vermijden?", "multiline", true)
        UI.LTextInput("input text", this, "myText")
        UI.separator("separator1 ", false)
        if (UI.LButton("Press Me!", "button")) {
            UI.logEvent("Button 1",'Thanks!')
        }
        if (UI.LButton("Press Me 2!")) {
            UI.logEvent("Button 2",'Thanks 2!')
        }
        if (UI.LButton("Don't press me!")) {
            UI.logEvent("Button 3",'Noooo!:(',true)
        }
        UI.separator("Boolean")
        if (UI.LBool(this, "myBool")) {
            UI.setIndent(20)
            if (UI.LBool("animate myFloat", false)) {
                this.myFloat = Math.cos(Date.now() / 1000);
                UI.logEvent("myFloat",this.myFloat+"")
            }
            UI.setIndent(0)
        }

        UI.pushGroup("Numbers")
            let a = UI.LFloatSlider("localVal", 2);
            UI.LFloatSlider(this, "myFloat", -1, 1);
            UI.LIntSlider("intSlider", 6, 0, 10);
            UI.separator("Drag/Input")
            UI.LFloat(this, "myFloat2");
            UI.floatPrecision = 4;
            UI.LFloat("testP", 0.001);
            UI.floatPrecision = 2;
        UI.popGroup()

        UI.pushGroup("Colors")
            UI.LColor("color1", this.color1);
            UI.LColor("color2", this.color2)
            UI.LTexture("mijnTexture", this.parrotTexture)
        UI.popGroup()

        UI.pushGroup("Select")
            let t: TestEnum = UI.LSelect("Enum", UIUtils.EnumToSelectItem(TestEnum), 0)
            let selectArray = [];
            for (let i = 0; i < 50; i++) {
                selectArray.push(new SelectItem("item " + i, i))
            }
            let selectedItem = UI.LSelect("select", selectArray, 0)
            UI.LText("selected item: " + selectedItem);
            UI.pushLList("myList", 100);
                for (let i = 0; i < 10; i++) {
                    if (UI.LListItem("name " + i, (i == this.testIndex))) {
                    this.testIndex = i;
                    }
                }
            UI.popList()
            UI.LText("list item: " + this.testIndex);
        UI.popGroup()

        UI.pushGroup("Groups")
            UI.pushGroup("nested Group")
                UI.pushGroup("and deeper")
                    UI.LText("test", "test")
                UI.popGroup()
                UI.pushGroup("and deeper2")
                    UI.LText("test", "test")
                UI.popGroup()
                UI.pushGroup("and deeper3")
                    UI.LText("test", "test")
                UI.popGroup()
            UI.popGroup()
            UI.pushGroup("nested Group2")
                UI.LText("test", "test")
            UI.popGroup()
        UI.popGroup()

        UI.pushGroup("Vectors")
            UI.LVector('myVec3', this.myVec3);
            let v2 = UI.LVector("vec2", new Vector2(0.5, 0.2))
            let v3 = UI.LVector("vec3", new Vector3(0.5, 0.2, 1.33))
            let v4 = UI.LVector("vec4", new Vector4(0.5, 0.2, 1.33, 2.0))
            UI.LText(this.myVec3 + "-" + v2, "test");
            let v5 = UI.LVector("normalized", new Vector3(1, 0.0, 0), true)
            UI.LText(v5 + "", "test");
        UI.popGroup()

        UI.popWindow();
    }
}
