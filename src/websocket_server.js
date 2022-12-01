const Poll = require('./Poll.js');
const WebSocket = require('ws')
const wss = new WebSocket.Server({port:5050})

let count = 0;
let clientCount = 0;
let clientsMap = new Map();
let pollCreated = false;
let currentPoll = null;

wss.on('connection', wsclient => {
    console.log("New client connected.");
    clientCount ++;
    clientsMap.set(wsclient, {nr: clientCount, ip: wsclient._socket.remoteAddress})

    wsclient.on('message', msg => {
        let data = JSON.parse(msg);
        switch (data.cmd) {
            case 'CREATE_POLL':
                if (pollCreated) {
                    console.log("Poll already exists");
                } else {
                    let POLL = new Poll(data.question, {
                        0: { title: "Yes" },
                        1: { title: "No" },
                    });
                    currentPoll = POLL;
                    pollCreated = true;
                    notifyClientThatPollExists(wsclient);
                }
                break;

            case 'VOTE':
                if (pollCreated) {
                    currentPoll.vote(data.vote, data.name)
                    notifyClients();
                    console.log(currentPoll.results)
                }
            default:
                break;
        }
    })
    notifyClientThatPollExists(wsclient);
})

const notifyClientThatPollExists = (wsclient) => {
    if (pollCreated) {
        wsclient.send(JSON.stringify({
            cmd: 'POLL_EXISTS',
            question: currentPoll.question,
            results: currentPoll.results
        }));
    }
}

const notifyClients = () => {
    console.log("Sending new results to ", wss.clients.size, " clients.")

    wss.clients.forEach((client) => {
        client.send(JSON.stringify({
            cmd: 'NEW_RESULTS',
            currentResults: currentPoll.results
        }));
        console.log("send to client: NEW_RESULTS");
    })
}