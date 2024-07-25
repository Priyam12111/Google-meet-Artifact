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

function initializeStyles() {
  try {
    document.querySelector(".a4cQT").style = "height:50px";
  } catch (error) {
    console.log("Error applying initial styles:", error);
  }
}

function toggleCaptions() {
  try {
    const Cap = document.querySelector(
      ".VfPpkd-Bz112c-LgbsSe.fzRBVc.tmJved.xHd4Cb.rmHNDe"
    );
    if (Cap && Cap.innerText.includes("off")) {
      console.log("Caption Turned On With minimised size");
      document
        .querySelector(".VfPpkd-Bz112c-LgbsSe.fzRBVc.tmJved.xHd4Cb.rmHNDe")
        .click();
    }
  } catch (error) {
    console.log("Error toggling captions:", error);
  }
}

function saveToLocalStorage(texts, savedTextsKey) {
  localStorage.setItem(savedTextsKey, JSON.stringify(texts));
}

function getFromLocalStorage(savedTextsKey) {
  const saved = localStorage.getItem(savedTextsKey);
  return saved ? JSON.parse(saved) : [];
}

function setupMutationObserver() {
  try {
    const savedTextsKey = document.title;

    // Clear local storage
    localStorage.removeItem(savedTextsKey);

    let savedTexts = getFromLocalStorage(savedTextsKey);
    let element = document.querySelector(".iOzk7");
    let debounceTimeout;
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
            document.querySelector(".JHK7jb.Nep7Ue").style = "background:black";
            return;
          }
          savedTexts.push(text);
          saveToLocalStorage(savedTexts, savedTextsKey);
        }
      }, 2000);
    });
    if (element) {
      const endButton = document.createElement("button");
      endButton.id = "StopRecording";
      endButton.innerText = "End";
      endButton.style = `
        padding: 10px 20px;
        background-color: #ff3d00; /* Google Meet red */
        color: white;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        transition: background-color 0.3s ease, box-shadow 0.3s ease;
        z-index: 1000;
      `;
      endButton.onmouseover = () => {
        endButton.style.backgroundColor =
          "#e03a00"; /* Slightly darker red on hover */
        endButton.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
      };
      endButton.onmouseout = () => {
        endButton.style.backgroundColor = "#ff3d00";
        endButton.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
      };
      document.querySelector(".Tmb7Fd").appendChild(endButton);

      endButton.addEventListener("click", () => {
        if (observer) {
          observer.disconnect();
          sendTextsToServer(savedTextsKey, savedTexts);
          console.log("Observer manually disconnected.");
          document
            .querySelector(".VfPpkd-Bz112c-LgbsSe.fzRBVc.tmJved.xHd4Cb.rmHNDe")
            .click();
          document.querySelector(".JHK7jb.Nep7Ue").style = "background:black";
          document.querySelector("#StopRecording").style = "display:None";
        } else {
          console.log("Observer Not Found.");
        }
      });
    }
    if (element) {
      console.log("Element found, setting up MutationObserver...");
      console.log("[:] Recording Started");
      observer.observe(element, { childList: true, subtree: true });
    } else {
      console.log("Please turn on the Extension to Record the Meeting");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// Initialize styles, toggle captions, MutationObserver, and button setup
initializeStyles();
toggleCaptions();
setupMutationObserver();
