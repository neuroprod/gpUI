export default class GlobalStyle
{
    //
    private labeledComponentContentOffset =100
    private defaultLabeledComponentContentOffset=this.labeledComponentContentOffset;
    public compIndent: number =0;
    getLabelSize() {
        return this.labeledComponentContentOffset;
    }
    setLabelSize(value:number)
    {
        this.labeledComponentContentOffset =value;
    }
    resetLabelSize()
    {
        this.labeledComponentContentOffset = this.defaultLabeledComponentContentOffset;
    }

}
