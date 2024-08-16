const buildSlider = async () => {
  try {
    let numSelectedRooms = document.querySelector("#meet-room-number").innerText;

    let lowMemoryFlag = document.querySelector("#low-memory-option");

    let slider = document.querySelector("#slider");

    let position = slider.value;

    let sliderTitle = document.querySelector("#slider-title");

    let rooms = await chromeAllOpenRooms();
    // let rooms = await chromeAllOpenRooms(false, 0, true, false, false);
    rooms = filterExtensionRooms(rooms);
    rooms = sortRoomsTabOrder(rooms);

    if (rooms && rooms[position] && rooms.length > 0) {
      if (lowMemoryFlag) {
        slider.max = numSelectedRooms;
      } else {
        slider.max = rooms.length - 1;
      }
      sliderTitle.dataset.linkFetchedUrl = rooms[position].url;
      sliderTitle.dataset.tabId = rooms[position].id;
      sliderTitle.dataset.winId = rooms[position].windowId;
      sliderTitle.innerText = rooms[position].title;
    } else {
      slider.max = 0;
    }

    // Reset room name
    if (myBreakout && myBreakout.myRooms && myBreakout.myRooms.length > 0) {
      let numSelectedRooms = document.querySelector("#meet-room-number").innerText;

      selectedRooms = myBreakout.myRooms.slice(0, numSelectedRooms);

      selectedRooms.forEach((el) => {
        if (el.linkFetchedUrl == sliderTitle.dataset.linkFetchedUrl) {
          sliderTitle.innerText = el.name;

          // July 19
          // let subTitle = document.querySelector("#room-part-controls-title");
          // subTitle.innerText = `\u00A0 ${sliderTitle.innerText} Room Participant Controls`;
          // End July 19

          chrome.tabs.sendMessage(parseInt(sliderTitle.dataset.tabId), {
            action: "updateTabTitle",
          });
        }
      });
    }
  } catch (err) {}
};

const handleSlider = async (evt) => {
  try {
    // await chromeRuntimeSendMessage({ action: "tellContextToUpdateTabs" }); // Jan 1 2021

    let numSelectedRooms = document.querySelector("#meet-room-number").innerText;
    let lowMemoryFlag = document.querySelector("#low-memory-option").checked;
    let rooms = [];
    let url;
    let id;
    let windowId;
    let boolActive;
    let boolFocused;
    let saveWinId;
    let obj;

    muteBroadcast();

    let slider = document.querySelector("#slider");

    switch (evt.currentTarget.id) {
      case "slider-left":
        if (slider.value == 0) {
          slider.value = slider.max;
        } else {
          slider.value--;
        }
        break;
      case "slider-right":
        if (slider.value == slider.max) {
          slider.value = 0;
        } else {
          slider.value++;
        }
        break;

      default:
        break;
    }

    let position = slider.value;

    let sliderTitle = document.querySelector("#slider-title");

    // Can't rely on this
    rooms = myBreakout.myRooms;

    let openRooms2 = await chromeAllOpenRooms();
    openRooms2 = sortRoomsTabOrder(openRooms2);
    openRooms2 = filterExtensionRooms(openRooms2);

    if (openRooms2.length < 1) {
      return;
    }

    if (lowMemoryFlag) {
      slider.max = numSelectedRooms;
      sliderTitle.innerText = rooms[position].name;
      // sliderTitle.dataset.linkFetchedUrl = rooms[position].linkFetchedUrl;

      switch (rooms[position].linkType) {
        case "nick":
          url = await autoCreateLink((nick = rooms[position].link));
          break;

        case "nickGC":
          let myNick = getNickFromLookup(rooms[position].link);
          url = await autoCreateLink((nick = myNick));
          break;

        case "code":
          url = "https://meet.google.com/" + rooms[position].link;
          break;

        case "url":
          url = rooms[position].link;
          break;

        default:
          break;
      }

      sliderTitle.dataset.linkFetchedUrl = url;

      let alreadyOpenFlag = openRooms2.filter((el) => el.url == url);

      if (alreadyOpenFlag.length > 0) {
        windowId = openRooms2[position].windowId;
        id = openRooms2[position].id;
      } else {
        // Send message to context to change to this url
        windowId = openRooms2[openRooms2.length - 1].windowId;
        id = openRooms2[openRooms2.length - 1].id;
        let msg = await chromeTabsSendMessage(id, {
          action: "updateUrl",
          url: url,
        });
      }

      sliderTitle.dataset.tabId = id;
      sliderTitle.dataset.winId = windowId;

      // Save my current tabId and windowId
      let currentTab = await chromeTabsQuery({
        active: true,
        currentWindow: true,
      });

      // Control panel window id
      saveWinId = currentTab[0].windowId;

      // Make tab active
      boolActive = true;
      // chrome.tabs.update(id, { active: boolActive });

      // let obj = await chromeTabsUpdate2(id, {
      //   active: boolActive,
      // });

      // let boolFocused = true;

      // // Slider current window
      // obj = await chromeWindowsUpdate2(windowId, {
      //   focused: boolFocused,
      // });

      // // Control panel
      // obj = await chromeWindowsUpdate2(saveWinId, {
      //   focused: boolFocused,
      // });
    }

    if (!lowMemoryFlag && openRooms2 && openRooms2[position] && openRooms2.length > 0) {
      // Save my current tabId and windowId
      let currentTab = await chromeTabsQuery({
        active: true,
        currentWindow: true,
      });

      // Control panel window id
      saveWinId = currentTab[0].windowId;

      slider.max = openRooms2.length - 1;

      let myRoom = rooms.filter((el) => el.linkFetchedUrl == getMeetUrlBase(openRooms2[position].url));

      if (!myRoom || myRoom.length < 1) {
        return;
      }

      sliderTitle.innerText = myRoom[0].name;
      sliderTitle.dataset.linkFetchedUrl = myRoom[0].linkFetchedUrl;
      sliderTitle.dataset.tabId = openRooms2[position].id;
      sliderTitle.dataset.winId = openRooms2[position].windowId;

      url = myRoom[0].linkFetchedUrl;
      windowId = openRooms2[position].windowId;
      id = openRooms2[position].id;

      // Make tab active
      boolActive = true;
      // chrome.tabs.update(id, { active: boolActive });

      // taken from here
    }

    if (id == undefined || windowId == undefined || saveWinId == undefined) {
      return;
    }

    // common to lowMemoryFlag and also Normal
    obj = await chromeTabsUpdate2(id, {
      active: boolActive,
    });

    boolFocused = true;

    // Slider current window
    obj = await chromeWindowsUpdate2(windowId, {
      focused: boolFocused,
    });

    // Control panel
    obj = await chromeWindowsUpdate2(saveWinId, {
      focused: boolFocused,
    });

    // Set the av values
    btnSpk = document.querySelector("#thisSpk");
    btnMic = document.querySelector("#thisMic");
    btnVid = document.querySelector("#thisVid");

    btnOtherSpk = document.querySelector("#thatSpk");
    btnOtherMic = document.querySelector("#thatMic");
    btnOtherVid = document.querySelector("#thatVid");

    menuItemThis = `this${getBoolDigit(btnSpk)}${getBoolDigit(btnMic)}${getBoolDigit(btnVid)}`;

    menuItemThat = `that${getBoolDigit(btnOtherSpk)}${getBoolDigit(btnOtherMic)}${getBoolDigit(btnOtherVid)}`;

    handleContextMenuClick(
      {
        pageUrl: url,
        menuItemId: menuItemThis,
      },
      { windowId, id }
    );
    // end taken from here

    // New
    if (myBreakout && myBreakout.myRooms && myBreakout.myRooms.length > 0) {
      let numSelectedRooms = document.querySelector("#meet-room-number").innerText;
      selectedRooms = myBreakout.myRooms.slice(0, numSelectedRooms);
      for (let i = 0; i < selectedRooms.length; i++) {
        const el = myBreakout.myRooms[i];

        if (el.linkFetchedUrl == sliderTitle.dataset.linkFetchedUrl) {
          sliderTitle.innerText = el.name;
          await chromeTabsSendMessage(parseInt(sliderTitle.dataset.tabId), {
            action: "updateTabTitle",
          });
        }
      }
    }
  } catch (err) {
    alert(err);
  }
};

const filterExtensionRooms = (myArray) => {
  try {
    let subset = [];

    if (myArray.length > 0) {
      // Get number of breakouts
      let numRooms = document.querySelector("#meet-room-number").innerText.trim();

      // Get rooms tab rooms
      let rooms = myBreakout.myRooms;
      rooms = rooms.slice(0, numRooms + 1);

      subset = myArray.filter((el) => {
        let bool = false;

        for (let i = 0; i < rooms.length; i++) {
          if (getMeetUrlBase(el.url) == rooms[i].linkFetchedUrl) {
            bool = true;
          }
          // if (el.url.startsWith("https://meet.google.com/")) {
          //   bool = true;
          // }
        }

        return bool;
      });
    }
    return subset;
  } catch (err) {
    return [];
  }
};

const handleSliderMute = (evt, boolClick = true) => {
  (async () => {
    btn = evt.currentTarget;
    icn = btn.querySelector("i");

    if (boolClick) {
      if (btn.classList.contains("av-mute")) {
        btn.classList.remove("av-mute");
      } else {
        btn.classList.add("av-mute");
      }

      // Update icons
      if (icn.classList.contains("fa-volume-up")) {
        icn.classList.remove("fa-volume-up");
        icn.classList.add("fa-volume-mute");
      } else if (icn.classList.contains("fa-volume-mute")) {
        icn.classList.remove("fa-volume-mute");
        icn.classList.add("fa-volume-up");
      }
      if (icn.classList.contains("fa-microphone")) {
        icn.classList.remove("fa-microphone");
        icn.classList.add("fa-microphone-slash");
      } else if (icn.classList.contains("fa-microphone-slash")) {
        icn.classList.remove("fa-microphone-slash");
        icn.classList.add("fa-microphone");
      }
      if (icn.classList.contains("fa-video")) {
        icn.classList.remove("fa-video");
        icn.classList.add("fa-video-slash");
      } else if (icn.classList.contains("fa-video-slash")) {
        icn.classList.remove("fa-video-slash");
        icn.classList.add("fa-video");
      }
    }

    sliderTitle = document.querySelector("#slider-title");

    let link = sliderTitle.dataset.link;
    let id = sliderTitle.dataset.tabId;
    let windowId = sliderTitle.dataset.winId;

    switch (btn.id) {
      case "thisSpk":
        if (btn.classList.contains("av-mute")) {
          handleContextMenuClick({ pageUrl: link, menuItemId: "r0__" }, { windowId, id });
        } else {
          handleContextMenuClick({ pageUrl: link, menuItemId: "r1__" }, { windowId, id });
        }
        break;
      case "thisMic":
        if (btn.classList.contains("av-mute")) {
          handleContextMenuClick({ pageUrl: link, menuItemId: "r_0_" }, { windowId, id });
        } else {
          handleContextMenuClick({ pageUrl: link, menuItemId: "r_1_" }, { windowId, id });
        }
        break;
      case "thisVid":
        if (btn.classList.contains("av-mute")) {
          handleContextMenuClick({ pageUrl: link, menuItemId: "r__0" }, { windowId, id });
        } else {
          handleContextMenuClick({ pageUrl: link, menuItemId: "r__1" }, { windowId, id });
        }
        break;
      case "thatSpk":
        if (btn.classList.contains("av-mute")) {
          handleContextMenuClick({ pageUrl: link, menuItemId: "x0__" }, { windowId, id });
        } else {
          handleContextMenuClick({ pageUrl: link, menuItemId: "x1__" }, { windowId, id });
        }
        break;
      case "thatMic":
        if (btn.classList.contains("av-mute")) {
          handleContextMenuClick({ pageUrl: link, menuItemId: "x_0_" }, { windowId, id });
        } else {
          handleContextMenuClick({ pageUrl: link, menuItemId: "x_1_" }, { windowId, id });
        }
        break;
      case "thatVid":
        if (btn.classList.contains("av-mute")) {
          handleContextMenuClick({ pageUrl: link, menuItemId: "x__0" }, { windowId, id });
        } else {
          handleContextMenuClick({ pageUrl: link, menuItemId: "x__1" }, { windowId, id });
        }
        break;
      case "broadSpk":
        if (btn.classList.contains("av-mute")) {
          handleContextMenuClick({ pageUrl: link, menuItemId: "g0__" }, { windowId, id });
        } else {
          handleContextMenuClick({ pageUrl: link, menuItemId: "g1__" }, { windowId, id });
        }
        break;
      case "broadMic":
        if (btn.classList.contains("av-mute")) {
          handleContextMenuClick({ pageUrl: link, menuItemId: "g_0_" }, { windowId, id });
        } else {
          handleContextMenuClick(
            { pageUrl: link, menuItemId: "g_1_" }, // should this be g01_ ??
            { windowId, id }
          );
        }
        break;
      case "broadVid":
        if (btn.classList.contains("av-mute")) {
          handleContextMenuClick({ pageUrl: link, menuItemId: "g__0" }, { windowId, id });
        } else {
          handleContextMenuClick({ pageUrl: link, menuItemId: "g__1" }, { windowId, id });
        }
        break;

      default:
        break;
    }

    document.querySelector("#slider").focus();
  })();

  return true;
};

const getBoolDigit = (btn) => {
  return btn.classList.contains("av-mute") ? "0" : "1";
};

const muteBroadcast = () => {
  let btn, icn;

  // Broadcast speaker
  btn = document.querySelector("#broadSpk");
  icn = btn.querySelector("i");
  btn.classList.add("av-mute");
  icn.classList.remove("fa-volume-up");
  icn.classList.add("fa-volume-mute");

  // Broadcast microphone
  btn = document.querySelector("#broadMic");
  icn = btn.querySelector("i");
  btn.classList.add("av-mute");
  icn.classList.remove("fa-microphone");
  icn.classList.add("fa-microphone-slash");

  // Broadcast video
  btn = document.querySelector("#broadVid");
  icn = btn.querySelector("i");
  btn.classList.add("av-mute");
  icn.classList.remove("fa-video");
  icn.classList.add("fa-video-slash");
};
