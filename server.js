const http = require('http');
const io = require('socket.io');

const port = 8080;

// http 服务
const httpServer = http.createServer();
httpServer.listen(port);

// ws 服务
const wsServer = io.listen(httpServer);
wsServer.on('connection', sock => {
    sock.on('num', (...data) => {
        console.log(data);
    })
});