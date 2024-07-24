console.log("Injected script running part 2!");

async function sendTextsToServer(id, texts) {
  try {
    const response = await fetch(
      "https://hosting-api-production.up.railway.app/saveTexts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, texts }),
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.error("Error sending texts to server:", error);
  }
}

try {
  let Cap = document.querySelector("#ucc-9");
  if (!Cap.innerText.includes("off")) {
    console.log("Caption Turned On");
    document
      .querySelector(".VfPpkd-Bz112c-LgbsSe.fzRBVc.tmJved.xHd4Cb.rmHNDe")
      .click();
  } else {
    console.log("Caption Turned OFF " + Cap.innerText);
  }
} catch (error) {
  console.log("Error:", error);
}

try {
  const savedTextsKey = document.title;

  // Clear local storage
  localStorage.removeItem(savedTextsKey);

  // Save text to local storage
  function saveToLocalStorage(texts) {
    localStorage.setItem(savedTextsKey, JSON.stringify(texts));
  }

  // Retrieve text from local storage
  function getFromLocalStorage() {
    const saved = localStorage.getItem(savedTextsKey);
    return saved ? JSON.parse(saved) : [];
  }

  let savedTexts = getFromLocalStorage();
  let element = document.querySelector(".iOzk7");
  let debounceTimeout;

  if (element) {
    console.log("Element found, setting up MutationObserver...");
    console.log("[:] Recording Started");
    const observer = new MutationObserver(async (mutations) => {
      clearTimeout(debounceTimeout);

      debounceTimeout = setTimeout(async () => {
        const text = element.innerText.trim();
        if (text !== "" && !savedTexts.includes(text)) {
          if (text.includes("terminate")) {
            if (observer) {
              observer.disconnect();
              await sendTextsToServer(savedTextsKey, savedTexts); // Ensure async is handled properly
              console.log("Observer Disconnected...");
            }
            console.log("End");
            return;
          }
          savedTexts.push(text);
          saveToLocalStorage(savedTexts);
        }
      }, 2000);
    });

    observer.observe(element, { childList: true, subtree: true });
  } else {
    console.log("Please turn on the Extension to Record the Meeting");
  }
} catch (error) {
  console.error("An error occurred:", error);
}
