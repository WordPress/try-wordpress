// Open the sidebar when clicking on the extension icon.
if (typeof chrome.sidePanel !== 'undefined') {
    // Chrome.
    chrome.sidePanel
        .setPanelBehavior({ openPanelOnActionClick: true })
        .catch((error) => console.error(error));
} else if (typeof browser.sidebarAction !== 'undefined') {
    // Firefox.
    browser.action.onClicked.addListener(() => {
        browser.sidebarAction.toggle();
    });
} else {
    console.error('unsupported browser');
}
