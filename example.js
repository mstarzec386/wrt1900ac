const Wrt1900ac = require('./wrt1900ac.js');

const wrtApi = new Wrt1900ac();

wrtApi.setPass('pass');

wrtApi.getNetworkConnections((err, data) => {
    console.info(err, data);
})

wrtApi.getDevices((err, data) => {
    console.info(err, data);
})
