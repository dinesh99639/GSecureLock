import config from '../config';
import { getAllFiles, createFile, downloadFile } from './drive';

const initDrive = (updateLoginStatus, updateLocalStore) => {
    window.gapi.client.load('drive', 'v3', async () => {
        let isLoggedIn = window.gapi.auth2.getAuthInstance().isSignedIn.get();
        let dataFileId = null;
        let encryptedData = '';
        
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
            encryptedData = res.body;
            localStorage.setItem('encryptedData', encryptedData);
        }
        
        updateLoginStatus(isLoggedIn);
        updateLocalStore({ dataFileId, encryptedData });
    })
}

const initClient = async (updateLoginStatus, updateLocalStore) => {
    await window.gapi.load('client:auth2', async () => {
        await window.gapi.client.init({
            clientId: config.CLIENT_ID,
            scope: config.SCOPES.join(' ')
        }).then((res) => initDrive(updateLoginStatus, updateLocalStore))
    });
}

const loadGoogleApi = async (updateLoginStatus, updateLocalStore) => {
    var scr = document.createElement('script');
    var head = document.head || document.getElementsByTagName('head')[0];
    scr.src = 'https://apis.google.com/js/api.js';

    head.insertBefore(scr, head.firstChild);
    scr.addEventListener('load', async () => {
        await initClient(updateLoginStatus, updateLocalStore)
    })
}

const initApp = (updateLoginStatus, updateLocalStore) => loadGoogleApi(updateLoginStatus, updateLocalStore);

export default initApp;