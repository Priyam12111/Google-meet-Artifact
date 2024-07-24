chrome.action.onClicked.addListener((tab) => {
  // Open a new window
  chrome.windows.create({
    url: "popup.html",
    type: "popup",
    width: 400,
    height: 300,
  });

  // Execute the content script in the current tab
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"],
  });
});
