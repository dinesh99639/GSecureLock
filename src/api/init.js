import config from '../config.json';
import { getAllFiles, createFile, downloadFile } from './drive';

const initDrive = (setState) => {
    window.gapi.client.load('drive', 'v3', async () => {
        let isLoggedIn = window.gapi.auth2.getAuthInstance().isSignedIn.get();
        let dataFileId = null;
        let data = '';

        if (isLoggedIn) {
            dataFileId = localStorage.getItem('dataFileId')

            if (dataFileId === null) {
                let res = await getAllFiles();

                if (res.files.length === 0) {
                    res = await createFile()
                    res = { files: [{ id: res.id }] }
                }
                dataFileId = res.files[0].id;

                localStorage.setItem('dataFileId', dataFileId)
            }

            let res = await downloadFile(dataFileId);
            data = res.body;
        }

        setState({ isLoggedIn, dataFileId, data })
    })
}

const initClient = async (setState) => {
    await window.gapi.load('client:auth2', async () => {
        await window.gapi.client.init({
            clientId: config.CLIENT_ID,
            scope: config.SCOPES.join(' ')
        }).then((res) => initDrive(setState))
    });
}

const loadGoogleApi = async (setState) => {
    var scr = document.createElement('script'),
        head = document.head || document.getElementsByTagName('head')[0];
    scr.src = 'https://apis.google.com/js/api.js';

    head.insertBefore(scr, head.firstChild);
    scr.addEventListener('load', async () => {
        await initClient(setState)
    })
}

const initApp = (setState) => loadGoogleApi(setState);

export default initApp;