import {Component}             from '@angular/core';
import {EventEmitter}          from '@angular/core';
import {Input}                 from '@angular/core';
import {OnInit}                from '@angular/core';
import {Output}                from '@angular/core';

import {QuestionsSelectImage}  from './questions.classes';

class Image {
    public name: string = "";
    public url : string = "";
}

class Dir {
    public dirName: string       = "";
    public images : Array<Image> = [];
    public subdir : Array<Dir>   = [];
}

@Component({
  moduleId   : module.id,
  selector   : 'questions-images',
  styleUrls  : [
      'questions-images.component.css',
  ],
  templateUrl: 'questions-images.component.html'
})
export class QuestionsImagesComponent implements OnInit { 
    @Input()  dir          : Dir                                = new Dir();
    @Input()  dirSet       : boolean                            = false;
    @Input()  showDirName  : boolean                            = true;
    @Input()  nbrQuestions : number                             = 0;
    @Output() clickDir     : EventEmitter<QuestionsSelectImage> = new EventEmitter<QuestionsSelectImage>();
    private   showQuestions: string                             = "";
    private   questions    : Array<number>                      = [];

    public constructor() {
    }

    public ngOnInit() : void {
    }

    private onClickImage(url : string) {
        if(url !== this.showQuestions) {
            this.showQuestions = url;
            if(this.questions.length !== this.nbrQuestions) {
                this.questions.length = this.nbrQuestions;
                for(let u = 0 ; u < this.questions.length ; ++u) {
                    this.questions[u] = u;
                }
            }
        } else {
            this.showQuestions = "";
        }
    }

    private onClickQuestion(question: number) : void {
        this.clickDir.next(new QuestionsSelectImage(question, this.showQuestions));
        this.showQuestions = "";
    }

    private onClickDir(info: QuestionsSelectImage) {
        this.clickDir.next(info);
    }
}
