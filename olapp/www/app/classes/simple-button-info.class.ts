
export class SimpleButtonTeamInfo {
    //from JSON
    public name       : string                 = "";
    public members    : string[]               = [];
    public active     : boolean                = true;
    public good       : boolean                = false;

    //calculated info
    public wrong      : boolean                = false;
    public wait       : boolean                = false;
    public go         : boolean                = false;
}

//returns true when this item is active
//cannot be a part of the SimpleButtonTeamInfo class as this
//is instantiated from incoming JSON data and apparently this
//does not add the class methods somehow...
export function calculate(team : SimpleButtonTeamInfo, firstActiveFound : boolean) : boolean {
        //not active means wrong
        if(!team.active) {
            team.good  = false;
            team.wrong = true;
            team.wait  = false;
            team.go    = false;
            return false;
        }
        team.wrong = false;

        //good is incoming data
        if(team.good) {
            team.wait  = false;
            team.go    = false;
            return true;
        }        

        //this is not the first active
        if(firstActiveFound) {
            team.wait  = true;
            team.go    = false;
            return true;
        }        

        //this is the first active
        team.wait  = false;
        team.go    = true;
        return true;
    }
}

export class SimpleButtonInfo {
    public seqNbr     : number                 = 99999999;
    public teams      : SimpleButtonTeamInfo[] = [];
};
