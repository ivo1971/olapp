export class TeamInfo {
    //from JSON
    public id             : string                 = "";
    public name           : string                 = "";
    public pointsTotal    : number                 = 0;
    public pointsRound    : number                 = 0;

    //from image capture
    //(merged into TeamInfo in the teamfie-base.class.ts)
    public imageEncoded   : string                 = "";
    public imageWidth     : number                 = 0;
    public imageHeight    : number                 = 0;

    //temporary information that can be used
    public tmpPointsRound : number                 = 0;
}
