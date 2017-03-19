var deleteFolderRecursive = function(fs, path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(fs, curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

var copyFileSimpleBase = function(fs, src, trg) {
    console.log("[" + src + "] --> [" + trg + "]");
    var content = fs.readFileSync(src);
    fs.writeFileSync(trg, content);
};

var copyFilesInDir = function(fs, src, trg) {
    console.log("copy-dir [" + src + "][" + trg + "]");
    var srcFiles = fs.readdirSync(src);
    srcFiles.forEach(function(file,index) {
        var srcCurPath = src + "/" + file;
        var trgCurPath = trg + "/" + file;
        if(fs.lstatSync(srcCurPath).isDirectory()) { // recurse
            copyFilesInDir(fs, srcCurPath, trgCurPath);
        } else { // copy file
            copyFileSimpleBase(fs, srcCurPath, trgCurPath);
        }
    });
};

var copyFileSimple = function(fs, wwwLocal, www, pathRel, file) {
    console.log("copy [" + pathRel + "][" + file + "]");

    var pathAbsWwwLocal = wwwLocal + "/" + pathRel;
    var pathAbsWww      = www + "/" + pathRel;
    var fileAbsWwwLocal = pathAbsWwwLocal + "/" + file;
    var fileAbsWww      = pathAbsWww      + "/" + file;

    //create target directory
    if (!fs.existsSync(pathAbsWww)){
        console.log("mkdir [" + pathAbsWww + "]");
        fs.mkdirSync(pathAbsWww);
    }

    //copy
    if('*' === file) {
        //copy all files in the directory and subdirectories
        copyFilesInDir(fs, pathAbsWwwLocal, pathAbsWww);
    } else if(0 != file.length) {
        copyFileSimpleBase(fs, fileAbsWwwLocal, fileAbsWww);
    }
};

module.exports = function(ctx) {
    console.log("RUN HOOK www-local --> www");

    //prepare environment
    var deferral     = ctx.requireCordovaModule('q').defer();
    var fs           = ctx.requireCordovaModule('fs');
    var path         = ctx.requireCordovaModule('path');
    var wwwLocal     = path.join(ctx.opts.projectRoot, "www-local");
    var www          = path.join(ctx.opts.projectRoot, "www"      );

    //start clean
    if (fs.existsSync(www)){
        deleteFolderRecursive(fs, www);
    }
    fs.mkdirSync(www);

    //copy all files
    copyFileSimple(fs, wwwLocal, www, "img",                               "*");
    copyFileSimple(fs, wwwLocal, www, "js",                                "index.js");
    copyFileSimple(fs, wwwLocal, www, "node_modules",                      "");
    copyFileSimple(fs, wwwLocal, www, "node_modules/bootstrap",            "");
    copyFileSimple(fs, wwwLocal, www, "node_modules/bootstrap/dist",       "");
    copyFileSimple(fs, wwwLocal, www, "node_modules/bootstrap/dist/css",   "bootstrap.min.css");
    copyFileSimple(fs, wwwLocal, www, "node_modules/bootstrap/dist/css",   "bootstrap.min.css.map");
    copyFileSimple(fs, wwwLocal, www, "node_modules/bootstrap/dist/fonts", "glyphicons-halflings-regular.woff2");
    copyFileSimple(fs, wwwLocal, www, "node_modules/bootstrap/dist/js",    "bootstrap.min.js");
    copyFileSimple(fs, wwwLocal, www, "node_modules/core-js",              "");
    copyFileSimple(fs, wwwLocal, www, "node_modules/core-js/client",       "shim.min.js");
    copyFileSimple(fs, wwwLocal, www, "node_modules/core-js/client",       "shim.min.js.map");
    copyFileSimple(fs, wwwLocal, www, "node_modules/zone.js",              "");
    copyFileSimple(fs, wwwLocal, www, "node_modules/zone.js/dist",         "zone.js");
    copyFileSimple(fs, wwwLocal, www, "node_modules/fingerprintjs2",       "");
    copyFileSimple(fs, wwwLocal, www, "node_modules/fingerprintjs2/dist",  "fingerprint2.min.js");
    copyFileSimple(fs, wwwLocal, www, "node_modules/jquery",               "");
    copyFileSimple(fs, wwwLocal, www, "node_modules/jquery/dist",          "jquery.min.js");
    copyFileSimple(fs, wwwLocal, www, "src",                               "build.js");
    copyFileSimple(fs, wwwLocal, www, "src",                               "styles.css");
    copyFileSimpleBase(fs, wwwLocal + "/src/index.html", www + "/index.html"); //Put index file in the root or 
                                                                               //Cordova starts adding the relative
                                                                               //path to all files.
}
