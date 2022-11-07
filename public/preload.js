const CannabaseMgr = require('../database/CannabaseMgr')

const {contextBridge} = require('electron')

const getNotComplete = () => {
     return CannabaseMgr.getNotComplete(); 
}

contextBridge.exposeInMainWorld("api", {
    getNotComplete: getNotComplete
})