
function Discovery(options) {
    this.options = options || {};

    this.bindPort = options.bindPort || 4000;
    this.bindedIp = options.bindedIp || '0.0.0.0';

    this.retries = 0;
    this.maxRetries = 10;
    this.timeout = 2000;
    

}

Discovery.prototype.search = function(success, fail){
    networkinterface.getIPAddress(function (ip) { 
        this.ip = ip;
        this.beginSearch(function(data){
            if(success){
                success(data);
            }
        },function(){
            if(fail){
                fail();
            }
        });
    }.bind(this));
}

Discovery.prototype.beginSearch = function (sucess, fail) {

    var message = JSON.stringify({
        type: 'client',
        ip: this.ip
    });

    var messageOptions = {
        message: message,
        ip: '255.255.255.255',
        port: 4000
    };


    function onTry() {
        console.log(this.retries, this.maxRetries);
        if (this.retries >= this.maxRetries) {

            this.closeSocket(function () {
                console.log('done');
                this.reset();
                if (fail) {
                    fail();
                }
            }.bind(this));
            return;
        }

        this.send(messageOptions, function () {
            //            console.log('onTry', onTry, this.timeout);
            this.timeoutHadler = setTimeout(onTry.bind(this), this.timeout);
        }.bind(this), function () {
            console.log('ERRORRRRRRRRR');
        }.bind(this));
        this.retries++;
    }


    this.createSocket(function (data) {
        try {
            var parsedMessage = JSON.parse(data);

            if (parsedMessage.type === 'server') {
                this.reset();

                clearTimeout(this.timeoutHadler);
                delete this.timeoutHadler;
                console.log('success', parsedMessage);
                if (sucess) {

                    sucess(parsedMessage);
                }
            } else {
                console.log('nope');
            }
        } catch (e) {
            console.error(e);
        }



    }.bind(this), function () {
        onTry.call(this);
    }.bind(this));




}


Discovery.prototype.reset = function () {
    // not veyy pretty
    chrome.sockets.udp.onReceive.listeners = [];
    this.retries = 0;
    delete this.socketId;
}

Discovery.prototype.send = function (options, success, error) {

    chrome.sockets.udp.send(this.socketId, str2ab(options.message),
        options.ip || '255.255.255.255', options.port || 4000,
        function (sendInfo) {
            if (sendInfo.resultCode) {
                if (error) error();
            }
            if (success) {
                success();
            }
            console.log("sent " + sendInfo.bytesSent);
        })
}

Discovery.prototype.closeSocket = function (cb) {
    chrome.sockets.udp.close(this.socketId, function () {
        if (cb) {
            cb();
        }
    })
}

Discovery.prototype.createSocket = function (onMessage, cb, error) {

    chrome.sockets.udp.create({}, function (socketInfo) {
        this.socketId = socketInfo.socketId;

        chrome.sockets.udp.onReceive.addListener(function (info) {
            if (info.socketId !== this.socketId) {
                return;
            }
            var data = ab2str(info.data)
            console.log('BOOM!', data);
            if (onMessage) {
                onMessage(data);
            }

        }.bind(this));

        chrome.sockets.udp.bind(this.socketId,
            this.bindedIp, this.bindPort,
            function (result) {
                if (result < 0) {
                    if (error) error();
                    return;
                }
                if (cb) {
                    cb();
                }
            });
    }.bind(this));
}




// From https://developer.chrome.com/trunk/apps/app_hardware.html
function str2ab(str) {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i = 0; i < str.length; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

// From https://developer.chrome.com/trunk/apps/app_hardware.html
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
};