var keygen = require('ssh-keygen');
var publicIp = require('public-ip');
var fs = require('fs');

module.exports = {

    createKeypair: (done, error) => {
        if (!fs.existsSync('./keys')){
            fs.mkdirSync('./keys');
        }
        
        var location = './keys/key_rsa';
        
        keygen({
            location: location
        }, function(err, out){
            if(err) return error(err);

            done(out.pubKey, out.key);
        });
    },

    getIP: (cb) => {
        publicIp.v4().then(ip => {
            cb(ip);
        }).catch(e => {
            publicIp.v6().then(ip => {
                cb(`[${ip}]`);
            });
        });
    }

};