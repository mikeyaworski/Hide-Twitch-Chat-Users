// get the data from the Chrome extension storage API here (has to be in a content script)
// and put it in the DOM so that the script.js can remove the comments based off this preference data
chrome.storage.sync.get(['hideBool', 'usernamesStr'], function(result) {
    var hideBool = result['hideBool'];
    var usernamesStr = result['usernamesStr'];

    var s = document.createElement('script');
    s.src = chrome.extension.getURL('script.js');
    
    // for accessing preferences from script.js
    var prefs = document.createElement('div');
    prefs.id = "hide-twitch-chat-users-prefs";
    prefs.style = "display:none";
    prefs.setAttribute('hide', hideBool);
    prefs.setAttribute('usernames', usernamesStr);
    
    s.onload = function() {
        this.parentNode.removeChild(this);
    };
    (document.head || document.documentElement).appendChild(s);
    (document.head || document.documentElement).appendChild(prefs);
});