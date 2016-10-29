
export class SimpleButtonTeamInfo {
    public name       : string                 = "";
    public members    : string[]               = [];
    public active     : boolean                = true;
    public good       : boolean                = false;
}

export class SimpleButtonInfo {
    public teams      : SimpleButtonTeamInfo[] = [];
};

