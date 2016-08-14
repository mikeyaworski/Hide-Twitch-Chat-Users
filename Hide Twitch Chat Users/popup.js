// load the saved values from the Chrome extension storage API
chrome.storage.sync.get(['hideBool', 'usernamesStr'], function(result) {
    var hideBool = result['hideBool'];
    var usernamesStr = result['usernamesStr'];
    if (hideBool != null) {
        document.getElementById('hide').checked = hideBool;
    }
    if (usernamesStr != null) {
        document.getElementById('input').value = usernamesStr;
    }
});

document.getElementById('input').addEventListener('input', saveChanges);
document.getElementById('hide').addEventListener('click', saveChanges);

function saveChanges() {
    var usernamesStr = document.getElementById('input').value;
    var hideBool = document.getElementById('hide').checked;
    
    chrome.storage.sync.set({usernamesStr: usernamesStr, hideBool: hideBool});
}