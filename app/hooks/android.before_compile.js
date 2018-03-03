/*
var copyFileSync = function(srcFile, destFile, encoding) {
  var content = fs.readFileSync(srcFile, encoding);
  fs.writeFileSync(destFile, content, encoding);
}
*/

/*
var copyFileSimple = function(fs, srcFile, destFile) {
    console.log("[" + srcFile + "][" + destFile + "]");
    fs.createReadStream(srcFile).pipe(fs.createWriteStream(destFile));
}
*/

/*
var copyFile = function(fs, path, iconSrcBase, iconDstBase, dir) {
    var iconSrc = path.join(iconSrcBase, dir, "icon.png");
    var iconDst = path.join(iconDstBase, dir, "icon.png");
    if (fs.existsSync(iconDst)) {
        copyFileSimple(fs, iconSrc, iconDst); 
    }
}
*/

module.exports = function(ctx) {
    // make sure android platform is part of build
    console.log("RUN HOOK platform [" + ctx.opts.platforms + "]");
    if (ctx.opts.platforms.indexOf('android') < 0) {
        return;
    }

    console.log("RUN HOOK");

    //prepare environment
    var deferral     = ctx.requireCordovaModule('q').defer();
    var fs           = ctx.requireCordovaModule('fs');
    var path         = ctx.requireCordovaModule('path');
    var platformRoot = path.join(ctx.opts.projectRoot, "platforms", "android");

    //process index.html file
    var indexFile    = path.join(platformRoot, "..", "..", "www", "index.html");
    console.log("RUN HOOK process index.html in [" + indexFile + "]");
    fs.stat(indexFile, function(err,stats) {
        if (err) {
            deferral.reject('Before compile hook failed: index file not found');
        } else {
            var data = fs.readFileSync(indexFile, 'utf8');
            var arr = data.split("\n");
            var dataProcessed = "";
            for(var u = 0 ; u < arr.length ; ++u) {
                if(arr[u].match(/<base href=\"\/\">/)) {
                    console.log("RUN HOOK process index.html replace 'base href'");
                    arr[u] = arr[u].replace("<base href=\"/\">", "<base href=\"./\">");
                }
                dataProcessed += arr[u] + "\n";
            }
            fs.writeFile(indexFile, dataProcessed, function(err) {
                if(err) {
                    deferral.reject('Before compile hook failed: index file could not be written');
                } else {
                    deferral.resolve();
                    console.log("RUN HOOK process index.html OK");
                }
            }); 
        };
    });

    return deferral.promise;
};
