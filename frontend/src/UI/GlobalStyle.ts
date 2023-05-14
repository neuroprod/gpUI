export default class GlobalStyle
{
    //
    private labelSize =100
    public readonly defaultLabelSize=100;
    public compIndent: number =0;
    getLabelSize() {
        return this.labelSize;
    }
    setLabelSize(value:number)
    {
        this.labelSize =value;
    }


}
