const XRegExp = require('xregexp');
const path = require('path');
const minimatch = require('minimatch');
const debug = require('debug')('test-route')

module.exports = function test(input, nowConfig, matchedFileExists) {
    const result = {};
    const parts = input.split(' ');
    let method = 'GET';

    if (parts.length > 1) {
        method = parts[0];
    }

    const urlPath = parts[parts.length - 1];

    let lastMatch;

    for (let route of nowConfig.routes){
        const rex = XRegExp(`^${route.src}$`, 'x');

        // add info about route matching but not method
        if (XRegExp.match(urlPath, rex) && (!route.methods || route.methods.includes(method))){
            let target = urlPath;
            if (route.dest){
                target = XRegExp.replace(urlPath, rex, route.dest);
            }

            lastMatch = target;
            break;
        }
    }

    let lastBuilder;
    debug(`lastMatch ${lastMatch}`);
    if (lastMatch){
        result.matchedFile = lastMatch;
        let relative = lastMatch;
        if (path.isAbsolute(lastMatch)){
            relative = path.join('.', lastMatch);
        }
        debug(`relative ${relative}`);
        for (let build of nowConfig.builds){
            let src = path.normalize(build.src);

            debug(`src ${src}`);
            if (minimatch(relative, src)){
                debug(`matched ${relative} ${src}`);
                lastBuilder = build.use;
            }
        }
    }

    if (lastMatch && lastBuilder){
        result.fileFound = matchedFileExists(lastMatch);
        result.matchedBuilder = lastBuilder;
    } 

    return result;
}
