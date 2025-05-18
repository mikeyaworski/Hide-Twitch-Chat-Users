let intervalId = null;

// defaults while we fetch from storage
let hide = false;
let hideMentions = false;
let usernames = [];

function parseUsernamesStr(usernamesStr = '') {
  return usernamesStr.split(/[,\s+]/g).map(u => u.toLowerCase().trim()).filter(Boolean);
}

function upsertStyleSheet(css) {
  let style = document.getElementById('hide-twitch-chat-users');
  if (!style) {
    style = document.createElement('style');
    style.id = 'hide-twitch-chat-users';
    document.head.appendChild(style);
  }
  style.textContent = css;
}

function generateStyleSheet() {
  if (!hide) return '';
  return usernames.map(username => {
    const styles = [
      `.chat-line__message[data-a-user="${username}"] {
        display: none !important;
      }`,
      // Viewer List
      `#community-tab-content div:has(> .tw-link[aria-label~="${username}" i]),
      [role="listitem"]:has(> .chat-viewers-list__button[data-username="${username}" i]) {
          display: none !important;
        }`,
    ];
    if (hideMentions) {
      // The DOM differs depending on if the reply/mention is of an arbitrary user vs the broadcaster
      styles.push(`
        .chat-line__message-container > div:has( p[title~="@${username}" i]) {
          display: none !important;
        }
        .chat-line__message[aria-label~="@${username}" i],
        .chat-line__message[aria-label~="${username}" i],
        .chat-line__message[aria-label~="${username}," i] {
          display: none !important;
        }
      `);
    }
    return styles.join('\n');
  }).join('\n');
}

function getTextContainsBlockedUserMention(text) {
  return usernames.some(username => new RegExp(`@${username}($|([^a-zA-Z0-9_]))`, 'i').test(text?.toLowerCase()))
}

// The DOM for 7TV is not friendly to CSS selectors, so we need to use JS
function pollDom() {
  if (intervalId != null) clearInterval(intervalId);
  intervalId = setInterval(() => {
    if (!hide) return;
    const msgs = document.querySelectorAll('.seventv-message');
    msgs.forEach(msg => {
      const authorEl = msg.querySelector('.seventv-chat-user-username');
      if (usernames.includes(authorEl?.innerText.toLowerCase())) {
        msg.style.display = 'none';
      }
      if (hideMentions) {
        const messageEl = msg.querySelector('.seventv-chat-message-body');
        if (messageEl) {
          const containsBlockedUser = getTextContainsBlockedUserMention(messageEl.innerText);
          if (containsBlockedUser) {
            msg.style.display = 'none';
          }
        }
        const replyToMessageEl = msg.querySelector('.seventv-reply-message-part');
        if (replyToMessageEl) {
          const containsBlockedUser = getTextContainsBlockedUserMention(replyToMessageEl.innerText);
          if (containsBlockedUser) {
            const replyPart = msg.querySelector('.seventv-reply-part');
            if (replyPart) replyPart.style.display = 'none';
          }
        }
      }
    });
  }, 100);
}

chrome.storage.sync.get(['hide', 'hideMentions', 'usernames'], res => {
  hide = res.hide != null ? res.hide : true;
  hideMentions = res.hideMentions != null ? res.hideMentions : false;
  usernames = parseUsernamesStr(res.usernames);
  upsertStyleSheet(generateStyleSheet());
  pollDom();
});

chrome.storage.onChanged.addListener(res => {
  if (chrome.runtime.lastError) return;
  if (res.hide) hide = res.hide.newValue;
  if (res.hideMentions) hideMentions = res.hideMentions.newValue;
  if (res.usernames) usernames = parseUsernamesStr(res.usernames.newValue);
  upsertStyleSheet(generateStyleSheet());
  pollDom();
});
