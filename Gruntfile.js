module.exports = function (grunt) {
    var buildPlatforms = parseBuildPlatforms(grunt.option('platforms'));

    grunt.initConfig({
        nodewebkit: {
            options: {
                version: '0.12.0',
                build_dir: './build', // Where the build version of my node-webkit app is saved
                //mac_icns: './images/popcorntime.icns', // Path to the Mac icon file
                mac: buildPlatforms.mac,
                win32: buildPlatforms.win32,
                win64: buildPlatforms.win64,
                linux32: buildPlatforms.linux32,
                linux64: buildPlatforms.linux64
            },
            src: ['./misc/**', './public/**', './models/**', './public/**', './js/**', './ui/**', './routes/**', './node_modules/**', '!./node_modules/grunt*/**', './index.html', './app.js', './server.js', './package.json', './README.md'] // Your node-webkit app './**/*'
        },
        copy: {
            main: {
                files: [
                    {
                    src: 'lib/ffmpegsumo/win/ffmpegsumo.dll',
                    dest: 'build/prototype/win32/ffmpegsumo.dll'
                    },
                    {
                    src: 'lib/ffmpegsumo/osx/ffmpegsumo.so',
                    dest: 'build/prototype/osx32/prototype.app/Contents/Frameworks/nwjs Framework.framework/Libraries/ffmpegsumo.so'
                    },
                    {
                    src: 'lib/ffmpegsumo/osx/ffmpegsumo.so',
                    dest: 'build/prototype/osx64/prototype.app/Contents/Frameworks/nwjs Framework.framework/Libraries/ffmpegsumo.so'
                    }
                ]
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-node-webkit-builder');
    grunt.registerTask('nodewkbuild', ['nodewebkit', 'copy']);


};

var parseBuildPlatforms = function (argumentPlatform) {
    // this will make it build no platform when the platform option is specified
    // without a value which makes argumentPlatform into a boolean
    var inputPlatforms = argumentPlatform || process.platform + ";" + process.arch;

    // Do some scrubbing to make it easier to match in the regexes bellow
    inputPlatforms = inputPlatforms.replace("darwin", "mac");
    inputPlatforms = inputPlatforms.replace(/;ia|;x|;arm/, "");

    var buildAll = /^all$/.test(inputPlatforms);

    var buildPlatforms = {
        mac: /mac/.test(inputPlatforms) || buildAll,
        win32: /win32/.test(inputPlatforms) || buildAll,
        win64: /win64/.test(inputPlatforms) || buildAll,
        linux32: /linux32/.test(inputPlatforms) || buildAll,
        linux64: /linux64/.test(inputPlatforms) || buildAll
    };

    return buildPlatforms;
}
