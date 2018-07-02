# websocket

- 双工

- HTML5

- 使用广泛

- 浏览器和服务器的通信采用 http 协议，websocket 协议是基于 http 的

## 库

- socket.io node、前台

  1.  服务端

      - 先有个 http 服务

        ```javascript
        let httpServer = http.createServer();
        httpServer.listen();
        ```

      - 再有个 ws 服务

        ```javascript
        let wsServer = io.listen(httpServer);
        wsServer.on("connection", function(sock) {
          // sock 对象;
        });
        ```

  2.  浏览器

      - 引库
        `<script src="xxx/socket.io/socket.io.js"></script>`

      - 连接

        ```javascript
        let socket = io.connect("ws://xxx/"); // sock 对象;
        ```

  - socket 对象

    - socket.emit('消息名字',参数...); 发送

    - socket.on('消息名字',function(参数...){}) 接收
