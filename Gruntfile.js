module.exports = function (grunt) {
    
    var platforms = parsePlatforms(grunt.option('platforms'));

    console.log('platforms >> ', platforms);

    grunt.initConfig({
        nodewebkit: {
            options: {
                version: '0.12.0',
                build_dir: './build', // Where the build version of my node-webkit app is saved
                //mac_icns: './images/popcorntime.icns', // Path to the Mac icon file
                platforms: platforms
            },
            src: ['./misc/**', './public/**', './models/**', './public/**', './js/**', './ui/**', './routes/**', './node_modules/**', '!./node_modules/grunt*/**', './index.html', './app.js', './server.js', './package.json', './README.md'] // Your node-webkit app './**/*'
        },
        copy: {
            main: {
                files: [
                    {
                    src: 'lib/ffmpegsumo/win32/ffmpegsumo.dll',
                    dest: 'build/prototype/win32/ffmpegsumo.dll'
                    },
                    {
                    src: 'lib/ffmpegsumo/win64/ffmpegsumo.dll',
                    dest: 'build/prototype/win64/ffmpegsumo.dll'
                    },
                    {
                    src: 'lib/ffmpegsumo/osx32/ffmpegsumo.so',
                    dest: 'build/prototype/osx32/prototype.app/Contents/Frameworks/nwjs Framework.framework/Libraries/ffmpegsumo.so'
                    },
                    {
                    src: 'lib/ffmpegsumo/osx64/ffmpegsumo.so',
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

var parsePlatforms = function (argumentPlatform) {
    
    var allPlatforms = ['win32', 'win64', 'osx32', 'osx64'];
    
    if(argumentPlatform === undefined){
        return ['win32', 'win64', 'osx32', 'osx64'];
    }else{
        var platforms = [];
        argumentPlatform.split(',').forEach(function(platform){
            platforms.push(platform);
        });
        return platforms
    }
}
