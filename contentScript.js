// Constants
var SELECTORS = {
  ARTICLE: 'article', 
  HEAD: 'head',
  STYLE: 'style',
  META: 'meta',
  SCRIPT: 'script'  
}

var TIMER = 1000;

// Helper functions
async function getArticleMetadata(url) {
    // Logic to extract id, title, author
    articletId = url.split("/")[4];
    if (typeof articletId == "undefined") {
        articletId = url.split("/")[3];
    }
    articletAuthor = url.split("/")[3];
    articleTitle = document.title;
    return {articletId, articleTitle, articletAuthor}; 
}

function buildArticleHTML({metadata, content}) {
    // Extract required nodes
    const header = document.getElementsByTagName("head")[0];
    const styleNodes = header.querySelectorAll(SELECTORS.STYLE); 
    const metaNodes = header.querySelectorAll(SELECTORS.META);

    // Build header HTML
    var headerNode = "<head>";
    styleNodes.forEach(style => {
      if (style.getAttribute("data-fela-type") !== "KEYFRAME") {
        headerNode += `<style>${style.innerHTML}</style>`  
      }
    });

    metaNodes.forEach(meta => {
      headerNode += `
        <meta 
          name='${meta.name}'
          data-rh='${meta.dataset.rh}' 
          content='${meta.content}'
        />
      `; 
    });

    headerNode += "</head>";

    const articleHTML = `
        ${headerNode}  
        <body>
            ${content.outerHTML}
        </body>
    `;
    return articleHTML; 
} 

async function downloadArticle(articleHTML, metadata) {
    try {
        const filename = `${metadata.articletId}.html`;
        // Chrome downloads API 
        const options = {
          url: URL.createObjectURL(new Blob([articleHTML])),
          filename: filename
        }
        if(chrome.downloads) {
          console.log("downloads API available"); 
          let downloadId = await chrome.downloads.download(options);
          console.log('Saved article to : ', filename, 'DownloadID : ', downloadId);
        } else {
          console.log("downloads API not available"); 
          var file = new Blob([articleHTML], { type: "text/html" });
          var link = document.createElement("a");
          link.download = filename + ".html";
          link.href = URL.createObjectURL(file);
          link.click();
        }
        
      } catch(error) {
            console.error('Download failed : ', error);  
      }
}

// Main logic
async function main() {

  try {
    // Get metadata
    const metadata = await getArticleMetadata(document.URL);
    // Extract content
    const content = document.querySelector(SELECTORS.ARTICLE);
    // Build HTML 
    const articleHTML = buildArticleHTML({
        metadata,
        content
    });
    // Download article
    await downloadArticle(articleHTML, metadata);
    
  } catch (error) {
        console.log(error); 
  }

}

console.log("Starting the extension...");
main();

// document.addEventListener('DOMContentLoaded', () => {
//   console.log("Starting the extension...inside main()");
//   main();
// });