chrome.storage.sync.get(['hide', 'usernames'], ({ hide, usernames }) => {
  if (hide == null) hide = true; // default to true if yet to be defined
  document.getElementById('hide').checked = hide;
  if (usernames != null) document.getElementById('usernames').value = usernames;
});

function saveChanges() {
  const usernames = document.getElementById('usernames').value;
  const hide = document.getElementById('hide').checked;
  chrome.storage.sync.set({ usernames, hide });
}

document.getElementById('usernames').addEventListener('input', saveChanges);
document.getElementById('hide').addEventListener('click', saveChanges);
