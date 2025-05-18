chrome.storage.sync.get(['usernames', 'hide', 'hideMentions'], ({ hide, usernames, hideMentions }) => {
  if (hide == null) hide = true;
  if (hideMentions == null) hideMentions = false;
  document.getElementById('hide').checked = hide;
  document.getElementById('hide-mentions').checked = hideMentions;
  if (usernames != null) document.getElementById('usernames').value = usernames;
});

function saveChanges() {
  const usernames = document.getElementById('usernames').value;
  const hide = document.getElementById('hide').checked;
  const hideMentions = document.getElementById('hide-mentions').checked;
  chrome.storage.sync.set({ usernames, hide, hideMentions });
}

document.getElementById('usernames').addEventListener('input', saveChanges);
document.getElementById('hide').addEventListener('click', saveChanges);
document.getElementById('hide-mentions').addEventListener('click', saveChanges);
