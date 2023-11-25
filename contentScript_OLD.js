(() => {
    articletId = document.URL.split("/")[4];
    if (typeof articletId == "undefined") {
        articletId = document.URL.split("/")[3];
    }
    articletAuthor = document.URL.split("/")[3];
    articleTitle = document.title;
    let fromBackground = true;

    const extractNewArticleEventHandler = () => {
        console.log("Got the articleId : " + articletId + " and articleTitle : " + articleTitle +" and articleAuthor : " + articletAuthor);
        // var mainDiv = document.getElementsByTagName("main")[0];
        if (document.getElementsByTagName("article")) {
            var articleDiv = document.getElementsByTagName("article")[0];
            var firstDiv = articleDiv.getElementsByTagName("section")[0];
            const header = document.getElementsByTagName("head")[0];
            const styleNodes = header.getElementsByTagName("style");
            const metaNodes = header.getElementsByTagName("meta");
            const scriptNodes = document.getElementsByTagName("body")[0].getElementsByTagName("script");
            var headerNode = "<head>";
            for(let i=0; i<styleNodes.length; i++) {
                if (styleNodes[i].getAttribute("data-fela-type") === "KEYFRAME") {
                    // skip style nodes with data-fela-type="KEYFRAME"
                    continue;
                }
                headerNode += `<style>${styleNodes[i].innerHTML}</style>`;
            }
            for(let i=0; i<metaNodes.length; i++) {
                headerNode += "<meta name='" + metaNodes[i].name + "' data-rh='" + metaNodes[i].dataset.rh + "' content='" + metaNodes[i].content + "' />";
            }
            headerNode += "</head>";
            scriptNode = "";
            for(let i=0; i<scriptNodes.length; i++) {
                scriptNode += "<script src='" + scriptNodes[i].src + "' />";
            }
            var modifiedHtml = headerNode + "<div style='justify-content: center;' class='ab cb cc'><main class='cd ce cf cg ch ci l cj'><div class='l'>" + firstDiv.innerHTML + "</div></main></div>" + scriptNode;

            var file = new Blob([modifiedHtml], { type: "text/html" });
            var link = document.createElement("a");
            link.download = articletId + ".html";
            link.href = URL.createObjectURL(file);
            link.click();
        }
    }
    // chrome.storage.local.get(["fromBackground"]).then((result) => {
    //     console.log("fromBackground : " + result.key);
    //     fromBackground = result.key;
    // });
    if (typeof articletId != "undefined") {
        setTimeout(extractNewArticleEventHandler(),1000);       
    }
})();