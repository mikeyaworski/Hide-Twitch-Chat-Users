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
  if (res.usernames) usernames = parseUsernamesStr(res.usernames.newValue);
});

// Alternatively, we can hide the messages by default and only show them if the username
// is found to not be one of the hidden ones
setInterval(() => {
  if (!hide) return;
  const msgs = document.querySelectorAll('.chat-line__message, .seventv-message');
  msgs.forEach(msg => {
    const authorEl = msg.querySelector('.chat-author__display-name, .seventv-chat-user-username');
    if (usernames.includes(authorEl?.innerText.toLowerCase())) {
      msg.style.display = 'none';
    }
    // Vanilla Twitch
    const replyTo = msg.getAttribute('aria-label')?.match(/Replying to ([^,]+)/)?.[1];
    if (replyTo && usernames.includes(replyTo.toLowerCase())) {
      const replyToEl = msg.querySelector('p[title^=Replying]') || msg.querySelector('p[class^=CoreText]');
      if (replyToEl) {
        replyToEl.style.display = 'none';
      }
    }
    // 7TV
    const replyToMessageEl = msg.querySelector('.seventv-reply-message-part');
    if (replyToMessageEl) {
      const replyTo = replyToMessageEl.innerText?.toLowerCase().match(/replying to @([^:]+)/)?.[1];
      if (usernames.includes(replyTo.toLowerCase())) {
        const replyPart = msg.querySelector('.seventv-reply-part');
        if (replyPart) replyPart.style.display = 'none';
      }
    }
  });
}, 100);
