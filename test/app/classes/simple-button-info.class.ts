
export class SimpleButtonTeamInfo {
    public name       : string                 = "";
    public members    : string[]               = [];
    public active     : boolean                = true;
    public good       : boolean                = false;
}

export class SimpleButtonInfo {
    public seqNbr     : number                 = 99999999;
    public teams      : SimpleButtonTeamInfo[] = [];
};

