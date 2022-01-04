function getWindowWidth() {
    chrome.tabs.query(
        { active: true, lastFocusedWindow: true },
        function (tabs) {
            chrome.tabs.executeScript(
                <number>tabs[0].id,
                {
                    code: `window.innerWidth;`
                },
                (result) => {
                    const windowWidth: number = Number(
                        result[0]
                    );
                    // alert(windowWidth)
                    console.log(windowWidth)
                }
            );
        }
    );
}

function getWindowHeight() {
    chrome.tabs.query(
        { active: true, lastFocusedWindow: true },
        function (tabs) {
            chrome.tabs.executeScript(
                <number>tabs[0].id,
                {
                    code: `window.innerHeight;`
                },
                (result) => {
                    const windowHeight: number = Number(
                        result[0]
                    );
                    // alert(windowHeight)
                    console.log(windowHeight)
                }
            );
        }
    );
}

function resizeWindow(width: number, height: number) {
    console.log(width)
    console.log(height)
    let updateInfo = {
        width: width,
        height: height,
        state: "normal"
    };
    chrome.windows.getCurrent({ populate: true }, function(currentWindow) {
        if (currentWindow.id != null) {
            // @ts-ignore
            chrome.windows.update(currentWindow.id, updateInfo)
        }
    });
}

async function main() {
    // getWindowWidth()
    // getWindowHeight()
    // await chrome.tabs.create({ url: "https://qiita.com/Tachibana446/items/ab15021099d54d1209c2" });
    resizeWindow(900, 644)
}

main()

