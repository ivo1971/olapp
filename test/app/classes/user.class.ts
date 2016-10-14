export class User {
    public id: string;
    public name: string;

    public constructor() {
        if (typeof(Storage) === "undefined") {
            return;
        }
        this.id   = localStorage.getItem("userId"  );
        this.name = localStorage.getItem("userName");
    }

    public store() : void {
        if (typeof(Storage) === "undefined") {
            return;
        }
        localStorage.setItem("userId",   this.id  );
        localStorage.setItem("userName", this.name);
    };
};

