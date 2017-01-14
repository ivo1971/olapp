/* This file contains help functions related to Cordova.
 */
export function IsCordova() : boolean {
    let isCordova : boolean = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
    console.log("IsCordova [" + isCordova + "]")
    return isCordova;
}

export function IsBrowser() : boolean {
    let isBrowser : boolean = !IsCordova();
    console.log("IsBrowser [" + isBrowser + "]")
    return isBrowser;
}
