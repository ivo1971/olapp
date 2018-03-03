declare var Media: any;

import {IsBrowser } from './../help/cordova';
import {LogService} from './../services/log.service';

export enum EMedia {
    SadTrombone,
    Applause,
}

export class MediaPlayer {
    private applause:    any = null;
    private sadTrombone: any = null;

    public constructor(
      private logService: LogService
      ) {
        this.applause    = this.LoadOne('sound/applause2.mp3');
        this.sadTrombone = this.LoadOne('sound/Sad_Trombone-Joe_Lamb-665429450.mp3');
    }

    public Play(media: EMedia): void {
        if(IsBrowser()) {
            return;
        }

        switch(media) {
            case EMedia.Applause:
                this.applause.play();
                break;
            case EMedia.SadTrombone:
                this.sadTrombone.play();
                break;
            default:
                this.logService.error('Play unknown media [' + media + ']');
                break;
        }
    }

    private LoadOne(file: String): any {
        if (IsBrowser()) {
            return null;
        }

        const fileAbs: String = this.GetFileAbs(file);
        return new Media(fileAbs, function() {
            this.logService.info('Load [' + fileAbs + '] OK');
        }, function() {
            this.logService.error('Load [' + fileAbs + '] FAILED');
        });
    }

    private GetFileAbs(file: String): String {
        return 'file:///android_asset/www/assets/media/' + file;
    }
}