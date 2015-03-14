var cardcast = (function() {

    console.log('card cast 1', cardcast);

    var ns = cardcast || {};

    var MESSAGE_BUS = 'urn:x-cast:com.peerweidner.cardcast';

    /**
     * Receiver instance
     *
     * @constructor
     */
    ns.Receiver = function Receiver() {

        // Log nothin, I guess...
        window.cast.receiver.logger.setLevelValue(0);

        var castReceiverManager = cast.receiver.CastReceiverManager.getInstance();

        log('Starting Receiver Manager');
        log('MESSAGE_BUS: ' + MESSAGE_BUS);

        // handler for the 'ready' event
        castReceiverManager.onReady = function(event) {
            log('Received Ready event: ' + JSON.stringify(event.data));
            castReceiverManager.setApplicationState("Application status is ready...");
        };

        // handler for 'senderconnected' event
        castReceiverManager.onSenderConnected = function(event) {
            log('Received Sender Connected event: ' + event.data);
            log(castReceiverManager.getSender(event.data).userAgent);
        };

        // handler for 'senderdisconnected' event
        castReceiverManager.onSenderDisconnected = function(event) {
            console.log('Received Sender Disconnected event: ' + event.data);
            if (castReceiverManager.getSenders().length == 0) {
                window.close();
            }
        };

        // handler for 'systemvolumechanged' event
        castReceiverManager.onSystemVolumeChanged = function(event) {
            log('Received System Volume Changed event: ' + event.data['level'] + ' ' +
            event.data['muted']);
        };
        // create a CastMessageBus to handle messages for a custom namespace
        window.messageBus =
            castReceiverManager.getCastMessageBus(MESSAGE_BUS);
        // handler for the CastMessageBus message event
        window.messageBus.onMessage = function(event) {
            log('Message [' + event.senderId + ']: ' + event.data);
            // display the message from the sender
            displayText(event.data);
            // inform all senders on the CastMessageBus of the incoming message event
            // sender message listener will be invoked
            window.messageBus.send(event.senderId, event.data);
        };
        // initialize the CastReceiverManager with an application status message
        castReceiverManager.start({statusText: "Application is starting"});
        console.log('Receiver Manager started');
    };

    // utility function to display the text message in the input field
    function displayText(text) {

        $('.card').toggleClass('turn');

        console.log(text);
        document.getElementById("message").innerHTML=text;
        castReceiverManager.setApplicationState(text);
    }

    // utility function to display the log message in the input field
    function log(text) {
        console.log(text);
        document.getElementById("log").innerHTML+= '<br>'+text;
    }

    console.log('card cast 2', ns);

    return ns;

})();

console.log('card cast 3 ', cardcast);
