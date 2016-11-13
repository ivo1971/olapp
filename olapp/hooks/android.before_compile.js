module.exports = function(ctx) {
    // make sure android platform is part of build
    if (ctx.opts.platforms.indexOf('android') < 0) {
        return;
    }

    console.log("RUN HOOK");
    var deferral     = ctx.requireCordovaModule('q').defer();
    var fs           = ctx.requireCordovaModule('fs');
    var path         = ctx.requireCordovaModule('path');
    var platformRoot = path.join(ctx.opts.projectRoot, "platforms", "android");
    var indexFile    = path.join(platformRoot, "assets", "www", "index.html");
    fs.stat(indexFile, function(err,stats) {
        if (err) {
            deferral.reject('Before compile hook failed: index file not found');
        } else {
            var data = fs.readFileSync(indexFile, 'utf8');
            var arr = data.split("\n");
            var dataProcessed = "";
            for(var u = 0 ; u < arr.length ; ++u) {
                if(arr[u].match(/base href/)) {
                    arr[u] = arr[u].replace("/", "/android_asset/www/");
                }
                dataProcessed += arr[u] + "\n";
            }
            fs.writeFile(indexFile, dataProcessed, function(err) {
                if(err) {
                    deferral.reject('Before compile hook failed: index file could not be written');
                } else {
                    deferral.resolve();
                    console.log("RUN HOOK OK");
                }
            }); 
        };
    });
    return deferral.promise;
};
