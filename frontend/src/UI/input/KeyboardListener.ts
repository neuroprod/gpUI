
export default class KeyboardListener {

    private buffer=""

    constructor() {

        document.addEventListener('keydown', this.onKey.bind(this));

    }
    onKey(event:KeyboardEvent)
    {
        let key= event.key;

        if(event.code =="Enter")
        {
            this.setShortCut(key);
            return;
        }
        if(event.ctrlKey){
            this.setShortCut(key);
            return;
        }
        if(key.length!= 1)return;
        let charCode=key.charCodeAt(0);

        if(charCode<32 && charCode>126)return;
        // Alert the key name and key code on keydown
        this.buffer +=key
        console.log("buffer:"+this.buffer)
    }
    setShortCut(key: string) {
        console.log("ShortCut",key);
    }
    getShortCut()
    {

    }

    getBuffer()
    {
        let r =this.buffer;
        this.buffer =""
        return r;
    }

}
