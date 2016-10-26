
export class SimpleButtonTeamInfo {
    public name       : string                 = "";
    public background : string                 = "";
    public members    : string[]               = [];
}

export class SimpleButtonInfo {
    public pressed    : boolean                = false;
    public background : string                 = "";
    public teams      : SimpleButtonTeamInfo[] = [];
};

