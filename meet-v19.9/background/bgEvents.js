// Multiple windows
// chrome.windows.onFocusChanged.addListener((windowId) => {
//   setContextMenu();
//   return true;
// });

// chrome.tabs.onActivated.addListener((tabId, changeInfo, tab) => {
//   setContextMenu();
//   return true;
// });

// chrome.contextMenus.onClicked.addListener(handleContextMenuClick);

chrome.runtime.onMessage.addListener((payload, sender, callback) => {
  (async () => {
    try {
      let myTabs;
      let tabs;

      switch (payload.action) {
        // Currently not used
        case "GETSPKSTATE":
          // Get the current muted state
          tabsQuery = await chromeTabsQuery2({ url: sender.tab.url });
          boolMuted = tabsQuery[0].mutedInfo.muted;

          // Return the current state
          callback({ boolMuted: boolMuted });
          break;

        // From content
        case "SPKBTNCLICKED":
          {
            // Get the current muted state

            let tabId = sender.tab.id;
            let tab = await chromeTabsGet(tabId);
            let boolMuted = !tab.mutedInfo.muted;

            console.log(`SPKBTNCLICKED for tabId ${tabId} from ${tab.mutedInfo.muted} to ${boolMuted}`, tab);

            chrome.tabs.update(tabId, { muted: boolMuted }, callback({ boolMuted }));
          }
          return true;
          break;

        case "tellContextToUpdateTabs":
          let tabs = await chromeTabsQuery({});

          let tabs2 = tabs.filter((el) => {
            let bool = false;

            if (el.url && el.url.startsWith("https://meet.google.com/")) {
              bool = true;
            }

            return bool;
          });

          for (let i = 0; i < tabs2.length; i++) {
            console.log(`tab is is ${tabs2[i].id}, url is ${tabs2[i].url}`);
            // await chromeTabsSendMessage(tabs2[i].id, {
            //   action: "updateTabTitle",
            // });
            chrome.tabs.sendMessage(tabs2[i].id, {
              action: "updateTabTitle",
            });
          }
          break;

        // Todo: look at this because gt_ids can be out of date
        case "getTableOfTabs":
          callback(gt_ids);
          break;

        case "getAvailWidthHeight":
          callback({ width: g_availWidth, height: g_availHeight });
          break;

        case "closeRoomTab":
          mySender = sender;
          tabId = payload.tabId;
          winId = payload.winId;

          tabId = sender.tab.id;
          winId = sender.tab.windowId;
          if (Number.isInteger(tabId)) {
            chrome.tabs.remove(tabId);
          }
          break;

        case "closeRoomTab2":
          tabId = payload.tabId;

          if (Number.isInteger(tabId)) {
            chrome.tabs.remove(tabId);
          }
          break;

        case "openWinMulti":
          await openWinMulti(payload);
          await sleep(1000);
          await chromeRuntimeSendMessage({
            action: "updateSliderFocus",
          });
          callback({ msg: "Opened Windows" });
          break;

        case "openTabMulti":
          await openTabMulti(payload);
          await sleep(1000);
          await chromeRuntimeSendMessage({
            action: "updateSliderFocus",
          });
          callback({ msg: "Opened Tabs" });
          break;

        default:
          break;
      }
    } catch (err) {}
  })();

  return true;
});
