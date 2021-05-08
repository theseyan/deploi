/**
 * deploi
 * @author Sayanjyoti Das
*/

var deploy = require('./deploy.json');
var server = require('http');
var core = require('./core/core');

//create a server object:
server.createServer((req, res) => {
    


}).listen(deploy.port);