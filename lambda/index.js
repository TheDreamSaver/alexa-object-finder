"use strict";

var Alexa = require("alexa-sdk");
const axios = require('axios');
const dashbot = require('dashbot')('C6PJSfKX83Cgfdb3uTECvXSr7bVtFB4zV0iOFq07').alexa;
var i =0;

var handlers = {
   "LaunchRequest": function () {
        this.response.speak("Welcome to Where's my stuff? Now you don't have to worry about where you put that bottle, keys or mobile phone anymore. Keep track of your things using Alexa. So what do you wanna find this time?").listen("For example you can ask where is my wallet?"); 
        this.emit(":responseReady");       
   },
   "findMyObjectIntent": function () {
        this.attributes.object = slotValue(this.event.request.intent.slots.object);
        axios.get(`https://www.lithics.in/apis/alexa/getObjectLocation.php?object=${this.attributes.object}`)
        .then( res => res.data )
        .then( res => {
            this.response.speak(res+" Is there anything else you want to find?").listen("For example you can ask where is my wallet?"); ; 
            this.emit(":responseReady");
        });
               
    },
    'AMAZON.YesIntent': function () {
        this.response.speak("What else do you want to find?").listen("For example you can ask where is my wallet?"); 
        this.emit(":responseReady");
    },
    'AMAZON.NoIntent': function () {
        this.response.speak('Thanks for using Where\'s my stuff!')
        this.emit(':responseReady');
    },
   'SessionEndedRequest': function () {
        console.log('session ended!');
        this.emit(':saveState', true);

   },
    'AMAZON.HelpIntent': function () {
        this.response.speak('Welcome to Where\'s my stuff? Now you don\'t have to worry about where you put that bottle, keys or mobile phone. Keep track of your objects using Alexa. For example you can ask where is my wallet?').listen('You can ask where is my wallet?');
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak('Thanks for using Where\'s my stuff!');
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak('Thanks for using Where\'s my stuff!');
        this.emit(':responseReady');
    },

};



function slotValue(slot, useId){
    if(slot.value == undefined){
        return "undefined";
    }
    let value = slot.value;
    let resolution = (slot.resolutions && slot.resolutions.resolutionsPerAuthority && slot.resolutions.resolutionsPerAuthority.length > 0) ? slot.resolutions.resolutionsPerAuthority[0] : null;
    if(resolution && resolution.status.code == 'ER_SUCCESS_MATCH'){
        let resolutionValue = resolution.values[0].value;
        value = resolutionValue.id && useId ? resolutionValue.id : resolutionValue.name;
    }
    return value;
}


// This is the function that AWS Lambda calls every time Alexa uses your skill.
exports.handler = dashbot.handler(function(event, context, callback) {

// Set up the Alexa object
var alexa = Alexa.handler(event, context);
// Register Handlers
alexa.registerHandlers(handlers); 

// Start our Alexa code
alexa.execute(); 
  
});
