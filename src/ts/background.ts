// chrome.runtime.onMessage.addListener(() => {
//     // alert("background")
//     resizeWindow(644, 900)
//
// });

// function resizeWindow(width: number, height: number) {
//     console.log(width)
//     console.log(height)
//     let updateInfo = {
//         width: width,
//         height: height,
//         state: "normal"
//     };
//     chrome.windows.getCurrent({ populate: true }, function(currentWindow) {
//         if (currentWindow.id != null) {
//             // @ts-ignore
//             chrome.windows.update(currentWindow.id, updateInfo)
//         }
//     });
// }
