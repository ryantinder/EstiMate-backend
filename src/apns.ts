import apn from 'node-apn-http2'
import fs from 'fs'

if (!fs.existsSync(`${__dirname}/AuthKey.p8`)) {
    fs.writeFileSync(`${__dirname}/AuthKey.p8`, "-----BEGIN PRIVATE KEY-----\n" + process.env.APNS_AUTH_KEY! + "\n-----END PRIVATE KEY-----", 'utf8')
}

export const sendAPNS = async (myDeviceToken: string, alert: string, name: string, type: string, data: any) => {

    console.log("sending apns", myDeviceToken)
    var options = {
        token: {
            key: fs.readFileSync(`${__dirname}/AuthKey.p8`),
            keyId: process.env.APNS_KEY_ID!,
            teamId: process.env.APNS_TEAM_ID!
        },
        production: false,
        hideExperimentalHttp2Warning: true 
    };

    var apnProvider = new apn.Provider(options);
    let deviceToken = myDeviceToken
    var note = new apn.Notification({'name': name, 'type': type, 'data': data});

    note.expiry = Math.floor(Date.now() / 1000) + 3600
    note.alert = alert;
    note.topic = "com.zhuhaoyu.EstiMate";

    await apnProvider.send(note, deviceToken).then(console.log)
}