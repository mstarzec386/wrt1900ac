const request = require('request');

module.exports = class Wrt1900ac {
    constructor(config) {
        this._host = '192.168.1.1';
        this._login = 'admin';
        this._password = 'admin';

        this._setConfig(config);
    };

    _setConfig(config) {
        if (!config) {
            return;
        }

        if (config.host) {
            this.setHost(config.host);
        }

        if (config.login) {
            this.setLogin(config.login);
        }

        if (config.password) {
            this.setPass(config.password);
        }
    };

    _getJNAPAuthorization() {
        return 'Basic ' + Buffer.from(this._login + ':' + this._password).toString('base64');
    }

    _makeRequest(action, cb) {
        const options = {
            method: 'POST',
            url: 'http://' + this._host + '/JNAP/',
            headers: {
                'X-JNAP-Authorization': this._getJNAPAuthorization(),
                'X-JNAP-Action': 'http://linksys.com/jnap/core/Transaction',
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: '[{"action":"http://linksys.com/jnap/' + action + '","request":{}}]'
        };

        function responseCallback(err, response, body) {
            if (err) {
                return cb(err, null);
            }

            if (response.statusCode !== 200) {
                return cb(new Error('Wrong status code: ' + response.statusCode), body);
            }

            let data;

            try {
                data = JSON.parse(body);
            } catch (e) {
                return cb(e, null);
            }

            return cb(null, data);
        }

        request(options, responseCallback);
    };

    setHost(host) {
        if (host) {
            this._host = host;
        }

        return this;
    };

    setLogin(login) {
        if (login) {
            this._login = login;
        }

        return this;
    };

    setPass(password) {
        if (password) {
            this._password = password;
        }

        return this;
    };

    // -- api --
    getNetworkConnections(cb) {
        this._makeRequest('networkconnections/GetNetworkConnections', (err, data) => {
            if (err) {
                return cb(err, data);
            }

            if (!data || !data.responses || !data.responses[0] || !data.responses[0].output || !data.responses[0].output.connections) {
                return cb(new Error('Wrong Response'), null);
            }

            return cb(err, data.responses[0].output.connections);
        });
    };

    getDevices(cb) {
        this._makeRequest('devicelist/GetDevices', (err, data) => {
            if (err) {
                return cb(err, data);
            }

            if (!data || !data.responses || !data.responses[0] || !data.responses[0].output || !data.responses[0].output.devices) {
                return cb(new Error('Wrong Response'), null);
            }

            return cb(err, data.responses[0].output.devices);
        });
    };

};

