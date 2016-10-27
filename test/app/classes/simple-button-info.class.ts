
export class SimpleButtonTeamInfo {
    public name       : string                 = "";
    public background : string                 = ""; //supported: success, info, warning, danger
    public members    : string[]               = [];
}

export class SimpleButtonInfo {
    public pressed    : boolean                = false;
    public background : string                 = ""; //supported: success, info, warning, danger
    public teams      : SimpleButtonTeamInfo[] = [];
};

