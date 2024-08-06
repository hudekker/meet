// Globals
let g_joinedFlag = false;
let g_openedFlag = false;
let g_synced = false;
let g_autoAdmitted = false;
let g_relevant = false;

let g_spk_classList = {
  muted: [],
  mutedFalse: [],
};

let g_autoEnterFlag = null;
let g_hangup_moved = false;

let g_myBreakout;

let colors = {
  red: "#ef5350", // mat-red
  // green: "#69F0AE",
  green: "#66bb6a", // mat-green
  yellow: "#FFF59D",
};

// let { breakout: myBreakout } = await chromeStorageLocalGet("breakout");

const refreshBreakoutObject = async () => {
  let { breakout: test } = await chromeStorageLocalGet("breakout");
  g_myBreakout = test;
};

// old
const oneTimeClick_old = () => {
  (async () => {
    try {
      // let flag40 = false;

      if (g_joinedFlag) {
        return;
      }

      // sleep(5000);
      // debugger;

      // Set the auto admit g_flag_
      let { breakout: test } = await chromeStorageLocalGet("breakout");
      myBreakout = test;
      g_myBreakout = myBreakout;

      // Make sure this is relevant
      if (isRelevant() == false) {
        return;
      }

      // await sleep(5000);
      let settings = myBreakout.settings;

      g_autoEnterFlag = false;

      if (settings.autoEnter) {
        g_autoEnterFlag = true;
      }

      let btnMic = document.querySelectorAll('[role="button"][data-is-muted]')[0];
      let btnVid = document.querySelectorAll('[role="button"][data-is-muted]')[1];

      // Look to see if hangup button exists.  If so then u are inside meeting
      // This line below will fail if not inside meeting.  Try/Catch
      // ********* June 10 **********Look for the revised verison June 10

      // *** Feb 5, 2022
      let =
        btnsCheck =
        btns =
          [...document.querySelectorAll("button")]?.filter((el) =>
            el.querySelector("i")?.innerText.includes("call_end")
          );

      if (btnsCheck.length > 0) {
        btnCheck = btnsCheck[0];
      } else if (document.querySelector('[data-tooltip-id="tt-c6"]')) {
        btnCheck = document.querySelector('[data-tooltip-id="tt-c6"]');
      } else if (document.querySelector('[data-tooltip-id="tt-c8"]')) {
        btnCheck = document.querySelector('[data-tooltip-id="tt-c8"]');
        // flag40 = true;
      } else {
        btnCheck =
          btnMic.parentElement?.parentElement?.parentElement?.nextElementSibling?.querySelector('[role="button"]');
      }
      // ***************

      // Feb 3
      let testSpk = document.querySelector('[data-btn-breakout="spk"]');
      if (testSpk && btnCheck && btnCheck.dataset.isMuted) {
        return;
      }

      // check
      let btns = document.querySelectorAll('[role="button"][data-is-muted]');
      btnMic = btns[0];
      btnVid = btns[1];
      micIsMuted = btnMic.dataset.isMuted == "true";
      vidIsMuted = btnVid.dataset.isMuted == "true";
      if (!micIsMuted) {
        btnMic.click();
      }
      if (!vidIsMuted) {
        btnVid.click();
      }

      // check

      await sleep(2000);

      btnHangup = btnCheck;
      console.log("btnHangup is created");

      // Wait for hangup button
      if (btnMic && btnVid && !g_joinedFlag && btnHangup) {
        g_joinedFlag = true;

        await createSpeakerButton();
        btnHangup.dataset.btnBreakout = "hangup";

        btnSpk = document.querySelector('[data-btn-breakout="spk"]');
        btnMic = document.querySelector('[data-btn-breakout="mic"]');
        btnBye = btnMic.nextElementSibling;
        btnVid = document.querySelector('[data-btn-breakout="vid"]');

        g_spk_classList.mutedFalse = [...document.querySelector('[data-btn-breakout="mic"]').classList];
        g_spk_classList.muted = [...document.querySelector('[data-btn-breakout="mic"]').classList];

        await sleep(1000);

        // ********* June 10 **********Look for the revised verison June 10
        // if (!document.querySelector('[data-tooltip-id="tt-c6"]')) {
        // moveHangupBtn();
        // }
        // ******** June 10

        await updateToolbarColors();

        setTabColor();

        setTabTitle();

        g_joinedFlag = true;

        if (g_myBreakout.settings.newMute == true) {
          console.log("new audio mute method");
          document.querySelector('[data-btn-breakout="spk"]').addEventListener("click", handleSpkBtnClick3);
          // Default is current method ("old")
        } else {
          console.log("old audio mute method");
          document.querySelector('[data-btn-breakout="spk"]').addEventListener("click", handleSpkBtnClick);
        }

        document.querySelector('[data-btn-breakout="mic"]').addEventListener("click", handleMicBtnClick);
        document.querySelector('[data-btn-breakout="vid"]').addEventListener("click", handleVidBtnClick);

        // All non main rooms open with speaker off
        // if (myBreakout.myRooms && myBreakout.myRooms.length > 0) {
        //   if (myBreakout.myRooms[0].name != document.title) {
        //     spkIsMuted = btnSpk.dataset.isMuted == "true";
        //     if (!spkIsMuted) {
        //       btnSpk.click();
        //     }
        //   }
        // }
      }
    } catch (err) {
      // console.log("Error in oneTimeClick");
    }
  })();
  // } catch (err) {}
};

// Only click on button once, while outside
const oneTimeClick = () => {
  try {
    // let flag40 = false;

    if (g_joinedFlag) {
      return;
    }

    // Make sure this is relevant
    if (isRelevant() == false) {
      return;
    }

    // await sleep(5000);
    let settings = myBreakout.settings;

    g_autoEnterFlag = false;

    if (settings.autoEnter) {
      g_autoEnterFlag = true;
    }

    let btnMic = document.querySelectorAll('[role="button"][data-is-muted]')[0];
    let btnVid = document.querySelectorAll('[role="button"][data-is-muted]')[1];

    // Look to see if hangup button exists.  If so then u are inside meeting
    // This line below will fail if not inside meeting.  Try/Catch
    // ********* June 10 **********Look for the revised verison June 10

    // *** Feb 5, 2022
    let btnsCheck = [...document.querySelectorAll("button")]?.filter((el) =>
      el.querySelector("i")?.innerText.includes("call_end")
    );

    if (btnsCheck.length > 0) {
      btnCheck = btnsCheck[0];
    } else if (document.querySelector('[data-tooltip-id="tt-c6"]')) {
      btnCheck = document.querySelector('[data-tooltip-id="tt-c6"]');
    } else if (document.querySelector('[data-tooltip-id="tt-c8"]')) {
      btnCheck = document.querySelector('[data-tooltip-id="tt-c8"]');
      // flag40 = true;
    } else {
      // btnCheck = btnMic.parentElement?.parentElement?.parentElement?.nextElementSibling?.querySelector('[role="button"]');
    }
    // ***************

    // Feb 3
    let testSpk = document.querySelector('[data-btn-breakout="spk"]');
    if (testSpk && btnCheck && btnCheck.dataset.isMuted) {
      return;
    }

    // check
    let btns = document.querySelectorAll('[role="button"][data-is-muted]');
    btnMic = btns[0];
    btnVid = btns[1];
    micIsMuted = btnMic.dataset.isMuted == "true";
    vidIsMuted = btnVid.dataset.isMuted == "true";
    if (!micIsMuted) {
      btnMic.click();
    }
    if (!vidIsMuted) {
      btnVid.click();
    }

    // check

    // await sleep(2000);

    btnHangup = btnCheck;
    console.log(btnCheck);
    console.log("btnHangup is created");

    // Wait for hangup button
    if (btnMic && btnVid && !g_joinedFlag && btnHangup) {
      g_joinedFlag = true;

      createSpeakerButton();
      btnHangup.dataset.btnBreakout = "hangup";

      btnSpk = document.querySelector('[data-btn-breakout="spk"]');
      btnMic = document.querySelector('[data-btn-breakout="mic"]');
      btnBye = btnMic.nextElementSibling;
      btnVid = document.querySelector('[data-btn-breakout="vid"]');

      g_spk_classList.mutedFalse = [...document.querySelector('[data-btn-breakout="mic"]').classList];
      g_spk_classList.muted = [...document.querySelector('[data-btn-breakout="mic"]').classList];

      // await sleep(1000);

      // ********* June 10 **********Look for the revised verison June 10
      // if (!document.querySelector('[data-tooltip-id="tt-c6"]')) {
      // moveHangupBtn();
      // }
      // ******** June 10

      updateToolbarColors();

      setTabColor();

      setTabTitle();

      g_joinedFlag = true;

      if (g_myBreakout.settings.newMute == true) {
        console.log("new audio mute method");
        document.querySelector('[data-btn-breakout="spk"]').addEventListener("click", handleSpkBtnClick3);

        debugger;

        //  Mute if not in the main room
        let rooms = [...g_myBreakout.myRooms];
        let roomsTest = rooms?.filter((el, i) => {
          return el?.link === document.URL && i > 0;
        });

        console.log(document.URL);
        console.log(rooms);
        console.log(roomsTest);

        if (roomsTest.length > 0) {
          console.log("not in the main room, so mute");
          document.querySelector('[data-btn-breakout="spk"]').click();
        }

        // document.querySelector('[data-btn-breakout="spk"]').click();
        // Default is current method ("old")
      } else {
        console.log("old audio mute method");
        document.querySelector('[data-btn-breakout="spk"]').addEventListener("click", handleSpkBtnClick);
      }

      document.querySelector('[data-btn-breakout="mic"]').addEventListener("click", handleMicBtnClick);
      document.querySelector('[data-btn-breakout="vid"]').addEventListener("click", handleVidBtnClick);

      // All non main rooms open with speaker off
      // if (myBreakout.myRooms && myBreakout.myRooms.length > 0) {
      //   if (myBreakout.myRooms[0].name != document.title) {
      //     spkIsMuted = btnSpk.dataset.isMuted == "true";
      //     if (!spkIsMuted) {
      //       btnSpk.click();
      //     }
      //   }
      // }
    }
  } catch (err) {
    // console.log("Error in oneTimeClick");
  }

  // } catch (err) {}
};

const autoAdmit = (evt) => {
  // if (g_autoEnterFlag == false) {
  //   g_autoAdmitted = true;
  //   return;
  // }

  try {
    // select2 = [...document.querySelector("[data-back-to-cancel]").querySelectorAll('[role="button"]')];

    // autoAdmit2 = select2[select2.length - 1];
    // if (autoAdmit2) {
    //   // g_autoAdmitted = true;
    //   console.log(`g_autoAdmitted = ${g_autoAdmitted}`);
    //   autoAdmit2.click();
    // }

    // console.log(`autoAdmit2 = ${autoAdmit2}`);
    let admitBtn = document.querySelector("[data-mdc-dialog-action='accept']");

    if (admitBtn) {
      testSpan = admitBtn.querySelector("span");
      if (testSpan) {
        console.log(`g_autoAdmitted = ${g_autoAdmitted}`);
        console.log(`autoAdmit2 = ${admitBtn}`);
        (async () => {
          await sleep(1);
          if (admitBtn) {
            admitBtn.click();
          }
        })();
      }
      // g_autoAdmitted = true;
    }
  } catch (err) {}
};

const handleMutingFromContext = ({
  // action,
  winId,
  tabId,
  // spkIsMuted,
  boolMic,
  boolVid,
  boolSpk,
  boolFrzt,
  boolFrz0,
  commands,
  menuId,
  tabId2,
}) => {
  // *** Begin freeze

  try {
    // Ignore this is menuId[0]="g" and it is the main room
    if (menuId[0] == "g") {
      if (getMeetUrlBase(document.URL) == myBreakout.myRooms[0].linkFetchedUrl) {
        return;
      }
    }

    boolNotMe = tabId != tabId2;
    // boolFrzt = boolFrzt == true;

    // Individual freeze toggle only applies to me
    if (boolNotMe) {
      boolFrzt = false;
    }

    freezeState = document.querySelector("[data-freeze-state]").dataset.freezeState;
    freezeState = freezeState == "true";
    boolChange = menuId.charAt(0) != "f";

    // If there is a change request and it comes from me, I will unfreeze
    if (boolChange && !boolNotMe) {
      freezeState = false;
    }

    // Toggle freeze
    if (boolFrzt) {
      freezeState = !freezeState;
    }

    // Global unfreeze
    if (boolFrz0) {
      freezeState = false;
    }

    document.querySelector("[data-freeze-state]").dataset.freezeState = freezeState;

    let myObj = {
      boolNotMe,
      boolFrzt,
      boolFrz0,
      freezeState,
      boolChange,
    };

    // If i am frozen and someone other than me tells me to do something, i exit (refuse)
    if (freezeState && boolChange && boolNotMe) {
      return;
    }

    if (freezeState) {
      return [...document.querySelectorAll('link[rel="shortcut icon"]')].map((el) => {
        stubs = el.href.split("img/");
        firstChar = stubs[1].charAt(0);
        if (firstChar == "g" || firstChar == "r") {
          stub1 = stubs[0];
          stub2 = `img/f${stubs[1]}`;
          el.href = `${stub1}${stub2}`;
        }
      });
    }
    // ***** End freeze

    // Execute the mute commands by clicking on the buttons
    let btns = document.querySelectorAll("[data-btn-breakout]");

    btnSpk = btns[0];
    btnMic = btns[1];
    btnVid = btns[2];

    //
    spkIsMuted = btnSpk.dataset.isMuted == "true";
    micIsMuted = btnMic.dataset.isMuted == "true";
    vidIsMuted = btnVid.dataset.isMuted == "true";

    let { muteSpk, muteMic, muteVid } = commands;

    btnMic.isMuted;
    // Get the current muted this.state.

    if (boolSpk) {
      if ((spkIsMuted && !muteSpk) || (!spkIsMuted && muteSpk)) {
        btnSpk.click();
      }
    }

    if (boolMic) {
      if ((micIsMuted && !muteMic) || (!micIsMuted && muteMic)) {
        btnMic.click();
      }
    }

    if (boolVid) {
      if ((vidIsMuted && !muteVid) || (!vidIsMuted && muteVid)) {
        btnVid.click();
      }
    }

    // console.log(`${document.title} ${winId} ${tabId} completed the commands ${JSON.stringify(commands)}`);
  } catch (error) {}
};

const updateToolbarColors = () => {
  (async () => {
    try {
      let fontBlack = [];

      fontBlack["Orange_Dracula"] = true;
      fontBlack["Purple_Dracule"] = true;
      fontBlack["Green_Dracula"] = true;
      fontBlack["Red_Dracula"] = true;
      fontBlack["Pink_Dracula"] = true;
      fontBlack["LightBlue_Dracula"] = true;
      fontBlack["Yellow_Dracula"] = true;

      // await sleep(500);

      // Refresh the settings
      let { breakout: test } = await chromeStorageLocalGet("breakout");
      myBreakout.settings = { ...test.settings };

      let toolbar = document.querySelector("[data-btn-breakout]").parentElement.parentElement.parentElement;

      let { toolbarSolid, toolbarSolidColor, toolbarGradLeftColor, toolbarGradRightColor } = myBreakout.settings;

      toolbar.style.backgroundImage = "";
      toolbar.style.backgroundColor = "";
      toolbar.style.background = "";
      toolbar.style.color = "";

      if (toolbarSolid) {
        toolbar.style.background = `${getColorRgb(toolbarSolidColor)}`;

        if (fontBlack[toolbarSolidColor]) {
          toolbar.style.color = "black";
        }
      } else {
        toolbar.style.background = `linear-gradient(to right, 
        ${getColorRgb(toolbarGradLeftColor)}, 
        ${getColorRgb(toolbarGradRightColor)}, 
        ${getColorRgb(toolbarGradLeftColor)})`;
      }

      // Shadows on buttons
      btnSpk = document.querySelector('[data-btn-breakout="spk"]');
      btnMic = document.querySelector('[data-btn-breakout="mic"]');
      btnVid = document.querySelector('[data-btn-breakout="vid"]');
      btnHangup = document.querySelector('[data-btn-breakout="hangup"]');

      btnSpk.style.boxShadow = "1px 1px 2px black";
      btnMic.style.boxShadow = "1px 1px 2px black";
      btnVid.style.boxShadow = "1px 1px 2px black";
      btnHangup.style.boxShadow = "1px 1px 2px black";
    } catch (err) {}
  })();
};

const moveHangupBtn = () => {
  try {
    btnVid = document.querySelector('[role="button"][data-btn-breakout="vid"]');
    btnBye = btnVid.parentElement.parentElement.previousElementSibling;
    btnBye.firstElementChild.style.backgroundColor = "yellow";
    btnBye.firstElementChild.style.backgroundColor = colors.yellow;
    btnBye.firstElementChild.dataset.breakoutHangup = "false";
    btnTop = btnBye.parentElement;
    btnTop.removeChild(btnBye);
    btnTop.appendChild(btnBye);

    g_hangup_moved = true;
  } catch (err) {
    alert(`Problem ${JSON.stringify(err)}`);
  }
};

const handleMicBtnClick = async (event) => {
  try {
    let boolMuted;
    let btnMic;

    btnMic = document.querySelector("[data-btn-breakout='mic']");
    boolMuted = document.querySelector("[data-btn-breakout='mic']").dataset.isMuted;

    // alert(`isMuted = ${boolMuted}`);

    // if (boolMuted == "true") {
    //   btnMic.classList.add("my-breakout-green");
    //   btnMic.classList.remove("my-breakout-red");
    // } else {
    //   btnMic.classList.add("my-breakout-red");
    //   btnMic.classList.remove("my-breakout-green");
    // }

    // await chromeRuntimeSendMessage({
    //   action: "contentMic",
    //   title: document.title,
    //   boolMuted: boolMuted,
    // });

    // Feb 12, 2022
    await sleep(1);

    setTabColor();

    setBtnColor();
  } catch (error) {}
};

const handleVidBtnClick = async (event) => {
  let boolMuted;
  let btnVid;

  try {
    btnVid = document.querySelector("[data-btn-breakout='vid']");
    boolMuted = document.querySelector("[data-btn-breakout='vid']").dataset.isMuted;

    // alert(`isMuted = ${boolMuted}`);

    // if (boolMuted == "true") {
    //   btnVid.classList.add("my-breakout-green");
    //   btnVid.classList.remove("my-breakout-red");
    // } else {
    //   btnVid.classList.add("my-breakout-red");
    //   btnVid.classList.remove("my-breakout-green");
    // }

    // Feb 12, 2022

    await sleep(1);

    setTabColor();

    setBtnColor();

    // await chromeRuntimeSendMessage({
    //   action: "contentVid",
    //   title: document.title,
    //   boolMuted: boolMuted,
    // });
  } catch (error) {}
};

const handleSpkBtnClick3 = async (event) => {
  // 08.03.2024

  try {
    let l_currentTarget = event.currentTarget;

    // Get the button current state
    let l_btn = document.querySelector('[data-btn-breakout="spk"][data-is-muted]');

    if (!l_btn) {
      console.log("Cannot find the speaker button on click");
      return false;
    }

    // Call the background to mute
    let { boolMuted } = await chromeRuntimeSendMessage({
      action: "SPKBTNCLICKED",
    });

    // This is the new state
    l_currentTarget.dataset.isMuted = boolMuted;
    l_btn.dataset.isMuted = boolMuted;

    // Get the speaker muted icons
    let l_mutedIconTrue = l_currentTarget.querySelector('[data-muted-icon="true"]');
    let l_mutedIconFalse = l_currentTarget.querySelector('[data-muted-icon="false"]');

    // Already toggled
    if (boolMuted) {
      l_mutedIconTrue.style.display = "flex";
      l_mutedIconFalse.style.display = "none";

      // New state is muted (Red)
    } else {
      l_mutedIconTrue.style.display = "none";
      l_mutedIconFalse.style.display = "flex";
    }

    await sleep(1);

    setBtnColor();

    setTabColor();

    await chromeRuntimeSendMessage({
      action: "contentSpk",
      title: document.title,
      boolMuted: boolMuted,
    });

    return true;
  } catch (error) {
    console.log(`Error in handleSpkBtnClick3 `, error);
    return false; // Ensure a boolean is always returned
  }
};

// const handleSpkBtnClick2 = async (event) => {
//   // Feb 12, 2022 intentional 500 ms delay to be more in line with mic and vid delay
//   // made this whole subroutine async (not sure)

//   let l_currentTarget = event.currentTarget;

//   // Get the button current state
//   let l_btn = document.querySelector('[data-btn-breakout="spk"][data-is-muted]');

//   if (!l_btn) {
//     console.log("Cannot find the speaker button on click");
//     return false;
//   }

//   // Get the speaker muted icons
//   let l_mutedIconTrue = l_currentTarget.querySelector('[data-muted-icon="true"]');
//   let l_mutedIconFalse = l_currentTarget.querySelector('[data-muted-icon="false"]');

//   // Get the audio elems
//   let lt_audio = document.querySelectorAll("audio");

//   // Set the new state

//   //Toggle: Current state muted so New state is not muted (Green)
//   if (l_btn.dataset.isMuted == "true") {
//     l_btn.dataset.isMuted = "false";
//     l_mutedIconTrue.style.display = "none";
//     l_mutedIconFalse.style.display = "flex";

//     // Jan 10 add back in
//     for (let i = 0; i < lt_audio.length; i++) {
//       // lt_audio[i].volume = 1;
//       lt_audio[i].muted = false;
//     }

//     // New state is muted (Red)
//   } else {
//     l_btn.dataset.isMuted = "true";
//     l_mutedIconTrue.style.display = "flex";
//     l_mutedIconFalse.style.display = "none";

//     // Jan 10 add back in
//     for (let i = 0; i < lt_audio.length; i++) {
//       // lt_audio[i].volume = 0;
//       lt_audio[i].muted = true;
//     }
//   }

//   await sleep(1);

//   setBtnColor();

//   setTabColor();

//   return true;
// };

const handleSpkBtnClick = async (event) => {
  try {
    // let l_currentTarget = btn;
    let l_currentTarget = event.currentTarget;
    // Need to toggle state
    // First send message SPKBTNCLICKED to popup (??? should mean background 08.03.2024)
    // popup will:
    // a) get current state
    // b) toggle the state
    // c) send the new state back to context
    // Second, in the context once receive callback:
    // a) change button state color here in context
    // b) update on the element, the new state info (for info purposes only)
    // c) call setTabColor here in the context

    document.querySelector("[data-freeze-state]").dataset.freezeState = false;

    // Get the current state
    // let obj1 = await getSpeakerState();
    let response = await chromeRuntimeSendMessage({
      action: "SPKBTNCLICKED",
    });

    // This is the new state
    boolMuted = response.boolMuted;
    l_currentTarget.dataset.isMuted = boolMuted;

    // l_currentTarget.classList.remove(...l_currentTarget.classList);

    mutedIconEl = l_currentTarget.querySelector('[data-muted-icon="true"]');
    mutedFalseIconEl = l_currentTarget.querySelector('[data-muted-icon="false"]');

    if (boolMuted) {
      // l_currentTarget.classList.add(...g_spk_classList.muted);
      mutedIconEl.style.display = "flex";
      mutedFalseIconEl.style.display = "none";
    } else {
      // l_currentTarget.classList.add(...g_spk_classList.mutedFalse);
      mutedIconEl.style.display = "none";
      mutedFalseIconEl.style.display = "flex";
      //  mutedIconEl.classList.remove(".my-breakout-speaker-muted");
    }

    await sleep(500);

    setBtnColor();

    setTabColor();

    // await chromeRuntimeSendMessage({
    //   action: "contentSpk",
    //   title: document.title,
    //   boolMuted: boolMuted,
    // });

    return true;
  } catch (error) {}
};

const setBtnColor = () => {
  // Feb 12, 2022 - commented this out, but not sure
  // await sleep(500);
  try {
    // Reset the white colors
    btnSpk = document.querySelector('[data-btn-breakout="spk"]');
    btnMic = document.querySelector('[data-btn-breakout="mic"]');
    btnVid = document.querySelector('[data-btn-breakout="vid"]');

    btnSpk.style.boxShadow = "1px 1px 2px black";
    btnSpk.style.borderRadius = "50%";

    btnMic.style.boxShadow = "1px 1px 2px black";
    btnVid.style.boxShadow = "1px 1px 2px black";

    // ******* June 10 ********** Feb 12, 2022
    // if (document.querySelector('[data-tooltip-id="tt-c6"]')) {
    //   colors.green = "forestgreen";
    //   colors.green = "#50fa7b";
    // }

    if (btnSpk.dataset.isMuted == "true") {
      btnSpk.style.backgroundColor = colors.red;
      btnSpk.style.borderColor = colors.red;
      btnSpk.style.color = "white";
    } else {
      btnSpk.style.backgroundColor = colors.green;
      btnSpk.style.borderColor = colors.green;
      btnSpk.style.color = "white";
    }

    if (btnMic.dataset.isMuted == "true") {
      btnMic.style.backgroundColor = colors.red;
      btnMic.style.color = "white";
    } else {
      btnMic.style.backgroundColor = colors.green;
      btnMic.style.color = "white";
    }
    // if (btnMic.dataset.isMuted == "true") {
    //   btnMic.style.backgroundColor = colors.red;
    //   btnMic.style.color = "white";
    // } else {
    //   btnMic.style.backgroundColor = colors.green;
    //   btnMic.style.color = "white";
    // }

    if (btnVid.dataset.isMuted == "true") {
      btnVid.style.backgroundColor = colors.red;
      btnVid.style.color = "white";
    } else {
      btnVid.style.backgroundColor = colors.green;
      btnVid.style.color = "white";
    }
  } catch (error) {
    console.log(error);
  }
};

const createSpeakerButton = () => {
  // ******** June 10
  let mutedStyle = "my-breakout-speaker-muted";

  let btns = document.querySelectorAll('[role="button"][data-is-muted]');

  if (btns.length < 1) {
    console.log("problem in create speaker button");
    // await sleep(2000);
    btns = document.querySelectorAll('[role="button"][data-is-muted]');
  }

  btns[0].dataset.btnBreakout = "mic";
  btns[1].dataset.btnBreakout = "vid";

  let topNode = btns[0].parentElement.parentElement.parentElement.parentElement.parentElement;
  // let topNode = btns[0].parentElement.parentElement.parentElement.parentElement;

  btnSpk = document.createElement("div");

  btnSpk.classList.add("my-breakout-speaker-btn");

  mutedStyle = "";
  let micClassList = [...btns[0].classList];
  for (let i = 0; i < micClassList.length; i++) {
    btnSpk.classList.add(micClassList[i]);
  }
  btnSpk.style.float = "left";
  btnSpk.style.position = "relative";

  //******** June 10
  // if (document.querySelector('[data-tooltip-id="tt-c6"]')) {
  //   btnSpk.style.backgroundColor = "forestgreen";

  //   // *** December 2021
  // } else if (document.querySelector('[data-tooltip-id="tt-c8"]')) {
  //   btnSpk.classList.add("my-breakout-speaker-40");
  //   btnSpk.style.backgroundColor = `rgb(${105}, ${240}, ${174})`;
  // } else {
  // }

  btnSpk.style.backgroundColor = colors.green;
  btnSpk.style.color = "white";

  // ******

  btnSpk.dataset.btnBreakout = "spk";
  btnSpk.dataset.isMuted = false;

  btnSpk.dataset.tooltip = "Turn off speaker";
  btnSpk.dataset.ariaLabel = "Turn off speaker"; // used to be 2
  // btnSpk.dataset.responseDelayMs = "250";
  btnSpk.dataset.responseDelayMs = "0";

  // ****** June 10 variable class
  btnSpk.innerHTML = `<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css"
      integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous" />
    <div>
      <i style="display: none" class="fas fa-volume-mute my-breakout-speaker-icon ${mutedStyle}" data-muted-icon="true"></i>
      <i style="display: flex" class="fas fa-volume-up my-breakout-speaker-icon" 
      data-freeze-state=false
      data-muted-icon="false"></i>
    </div>`;

  topNode.prepend(btnSpk);
};

const createSpeakerButton_old = async () => {
  let btns = document.querySelectorAll('[role="button"][data-is-muted]');

  if (btns.length < 1) {
    console.log("problem in create speaker button");
    await sleep(2000);
    btns = document.querySelectorAll('[role="button"][data-is-muted]');
  }

  btns[0].dataset.btnBreakout = "mic";
  btns[1].dataset.btnBreakout = "vid";

  let topNode = btns[0].parentElement.parentElement.parentElement.parentElement;

  let newNode = topNode.firstChild.cloneNode(true);

  let btnSpk = newNode.querySelector('[role="button"]');

  // Strip out everything but the class
  let classList = btnSpk.classList;
  let arrClassList = [...classList];

  while (btnSpk.attributes.length > 0) btnSpk.removeAttribute(btnSpk.attributes[0].name);

  btnSpk.classList.add(...arrClassList);
  // ***

  btnSpk.dataset.btnBreakout = "spk";
  btnSpk.dataset.isMuted = false;
  btnSpk.parentElement.setAttribute("jsmodel", "");
  btnSpk.parentElement.setAttribute("jscontroller", "");
  btnSpk.parentElement.setAttribute("jsaction", "");
  btnSpk.parentElement.setAttribute("jsname", "");
  btnSpk.dataset.tooltip = "Turn off speaker";
  btnSpk.dataset.ariaLabel = "Turn off speaker"; // used to be 2
  btnSpk.dataset.responseDelayMs = "250";
  btnSpk.style.backgroundColor = colors.green;
  btnSpk.style.borderColor = colors.green;

  btnSpk.innerHTML = `<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css"
      integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous" />
    <div>
      <i style="font-size: 20px; color: white; border-radius: 50%; display: none" class="fas fa-volume-mute" data-muted-icon="true"></i>
      <i style="font-size: 20px" class="fas fa-volume-up" 
      data-freeze-state=false
      data-muted-icon="false"></i>
    </div>`;

  topNode.prepend(newNode);
};

// On

const getSpkMicVidState = () => {
  if (g_joinedFlag) {
    let muted = {
      spk: false,
      mic: false,
      vid: false,
    };

    btns = document.querySelectorAll("[data-btn-breakout]");

    if (btns.length > 2) {
      btnSpk = btns[0];
      btnMic = btns[1];
      btnVid = btns[2];

      muted.spk = btnSpk.dataset.isMuted === "true";
      muted.mic = btnMic.dataset.isMuted === "true";
      muted.vid = btnVid.dataset.isMuted === "true";
    }

    return muted;
  }
};

const syncNick = () => {
  let nickname = document.querySelector("[jsslot] div[jscontroller][jsaction][jsname]");

  if (nickname && !nickname.dataset.breakoutUpdated) {
    nickname.dataset.breakoutUpdated = true;
    g_synced = true;
  }
};

const toggleTitle = () => {
  let saveTitle = document.title;
  // document.title = "hi";
  document.title = saveTitle;
};

const setTabTitle = async () => {
  // await sleep(5000);
  // debugger;
  // See if relevant and auto admit
  try {
    // let url = document.URL.split("?");

    let url = getMeetUrlBase(document.URL);
    let rooms = [];

    if (myBreakout) {
      // let myClassName = g_myBreakout.settings.meetClassName;

      let { breakout: test } = await chromeStorageLocalGet("breakout");
      myBreakout = test;

      rooms = [...myBreakout.classes]
        .filter((el) => el.name == myBreakout.settings.meetClassName)
        .map((el) => el.rooms)[0];

      // rooms = [...myBreakout.myClass.rooms];
    }

    if (url.startsWith("https://meet.google.com/")) {
      // if (url.length > 0 && document.baseURI == "https://meet.google.com/") {
      // let link = url[0];

      for (let i = 0; i < rooms.length; i++) {
        // July 23, 2020 filter out the right of the ?
        // roomLink = rooms[i].link.split("?");
        // if (rooms[i].link == link) {
        // if (roomLink[0] == url[0]) {
        if (rooms[i].linkFetchedUrl == url) {
          // document.title = "hi";
          // if (document.title != rooms[i].name) {
          //   debugger;
          document.title = "updating...";
          document.title = rooms[i].name;
          // }
        }
      }
    }
  } catch (err) {}
};

// const setTabTitle2 = (payload, sender) => {
//   let className = payload.className;
//   let roomName = payload.roomName;

//   console.log(
//     `Inside context, received from background: ${className} ${roomName} ${JSON.stringify(
//       sender
//     )}`
//   );

//   document.title = roomName;
// };

const setTabColor = () => {
  if (g_joinedFlag) {
    // freeze stuff
    let el = document.querySelector("[data-freeze-state]");
    if (el && el.dataset.freezeState) {
      freezeState = el.dataset.freezeState;
      freezeState = freezeState == "true";
    } else {
      freezeState = false;
    }

    if (freezeState) {
      return;
    }
    // freeze stuff

    let { spk, mic, vid } = getSpkMicVidState();

    let d1 = spk == true ? "0" : "1";
    let d2 = mic == true ? "0" : "1";
    let d3 = vid == true ? "0" : "1";

    tabColor = `c${d1}${d2}${d3}.png`;
    console.log(`${d1}${d2}${d3}.png`);

    // if (mic) {
    //   if (spk) {
    //     if (vid) {
    //       tabColor = "rx32.png";
    //     } else {
    //       tabColor = "rxc32.png";
    //     }
    //   } else {
    //     if (vid) {
    //       tabColor = "r32.png";
    //     } else {
    //       tabColor = "rc32.png";
    //     }
    //   }
    // } else {
    //   if (spk) {
    //     if (vid) {
    //       tabColor = "gx32.png";
    //     } else {
    //       tabColor = "gxc32.png";
    //     }
    //   } else {
    //     if (vid) {
    //       tabColor = "g32.png";
    //     } else {
    //       tabColor = "gc32.png";
    //     }
    //   }
    // }

    let link = chrome.runtime.getURL(`img/${tabColor}`);

    [...document.querySelectorAll('link[rel="shortcut icon"]')].map((el) => (el.href = link));
  }
};

const getParticipants2 = () => {
  // Function to get the innerText excluding elements with role="tooltip"
  const getFilteredText = (element) => {
    let text = "";
    element.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        text += child.textContent;
      } else if (child.nodeType === Node.ELEMENT_NODE && child.getAttribute("role") !== "tooltip") {
        text += getFilteredText(child);
      }
    });
    return text;
  };

  // Select the <i> tag with innerText 'visual_effects'
  const visualEffectsIcon = Array.from(document.querySelectorAll("i")).find(
    (element) => element.innerText === "visual_effects"
  );

  // Traverse up the DOM tree to find the participant element
  let participantElement = visualEffectsIcon;

  while (participantElement && !participantElement.hasAttribute("data-participant-id")) {
    participantElement = participantElement.parentElement;
  }

  // Get the participant ID
  const hostParticipantId = participantElement ? participantElement.getAttribute("data-participant-id") : null;

  console.log("Host Participant ID:", hostParticipantId);

  let ppt = [...document.querySelectorAll("[data-requested-participant-id]")]
    .map((el) => {
      // elName2 = el.querySelector("[data-self-name]");
      const selfName = el.querySelector("[data-self-name]");

      // Get the filtered innerText
      const name = getFilteredText(selfName);
      console.log(name);

      elId2 = el.dataset.requestedParticipantId;
      elUrl2 = el.querySelector("img[data-size][data-iml]");

      let me = false;
      let id, url;

      if (name) {
        // if (name == selfName.dataset.selfName) {
        //   me = true;
        // }
        if (el.dataset.participantId === hostParticipantId) {
          me = true;
        }
      } else {
        return false;
      }

      if (elId2.split("devices/").length > 1) {
        id = elId2.split("devices/")[1];
      } else {
        return false;
      }

      if (elUrl2) {
        url = elUrl2.src;
      } else {
        return false;
      }

      return { name, me, id, url };
    })
    .filter((el) => el != false);

  ppt.sort((a, b) => {
    aName = `${a.name.toLowerCase()} ${a.id}`;
    bName = `${b.name.toLowerCase()} ${b.id}`;

    if (aName < bName) {
      return -1;
    }
    if (aName > bName) {
      return 1;
    }
    return 0;
  });

  return ppt;
};

const getParticipants = () => {
  ppt = [...document.querySelectorAll("[data-participant-id]")].map((el) => {
    elName2 = el.querySelector("[data-self-name]");
    elId2 = el.dataset.participantId;
    elUrl2 = el.querySelector("img[data-size][data-iml]");

    me = false;

    if (elName2) {
      name = elName2.innerText;
      if (elName2.innerText == elName2.dataset.selfName) {
        me = true;
      }
    } else {
      return false;
    }

    if (elId2.split("devices/").length > 1) {
      id = elId2.split("devices/")[1];
    } else {
      return false;
    }

    if (elUrl2) {
      url = elUrl2.src;
    } else {
      return false;
    }

    return { name, me, id, url };
  });

  ppt.sort((a, b) => {
    aName = `${a.name.toLowerCase()} ${a.id}`;
    bName = `${b.name.toLowerCase()} ${b.id}`;

    if (aName < bName) {
      return -1;
    }
    if (aName > bName) {
      return 1;
    }
    return 0;
  });

  return ppt;
};

const removeParticipant = (myPptId) => {
  let nodesAll = [...document.querySelectorAll("[data-requested-participant-id]")];

  let myArr = nodesAll.filter((el) => {
    let items = el.dataset.requestedParticipantId.split("/");
    let pptId = items[items.length - 1];

    if (pptId === myPptId) {
      return true;
    } else {
      return false;
    }
  });

  let btns = myArr[0].querySelectorAll('[role="button"]');

  // remove
  btns[2].click();
};

const removeAll = async (boolClose = false, winId, tabId) => {
  let boolOpen = false;
  const btn1 = document.querySelector('button[data-panel-id="1"]');
  console.log(`btn1 open? aria-pressed = ${btn1.ariaPressed}`);

  // See if need to press btn1.  If this popup open then no need for btn1
  let testListItems = Array.from(document.querySelectorAll('[role="listitem"]'));

  if (testListItems && testListItems.length > 0) {
    console.log(`appears to be open`, testListItems);
    boolOpen = true;
  } else {
    console.log(`appears to be closed so need to click btn1`, testListItems);
    if (btn1) {
      console.log('btn1 clicked');
      simulateUserClick(btn1);
    } else {
      console.log("Panel button not found");
    }
  }

  // Now move on to list of participants
  let listItems = Array.from(document.querySelectorAll('button[aria-label="More actions"]'));

  listItems = listItems.filter((el, index) => index !== 0);

  // For each participant...
  for (let i = 0; i < listItems.length; i++) {
    const el = listItems[i];
    let btn2 = el;
    if (btn2) {
      simulateUserClick(btn2);
    } else {
      console.log(`More actions button btn2 not found for list item ${i}`);
      continue;
    }

    await sleep(500);

    // Remove from the call
    let btn3 = document.querySelector('li[aria-label="Remove from the call"]');
    if (btn3) {
      simulateUserClick(btn3);
    } else {
      console.log("Remove button btn3 not found");
      continue;
    }

    await sleep(500);

    // Confirm the remove
    let btn4 = document.querySelector('button[aria-label="Remove"]');
    if (btn4) {
      simulateUserClick(btn4);
    } else {
      console.log("Confirm button btn4 not found");
      continue;
    }

    await sleep(500);
  }

  console.log(`boolOpen ${boolOpen}`);

  if (btn1.ariaPressed === "true") {
    btn1.click();
  }
};

const removeAll2 = async (boolClose = false, winId, tabId) => {
  let me = await getMe();

  let arrAll = [...document.querySelectorAll("[data-requested-participant-id]")];

  btnsAll = [];

  arrAll.forEach((el) => {
    let items = el.dataset.requestedParticipantId.split("/");
    let pptId = items[items.length - 1];
    let btns = el.querySelectorAll('[role="button"]');

    if (pptId != me) {
      btnsAll.push({ btns: btns, pptId });
    }
  });

  // First try to remove all
  for (let i = 0; i < btnsAll.length; i++) {
    btnsAll[i].btns[2].click();
    await sleep(1500);

    let btn = document.querySelector('button[data-mdc-dialog-action="ok"]');
    if (btn) {
      btn.click();
      await sleep(1500);
    }
  }

  // Close the window
  try {
    document.querySelector('div[role="heading"][tabindex="-1"]').nextElementSibling.querySelector("button").click();
  } catch (err) {
    console.log("Error closing window");
  }

  if (boolClose) {
    return chromeRuntimeSendMessage({
      action: "closeRoomTab",
      tabId: tabId,
      winId: winId,
    });
  }
};

const hangup = async (boolClose = false, winId, tabId) => {
  try {
    // let hangup = document.querySelector('[data-btn-breakout="hangup"]');
    // hangup.click();

    myElement2 = [...document.querySelectorAll("i")].filter((el) => el.innerText.includes("call_end"));
    btn = myElement2[0].parentElement;
    btn.click();
  } catch (err) {}
};

// Function to simulate a user click
function simulateUserClick(element) {
  const event = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
    button: 0,
  });
  element.dispatchEvent(event);
}

// Function to mute all participants
const muteAll = async (myPptId) => {

  let boolOpen = false;
  const btn1 = document.querySelector('button[data-panel-id="1"]');
  console.log(`btn1 open? aria-pressed = ${btn1.ariaPressed}`);

  // See if need to press btn1.  If this popup open then no need for btn1
  let testListItems = Array.from(document.querySelectorAll('[role="listitem"]'));

  if (testListItems && testListItems.length > 0) {
    console.log(`appears to be open`, testListItems);
    boolOpen = true;
  } else {
    console.log(`appears to be closed so need to click btn1`, testListItems);
    if (btn1) {
      console.log('btn1 clicked');
      simulateUserClick(btn1);
    } else {
      console.log("Panel button not found");
    }
  }

  // // See if need to press btn1.  If this popup open then no need for btn1
  // let testListItems = Array.from(document.querySelectorAll('[role="listitem"]'));

  // if (testListItems && testListItems.length > 0) {
  //   const btn1 = document.querySelector('button[data-panel-id="1"]');
  //   if (btn1) {
  //     simulateUserClick(btn1);
  //   } else {
  //     console.error("Panel button not found");
  //     return;
  //   }
  // }

  // Now move on to list of participants
  let listItems = Array.from(document.querySelectorAll('[role="listitem"]'));

  listItems = listItems.filter((el, index) => index !== 0);

  for (let i = 0; i < listItems.length; i++) {
    const el = listItems[i];
    let btn2 = el.querySelector("button");
    if (btn2) {
      simulateUserClick(btn2);
    } else {
      console.error(`Mute button not found for list item ${i}`);
      continue;
    }

    await sleep(10);

    // For each need to click on the mute button
    let btn3 = document.querySelector('[data-mdc-dialog-action="ok"]');
    if (btn3) {
      simulateUserClick(btn3);
    } else {
      console.error("Confirm button not found");
    }

    await sleep(100);
  }

  console.log(`boolOpen ${boolOpen}`);

  if (btn1.ariaPressed === "true") {
    btn1.click();
  }
};

// const muteAll = async (myPptId) => {
//   const btn1 = document.querySelector('button[data-panel-id="1"]');
//   btn1.click();

//   let listItems = Array.from(document.querySelectorAll('[role="listitem"]'));

//   listItems = listItems.filter((el, index) => index !== 0);

//   for (let i = 0; i < listItems.length; i++) {
//     const el = listItems[i];
//     let btn2 = el.querySelector("button");
//     btn2.click();

//     await sleep(10);

//     btn3 = document.querySelector('[data-mdc-dialog-action="ok"]');
//     btn3.click();

//     await sleep(100);
//   }
// };

const muteAll_old = async (myPptId) => {
  let me = await getMe();

  let ppts = document.querySelectorAll("[data-participant-id]");
  // let ppts = document.querySelectorAll("[data-requested-participant-id]");

  for (let i = 1; i < ppts.length; i++) {
    let btn = ppts[i].querySelector("button");
    btn.click();
    // await sleep(1500);
    await sleep(100);

    let btn2 = document.querySelector('[data-mdc-dialog-action="ok"]');
    if (btn2) {
      btn2.click();
      await sleep(1500);
    }
  }

  // Close the window
  try {
    document.querySelector('div[role="heading"][tabindex="-1"]').nextElementSibling.querySelector("button").click();
  } catch (err) {}
};

const getMe = async () => {
  try {
    let myElement = [...document.querySelectorAll("i")].filter((el) => el.innerText.includes("people_alt"));
    let btn = myElement[0].parentElement;

    let ttc12 = document.querySelector('[data-tooltip-id="tt-c12"]');
    let ttc11 = document.querySelector('[data-tooltip-id="tt-c11"]');
    let other = document.querySelectorAll("[jsshadow][role='button'][data-tab-id='1']");

    // Normal processing
    if (btn.tagName == "BUTTON") {
      btn.click();

      //
    } else if (ttc12) {
      ttc12.click();

      //
    } else if (ttc11) {
      ttc11.click();

      // GUI changed so use other
    } else if (other.length > 0) {
      other[0].click();
    }

    await sleep(2000);

    let arrAll = [...document.querySelectorAll("[data-participant-id]")];

    let items = arrAll[0].dataset.participantId.split("/");
    let pptId = items[items.length - 1];

    return pptId;
  } catch (err) {}
};

const showAllPpt = () => {
  try {
    document.querySelectorAll("[jsshadow][role='button'][data-tab-id='1']")[0].click();
  } catch (err) {}
};

// July 19, 2020 - Not used as of yet
const getNewBreakout = async () => {
  let { breakout: test } = await chromeStorageLocalGet("breakout");
  let myBreakout = test;
  g_myBreakout = myBreakout;

  // await sleep(5000);
  let settings = myBreakout.settings;

  g_autoEnterFlag = false;
  if (settings.autoEnter) {
    g_autoEnterFlag = true;
  }
};

const syncGC2 = async () => {
  console.log("synced");

  let boolError = false;
  let url = document.URL;
  let selectedCourse;

  // Ask the popup to give you the linkschromeRuntimeSendMessage
  try {
    selectedCourse = await chromeRuntimeSendMessage({
      action: "getSelectedCourse",
    });
  } catch (err) {
    return alert(
      `Please open the Breakout Rooms extension control panel and make sure that this GC course is selected in the Rooms tab.  You can open the control panel by single clicking on the Breakout Rooms extension button in the menu bar.  It is the purple "b" icon`
    );
  }

  alert(`The selected URL is ${selectedCourse.links[0]}`);
  // if (!url.startsWith("https://meet.google.com/")) {
  //   boolError = true;
  //   return alert(
  //     `This is not a google meet.  This URL is ${document.URL} which means that it is not a google meet`
  //   );
  // }

  // let list = [...document.querySelectorAll("#list-rooms-hook")];

  // if (!list || list.length < 1) {
  //   boolError = true;
  //   return alert(
  //     `Please open the Breakout Rooms extension control panel and make sure that this GC course is selected in the Rooms tab.  You can open the control panel by single clicking on the Breakout Rooms extension button in the menu bar.  It is the purple "b" icon`
  //   );
  // }

  // Tell the popup to update

  // if (boolEror) {
  //   return;
  // }
};

const isRelevant = () => {
  return true;

  let rooms = g_myBreakout.myRooms;
  let flag = false;

  for (let i = 0; i < rooms.length; i++) {
    if (getMeetUrlBase(document.URL) == rooms[i].linkFetchedUrl) {
      g_relelvant = true;
      flag = true;
      break;
    }
  }

  return flag;
};
