require('dotenv').config();
const express           = require('express');
const app               = express();
const compile           = require("./ethereum/compiler");
const deploy            = require("./ethereum/deployer");
const { info, 
        blue, 
        error}          = require('./utils/constants');









const port = process.env.PORT || 3000;
app.listen(port,  async ()=> {
    console.log(info(`server running on ${port}`))
    
    try{
        const resultCompilation = compile();
        console.log(info(resultCompilation))
        
        console.log(blue('Deploying Smart contract ... '))
        
        const resultDeploy = await deploy();
        console.log(info(`Deployed Smart contract successfully to ${JSON.parse(resultDeploy).address}`))
    } catch(err){
        console.log(error(err))
    }

})

module.exports = app;


