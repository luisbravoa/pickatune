function Discover(options) {
    
    var ipAddress = require('ip').address();
    this.server = require('dgram').createSocket('udp4');
    // Bind to port 4000
    this.server.bind(4000);


    this.server.on('message', function (message) {

        try {
            var parsedMessage = JSON.parse(message);

        } catch (e) {

        }

        if (parsedMessage.type === 'client' && parsedMessage.ip !== undefined) {
            var response = JSON.stringify({
                type: 'server',
                ip: ipAddress,
                port: 2323,
                url: global.url
            });
            
            console.log(response, parsedMessage.ip);
            this.send(response, parsedMessage.ip);
        }

        console.log('received a message: ' + message);
    }.bind(this));

    this.server.on("listening", function () {
        var address = this.server.address();
        console.log("I am listening on " + address.address + ":" + address.port);
        this.server.setBroadcast(true);
    }.bind(this));

}

Discover.prototype.send = function(data, ip) {
    this.server.send(data, 0, data.length, 4000, ip, function (e) {
        console.log(e);
    });
}

module.exports = Discover;