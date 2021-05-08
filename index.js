/**
 * deploi
 * @author Sayanjyoti Das
*/

var deploy = require('./deploy.json');
var bodyParser = require('body-parser');
var server = require('express')();
var core = require('./core/core');

server.use(bodyParser.json());

server.get('/', (req, res) => {
    console.log(req.body);

    res.end();
});

//create a server object:
server.listen(deploy.port);