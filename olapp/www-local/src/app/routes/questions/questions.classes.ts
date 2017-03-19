export class QuestionsSelectImage {
    public question : number = -1;
    public url      : string = "";

    public constructor(_question: number = -1, _url: string = "") {
        this.question = _question;
        this.url      = _url;
    }
}