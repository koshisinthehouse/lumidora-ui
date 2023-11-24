const {ipcRenderer} = require('electron');
window.api = {
    ipcRenderer: ipcRenderer
};

window.addEventListener('DOMContentLoaded', () => {
    const {ipcRenderer} = window.api;
    const stringArray = ['lumidora-tts', 'lumidora-sd-webui'];
    for (let i = 0; i < stringArray.length; i++) {
        const currentValue = stringArray[i];
        document.getElementById(currentValue).addEventListener('click', () => {
            ipcRenderer.send('open-new-url', {module: currentValue});
        });
    }
});