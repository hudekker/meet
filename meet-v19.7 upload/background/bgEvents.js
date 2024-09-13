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

      // let params;
      // if (payload.params) {
      //   params = payload.params;
      // }

      switch (payload.action) {
        // case "queryThisTabMutedInfo":
        //   tabs = await chromeTabsQuery2({ url: sender.tab.url });

        //   callback({
        //     text: `This tab muted info is `,
        //     tabs: tabs,
        //   });
        //   break;

        // case "update":
        //   myTabs = await chromeTabsUpdate2(
        //     sender.tab.id,
        //     payload.params.updateProperties
        //   );

        //   callback({
        //     text: "Callback from Update",
        //     senderTabId: sender.tab.id,
        //     tabs: myTabs,
        //   });
        //   break;

        // case "openWinOne":
        //   await openWinOne(payload);
        //   break;

        // case "openTabOne":
        //   await openTabOne(payload);
        //   break;

        case "GETSPKSTATE":
          // Get the current muted state
          tabsQuery = await chromeTabsQuery2({ url: sender.tab.url });
          boolMuted = tabsQuery[0].mutedInfo.muted;

          // Return the current state
          callback({ boolMuted: boolMuted });
          break;

        case "SPKBTNCLICKED":
          // Get the current muted state
          tabsQuery = await chromeTabsQuery2({ url: sender.tab.url });
          boolMuted = !tabsQuery[0].mutedInfo.muted;

          // Toggle this state
          // tabsUpdated = await chromeTabsUpdate2(sender.tab.id, {
          //   muted: boolMuted,
          // });

          chrome.tabs.update(sender.tab.id, {
            muted: boolMuted,
          });

          callback({ boolMuted: boolMuted });
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
