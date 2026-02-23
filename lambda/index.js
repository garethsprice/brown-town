const Alexa = require('ask-sdk-core');

const AUDIO_URL = process.env.AUDIO_URL || 'https://example.s3.amazonaws.com/brown_noise.mp3';
const TOKEN_PREFIX = 'brown-noise';

const LAUNCH_PHRASES = [
  'All aboard the sleepy train to Brown Town.',
  'You\'ve arrived in Brown Town. Population: you, and a million cozy frequencies.',
  'Welcome to Brown Town. Please keep your eyes closed and your worries at the door.',
  'Now entering Brown Town. Estimated time of awakening: who cares.',
  'Brown Town city limits. No thinking allowed beyond this point.',
  'The mayor of Brown Town has prepared your pillow. Sweet dreams.',
  'Gate 47 to Brown Town is now boarding. Final destination: sleep.',
  'You have reached Brown Town. The forecast tonight is a hundred percent brown and drowsy.',
  'Passport to Brown Town: approved. Consciousness: revoked.',
  'Welcome to Brown Town, the only town where doing nothing is the law.',
  'Arriving in Brown Town. Please stow your thoughts in the overhead compartment.',
  'Brown Town welcomes you. Shoes off. Brain off. Noise on.',
  'This is your captain speaking. We are beginning our descent into Brown Town.',
  'Another night, another trip to Brown Town. Let\'s get cozy.',
  'Rolling out the brown carpet just for you. Night night.',
  'Whoa there, old horse. Time to ride off into the brown sunset.',
  'Goodnight sleepy sweetie. The brown noise will take it from here.',
  'Even the sweetest kat needs rest. Welcome to Brown Town.',
  'Sweet kat, your bed in Brown Town has been freshly fluffed.',
];

function randomPhrase() {
  return LAUNCH_PHRASES[Math.floor(Math.random() * LAUNCH_PHRASES.length)];
}

function getToken() {
  return `${TOKEN_PREFIX}-${Date.now()}`;
}

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(randomPhrase())
      .addAudioPlayerPlayDirective('REPLACE_ALL', AUDIO_URL, getToken(), 0)
      .getResponse();
  },
};

const PlayIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      (Alexa.getIntentName(handlerInput.requestEnvelope) === 'PlayIntent' ||
        Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.ResumeIntent')
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Welcome back to Brown Town.')
      .addAudioPlayerPlayDirective('REPLACE_ALL', AUDIO_URL, getToken(), 0)
      .getResponse();
  },
};

const StopIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent' ||
        Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent' ||
        Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.PauseIntent')
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .addAudioPlayerStopDirective()
      .getResponse();
  },
};

// This is the seamless loop handler.
// When playback is about to finish, enqueue the same track again.
const PlaybackNearlyFinishedHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'AudioPlayer.PlaybackNearlyFinished';
  },
  handle(handlerInput) {
    const currentToken = handlerInput.requestEnvelope.request.token;
    return handlerInput.responseBuilder
      .addAudioPlayerPlayDirective('ENQUEUE', AUDIO_URL, getToken(), 0, currentToken)
      .getResponse();
  },
};

// Required AudioPlayer event handlers — must return empty responses
const PlaybackStartedHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'AudioPlayer.PlaybackStarted';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.getResponse();
  },
};

const PlaybackFinishedHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'AudioPlayer.PlaybackFinished';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.getResponse();
  },
};

const PlaybackStoppedHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'AudioPlayer.PlaybackStopped';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.getResponse();
  },
};

const PlaybackFailedHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'AudioPlayer.PlaybackFailed';
  },
  handle(handlerInput) {
    console.log('Playback failed:', JSON.stringify(handlerInput.requestEnvelope.request.error));
    return handlerInput.responseBuilder.getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent'
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Say take me to Brown Town to start, or stop to turn it off.')
      .reprompt('Say take me to Brown Town, or stop.')
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error: ${error.message}`);
    return handlerInput.responseBuilder
      .speak('Something went wrong. Say take me to Brown Town to try again.')
      .getResponse();
  },
};

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    PlayIntentHandler,
    StopIntentHandler,
    HelpIntentHandler,
    PlaybackNearlyFinishedHandler,
    PlaybackStartedHandler,
    PlaybackFinishedHandler,
    PlaybackStoppedHandler,
    PlaybackFailedHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
