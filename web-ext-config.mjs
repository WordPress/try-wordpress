// Note that not all settings apply to chrome, for example browserConsole and devtools do nothing on chrome.
// See https://github.com/mozilla/web-ext/issues/2580.

export default {
    // verbose: true,
    run: {
        startUrl: ["https://alex.kirk.at"],
        profileCreateIfMissing: true,
        browserConsole: true,
        devtools: true,
    }
}
