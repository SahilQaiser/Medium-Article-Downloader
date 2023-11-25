chrome.action.onClicked.addListener(tab => {
    articletId = tab.url.split("/")[4];
    articletAuthor = tab.url.split("/")[3];
    articleTitle = tab.title;
    console.log("Got the articleId : " + articletId + " and articleTitle : " + articleTitle +" and articleAuthor : " + articletAuthor);
    // chrome.storage.local.set({ "fromBackground": true }).then(() => {
    //     console.log("fromBackground is set to true");
    // });
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['contentScript.js'] 
    });
});