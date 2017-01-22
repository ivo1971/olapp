/* This file contains help functions related to strings.
 */
export function compareString(a: string, b: string) : number {
    //case-insensitive compare
    a = a.toLowerCase();
    b = b.toLowerCase();

    //compare
    if(a === b) {
        return 0;
    }
    if(a < b) {
        return -1;
    } else {
        return 1;
    }
}

