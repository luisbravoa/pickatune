module.exports = function (grunt) {
    
    var platforms = parsePlatforms(grunt.option('platforms'));

    var compressConfig = getCompressConfig(platforms, getCurrentVersion());

    var secret = {};
    try {
        secret = grunt.file.readJSON('secret.json');
    } catch (err) {}

    console.log(platforms.map(function(platform){ return "dist/Pickatune-" + platform+ "-<%= pkg.version %>.zip";}));

    grunt.initConfig({
        secret: secret,
        pkg: grunt.file.readJSON('package.json'),
        sftp: {

            test: {
                files: {
                    "./": platforms.map(function(platform){ return "dist/"+platform+"/Pickatune-" + platform+ "-<%= pkg.version %>.zip";})
                },
                options: {
                    path: '/var/www/pickatune.net/public/dist',
                    host: '<%= secret.host %>',
                    username: '<%= secret.username %>',
                    password: '<%= secret.password %>',
                    showProgress: true,
                    srcBasePath: "dist/"
                }
            }
        },
        nwjs: {
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
                    },
                    {
                    src: 'lib/ffmpegsumo/linux64/libffmpegsumo.so',
                    dest: 'build/prototype/linux64/libffmpegsumo.so'
                    },
                    {
                    src: 'lib/ffmpegsumo/linux32/libffmpegsumo.so',
                    dest: 'build/prototype/linux32/libffmpegsumo.so'
                    }
                ]
            }
        },
        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['package.json'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: false,
                pushTo: 'origin',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
                globalReplace: false,
                prereleaseName: false,
                regExp: false
            }
        },
        compress: compressConfig
    });
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-nw-builder');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-ssh');
    grunt.registerTask('build', ['nwjs', 'copy']);

    grunt.registerTask('changelog', 'A task that updates the changelog', function() {
        var version = getCurrentVersion();
        var header = '##' + version + ' (' + new Date().toDateString() + ')';
        var changeLogFile = grunt.file.read('changelog.md');
        var latestHeader = '##latest';
        var newChangeLog = latestHeader + '\r\n\r\n\r\n';

        if(changeLogFile.indexOf('##'+version) !== -1){
            grunt.fail.fatal('Version has not been increased.');
        }

        if(changeLogFile.indexOf(latestHeader) !== 0){
            grunt.fail.fatal('No latest header');
        }

        var latestRegExp = new RegExp('^(' + latestHeader + ')((.|\r|\n)*?)(##)', 'gm');

        var match = changeLogFile.match(latestRegExp);
        if(match === null || match[0].indexOf('*') === -1){
            grunt.fail.fatal('No new changes');
        }

        newChangeLog += changeLogFile.replace(latestHeader, header);
        grunt.log.writeln(newChangeLog);
        grunt.file.write('changelog.md', newChangeLog);

    });

    function getCurrentVersion() {
        return grunt.file.readJSON('package.json').version;
    }

};
var parsePlatforms = function (argumentPlatform) {

    var allPlatforms = ['win32', 'win64', 'osx32', 'osx64', 'linux32', "linux64"];

    if(argumentPlatform === undefined){
        return allPlatforms;
    }else{
        var platforms = [];
        argumentPlatform.split(',').forEach(function(platform){
            platforms.push(platform);
        });
        return platforms
    }
};

function getCompressConfig(platforms, version){
    var compressConfig = {};

    platforms.forEach(function(platform){
        compressConfig[platform] = {
            options: {
                archive: function () {
                    return 'dist/' + platform + '/Pickatune-' + platform + '-'+version+'.zip'
                }
            },
            expand: true,
            cwd: 'build/prototype/' + platform,
            src: ['**/*']
        };
    });

    return compressConfig;
}