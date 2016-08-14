var hideBool = document.getElementById('hide-twitch-chat-users-prefs').getAttribute('hide');
var usernamesStr = document.getElementById('hide-twitch-chat-users-prefs').getAttribute('usernames');

function removeComments() {
    
    if (hideBool == 'true') {
        var usernamesArr = usernamesStr.split(/[,\s+]/g); // split by whitespace and commas
        
        // convert usernames to lower case so that the comparison may be case insensitive
        for (var i = 0; i < usernamesArr.length; i++) {
            usernamesArr[i] = usernamesArr[i].toLowerCase();
        }
        
        // Twitch.tv with BetterTTV Extension
        var divs = document.getElementsByTagName('div');
        for (var i = 0; i < divs.length; i++) {
            var sender = divs[i].getAttribute('data-sender');
            
            if (sender != null && usernamesArr.indexOf(sender.toLowerCase()) > -1) { // the sender is in the list of blocked users
                divs[i].setAttribute('style', 'display:none');
            } else if (sender != null) {
                divs[i].setAttribute('style', 'display:block');
            }
        }
        
        // normal Twitch.tv
        var lis = document.getElementsByTagName('li');
        for (var i = 0; i < lis.length; i++) {
            var liId = lis[i].getAttribute('id');
            var fromElement = document.querySelector("li#" + liId + " .from");
            
            if (fromElement != null && usernamesArr.indexOf(fromElement.innerHTML.toLowerCase()) > -1) {
                lis[i].setAttribute('style', 'display:none');
            } else if (fromElement != null) {
                lis[i].setAttribute('style', 'display:block');
            }
        }
    }
}

setInterval(removeComments, 100); // remove new comments every 0.1 seconds