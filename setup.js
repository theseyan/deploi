/**
 * autodeploy - Setup script
 * @author Sayanjyoti Das
*/

var edit = require("edit-json-file");
var inquirer = require('inquirer');
var core = require('./core/core');
var config = edit('./deploy.json');
var uuid = require('uuid');

module.exports.init = () => {
    console.log("Let's set up your app for auto-deployment!");
    inquirer.prompt([
        {
            type: 'input',
            name: 'repository',
            message: 'Enter the URL of your Git repository',
        },
        {
            type: 'input',
            name: 'branch',
            message: 'Which branch do you want to auto-deploy from?',
            default: 'origin/main',
        },
        {
            type: 'input',
            name: 'root',
            message: 'Where do you want the app to be deployed in?',
            default: __dirname,
        },
        {
            type: 'input',
            name: 'port',
            message: 'Which port should the webhook server run on?',
            default: 3001,
            filter: Number
        },
    ]).then(answers1 => {

        console.log("Fetching your public IP address...");
        core.getIP(ip => {
            var hookUrl = "http://" + ip + ':' + answers1.port;
            var secret = uuid.v4();

            console.log(`Please add "${hookUrl}" as a Webhook URL to your Git repository settings\nEnter "${secret}" as the Secret.`);
            inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'done',
                    message: 'Are you done?',
                    default: true
                },
            ]).then(answers2 => {
                if(answers2.done === false) console.log("Well, let's finish this anyways :P"); 
                console.log('Generating deploy key...');

                core.createKeypair((public, priv) => {
                    console.log("Please add the below Public SSH RSA key as a Deploy key to your Git repository");
                    console.log(public);

                    inquirer.prompt([
                        {
                            type: 'confirm',
                            name: 'done',
                            message: 'Are you done?',
                            default: true
                        },
                    ]).then(answers3 => {
                        if(answers3.done === false) console.log("We're almost done, it's too late to stop me :P");
                        console.log("Saving configuration...");

                        config.set('repository', answers1.repository);
                        config.set('branch', answers1.branch);
                        config.set('root', answers1.root);
                        config.set('port', answers1.port);
                        config.set('secret', secret);
                        config.set('privateKey', priv);
                        config.save((err) => {
                            if(err) {
                                console.error('There was an error while saving your configuration: ' + err);
                                return;
                            }

                            console.log("Configuration saved successfully.");
                            console.log("You can now start the auto-deploy server by running `autodeploy start`.");
                        });
                    });
                });
            });
        });

    }).catch(error => {
        if(error.isTtyError) {
            return console.error('A rendering issue occurred.');
        } else {
            return console.error('An error occurred.');
        }
    });
};