export const getUserData = async () => {
    return await window.gapi.client.request({
        'path': '/drive/v3/about?fields=user',
        'method': 'GET'
    }).then((res) => res.result);
}


export const getAllFiles = async () => {
    return await window.gapi.client.drive.files.list({
        spaces: 'appDataFolder',
        // fields: 'files(id, name)',
        pageSize: 100
    }).then((res) => res.result)
}

export const createFile = async () => {
    return await window.gapi.client.drive.files.create({
        resource: {
            'name': 'data',
            'parents': ['appDataFolder']
        }
    }).then((res) => res.result);
}

export const removeAllFiles = () => {
    exports.getAllFiles().then((res) => {
        res.files.forEach((file) => {
            window.gapi.client.request({
                'path': '/drive/v3/files/' + file.id,
                'method': 'DELETE'
            }).execute((res) => {
                console.log(res)
            });
        })
    })
}

export const updateFile = async (fileId, data) => {
    return await window.gapi.client.request({
        'path': '/upload/drive/v3/files/' + fileId,
        'method': 'PATCH',
        'params': { 'uploadType': 'multipart' },
        'body': data
    }).then((res) => res.result);
}

export const downloadFile = async (fileId) => {
    return await window.gapi.client.drive.files.get({
        fileId: fileId,
        alt: 'media'
    }).then((res) => res)
}