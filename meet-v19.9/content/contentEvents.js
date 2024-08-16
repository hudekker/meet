const observer = new MutationObserver((list) => {
  const evt = new CustomEvent("dom-changed", { detail: list });
  document.body.dispatchEvent(evt);
});

observer.observe(document.body, {
  attributes: true,
  childList: true,
  subtree: true,
});

const waitForJoinButton = setInterval(() => {
  // btnPresent = document.querySelector(`[data-response-delay-ms="5000"]`);
  // btnPresent = document.querySelectorAll("button[data-idom-class]")[2];
  // btnPresent = document.querySelector("button[data-idom-class]");

  // 2023-08-30
  let btnPresent = null;

  // 2023-08-16
  btnsArr = document.querySelectorAll("button[data-idom-class]");

  for (let i = 0; i < btnsArr.length - 2; i++) {
    if (btnsArr[i].parentElement.parentElement == btnsArr[i + 1].parentElement.parentElement) {
      btnPresent = btnsArr[i];
      console.log("found btnPresent");
      console.log(btnPresent);
      break;
    }
  }
  // let joinText = "//span[text()='Join now']";
  // let joinSpan = document.evaluate(joinText, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

  if (btnPresent) {
    // btnJoin = btnPresent.previousSibling;
    // btnJoin = btnPresent;
    btnJoin = document.querySelector("[data-is-touch-wrapper] button[data-idom-class][data-promo-anchor-id]");

    console.log("btnJoin = ", btnJoin);
  } else {
    btnJoin = false;
  }

  (async () => {
    try {
      let { breakout: test2 } = await chromeStorageLocalGet("breakout");
      let boolJoin = false;

      if (test2.myRooms && test2.myRooms.length > 0) {
        let rooms = test2.myRooms;

        for (let i = 0; i < rooms.length; i++) {
          if (getMeetUrlBase(document.URL) == rooms[i].linkFetchedUrl) {
            if (i == 0) {
              if (test2.settings.autoJoinMain) {
                boolJoin = true;
              }
            } else {
              if (test2.settings.autoJoinBreakouts) {
                boolJoin = true;
              }
            }

            g_relelvant = true;
            break;
          }
        }
      }

      if (btnJoin) {
        if (boolJoin) {
          await sleep(1000);
          // joinSpan.click();
          btnJoin.click();
        }
        console.log("waitForJoinButton cleared");
        clearInterval(waitForJoinButton);
      }
    } catch (err) {}
  })();
}, 1000);

// Extra

document.body.addEventListener("dom-changed", (evt) => {
  try {
    // Get the breakout object
    if (!g_myBreakout) {
      (async () => {
        let { breakout: test } = await chromeStorageLocalGet("breakout");
        myBreakout = test;
        g_myBreakout = myBreakout;
      })();
    }

    // If haven't initialized...
    if (!g_joinedFlag && g_myBreakout) {
      // Open the meets in muted video and mic mode
      let btns = document.querySelectorAll('[role="button"][data-is-muted]');
      if (btns.length > 1) {
        btnMic = btns[0];
        btnVid = btns[1];
        let micIsMuted = btnMic.dataset.isMuted == "true";
        let vidIsMuted = btnVid.dataset.isMuted == "true";
        if (!micIsMuted) {
          btnMic.click();
        }
        if (!vidIsMuted) {
          btnVid.click();
        }
      }

      // Give yourself some time before trying to initialize
      (async () => {
        await sleep(5000);

        oneTimeClick();
      })();

      // Always update the speaker audio if initialized
    } else {
      // alwaysUpdateSpkAudio();
      setBtnColor();
      setTabColor();
    }

    // Auto enter flag
    if (g_autoEnterFlag) {
      autoAdmit(evt);
    }

    // Google classroom sync
    if (!g_synced) {
      syncNick();
    }

    toggleTitle();

    // await setTabTitle();
  } catch (err) {
    console.log(`error in try/catch for 'dom-changed' ${JSON.stringify(err)}`);
  }

  return true;
});

// const alwaysUpdateSpkAudio = () => {
//   const lt_audio = document.querySelectorAll("audio");
//   const l_btn = document.querySelector("[data-btn-breakout='spk']");

//   if (l_btn) {
//     for (let i = 0; i < lt_audio.length; i++) {
//       // console.log("update spk audio");
//       // l_btn.dataset.isMuted == "true" ? (lt_audio[i].volume = 0) : (lt_audio[i].volume = 1);
//       l_btn.dataset.isMuted == "true" ? (lt_audio[i].muted = true) : (lt_audio[i].muted = false);
//     }
//   }
// };

chrome.runtime.onMessage.addListener((payload, sender, cb) => {
  // console.log(payload);
  let meetBottomBar;

  switch (payload.action) {
    case "hideBar":
      meetBottomBar =
        document.querySelector("[data-btn-breakout]").parentElement.parentElement.parentElement.parentElement;
      meetBottomBar.style.display = "none";
      break;
    case "unHideBar":
      meetBottomBar =
        document.querySelector("[data-btn-breakout]").parentElement.parentElement.parentElement.parentElement;
      meetBottomBar.style.display = "";
      break;
    case "updateUrl":
      document.location.href = payload.url;
      cb({ message: "Done" });
      break;

    case "statusStudents":
      break;

    case "muting":
      handleMutingFromContext(payload);
      cb({ msg: "muting done" });
      break;

    case "getWindowScreen":
      cb({
        availLeft: window.screen.availLeft,
        availWidth: window.screen.availWidth,
      });
      break;

    case "updateTabTitle2":
      console.log("updateTabTable2");
      break;

    case "updateTabTitle":
      (async () => {
        await setTabTitle();
      })();
      break;

    case "updateToolbarColors":
      updateToolbarColors();
      break;

    case "showAllPpt":
      showAllPpt();
      console.log(`my pptId = ${pptId}`);
      break;

    case "closeAllPpt":
      if (document.querySelector('[aria-label="Close"]')) {
        document.querySelector('[aria-label="Close"]').click();
      }
      break;

    case "getPpt":
      let ppt = getParticipants2();
      cb({ ppt });
      break;

    case "remove":
      removeParticipant(payload.pptId);
      cb({ msg: "ok" });
      break;

    case "muteAll":
      muteAll();
      break;

    case "getReferrer":
      let referrer = window.document.referrer;
      cb({ referrer });
      break;

    case "syncGC":
      syncGC2();
      break;

    case "removeAll":
      removeAll((boolClose = false));
      break;

    case "hangup":
      hangup((boolClose = false));
      break;

    case "closeRoom":
      removeAll((boolClose = true), (winId = payload.winId), (tabId = payload.tabId));

      cb({ msg: "room closed" });
      break;

    case "sendAssignments":
      const messages = payload.messages;
      handleSendAssignments(messages);
      break;

    default:
      break;
  }
});
