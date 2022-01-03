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
                    alert(windowWidth)
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
                    alert(windowHeight)
                }
            );
        }
    );
}

function main() {
    getWindowWidth()
    getWindowHeight()
}

main()

1366, 768

