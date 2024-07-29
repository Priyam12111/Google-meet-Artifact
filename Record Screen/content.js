console.log("Injected script running part 2!");

async function sendTextsToServer(id, texts, startTime, endTime) {
  try {
    const response = await fetch(
      "https://hosting-api-production.up.railway.app/saveTexts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, texts, startTime, endTime }),
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
    let startTime = new Date();
    const utcOffset = 5.5 * 60; // 5 hours and 30 minutes in minutes
    const localTime = new Date(startTime.getTime() + utcOffset * 60 * 1000);
    startTime = localTime.toISOString().replace("Z", "+05:30");
    let debounceTimeout;
    const observer = new MutationObserver(async (mutations) => {
      clearTimeout(debounceTimeout);

      debounceTimeout = setTimeout(async () => {
        const text = element.innerText.trim();
        if (text !== "" && !savedTexts.includes(text)) {
          if (text.includes("terminate")) {
            if (observer) {
              observer.disconnect();
              let endTime = new Date();
              const utcOffset = 5.5 * 60; // 5 hours and 30 minutes in minutes
              const localTime = new Date(
                startTime.getTime() + utcOffset * 60 * 1000
              );
              endTime = localTime.toISOString().replace("Z", "+05:30");
              await sendTextsToServer(
                savedTextsKey,
                savedTexts,
                startTime,
                endTime
              ); // Ensure async is handled properly
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
    background-color: rgb(194, 251, 215);
    border-radius: 100px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px;
    color: green;
    cursor: pointer;
    display: inline-block;
    font-family: CerebriSans-Regular, -apple-system, system-ui, Roboto, sans-serif;
    padding: 9px 23px;
    text-align: center;
    text-decoration: none;
    transition: all 250ms ease 0s;
    border: 0px;
    font-size: 16px;
    user-select: none;
    touch-action: manipulation;
    margin: 9px;
      `;

      endButton.onmouseover = () => {
        endButton.style.backgroundColor = "#c2fb17";
        endButton.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
      };
      endButton.onmouseout = () => {
        endButton.style.backgroundColor = "#c2fbd7";
        endButton.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
      };
      document.querySelector(".Tmb7Fd").appendChild(endButton);

      endButton.addEventListener("click", () => {
        if (observer) {
          observer.disconnect();
          let endTime = new Date();
          const utcOffset = 5.5 * 60; // 5 hours and 30 minutes in minutes
          const localTime = new Date(endTime.getTime() + utcOffset * 60 * 1000);
          endTime = localTime.toISOString().replace("Z", "+05:30");
          sendTextsToServer(savedTextsKey, savedTexts, startTime, endTime);
          console.log("Observer manually disconnected.");
          document
            .querySelector(".VfPpkd-Bz112c-LgbsSe.fzRBVc.tmJved.xHd4Cb.rmHNDe")
            .click();
          document.querySelector(".JHK7jb.Nep7Ue").style = "background:black";
          document.querySelector("#StopRecording").style = "display:None";
          return;
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
