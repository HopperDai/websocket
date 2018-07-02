const http = require('http');
const io = require('socket.io');

// 1. 创建 http 服务
const httpServer = http.createServer();
httpServer.listen(8080);

// 2. 创建 websocket 服务
const wsServer = io.listen(httpServer); // ws 基于 http
wsServer.on('connection', sock => {
    console.log('连接成功');

    sock.on('test', num => {
        console.log('浏览器数据', num);
    });

    setInterval(() => {
        sock.emit('num1', Math.random());
    }, 1000);
});