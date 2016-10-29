//avoid compilation issues because Fingerprint library has no typings
declare var Fingerprint2: any

export class User {
    public id   : string = "";
    public name : string = "";
    public team : string = ""; //not stored

    public constructor() {
        if (typeof(Storage) != "undefined") {
            this.id   = localStorage.getItem("userId"  );
            this.name = localStorage.getItem("userName");
        }
        if (
               (typeof(this.id) == "undefined") 
            || (null == this.id) 
            || (0 == this.id.length) 
            || ("null" == this.id)
            ) {
            let _this = this;
            new Fingerprint2().get(function(result, components){
                _this.id = result;
                _this.store();
            });
        }
        if (
               (typeof(this.name) == "undefined") 
            || (null == this.name) 
            || ("null" == this.name)
            ) {
            this.name = "";
        }
    }

    public store() : void {
        if (typeof(Storage) === "undefined") {
            return;
        }
        localStorage.setItem("userId",   this.id  );
        localStorage.setItem("userName", this.name);
    };
};

