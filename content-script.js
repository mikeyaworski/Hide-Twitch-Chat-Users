// defaults while we fetch from storage
let hide = false;
let usernames = [];

function parseUsernamesStr(usernamesStr = '') {
  return usernamesStr.split(/[,\s+]/g).map(u => u.toLowerCase());
}

chrome.storage.sync.get(['hide', 'usernames'], res => {
  hide = res.hide != null ? res.hide : true; // default to true if yet to be defined
  usernames = parseUsernamesStr(res.usernames);
});

chrome.storage.onChanged.addListener(res => {
  if (chrome.runtime.lastError) return;
  if (res.hide) hide = res.hide.newValue;
  if (res.usernames) usernames = res.usernames.newValue;
});

// Alternatively, we can hide the messages by default and only show them if the username
// is found to not be one of the hidden ones
setInterval(() => {
  if (!hide) return;
  const msgs = document.querySelectorAll('.chat-line__message');
  msgs.forEach(msg => {
    const authorEl = msg.querySelector('.chat-author__display-name');
    if (usernames.includes(authorEl?.innerText.toLowerCase())) {
      msg.remove();
    }
  });
}, 100);
