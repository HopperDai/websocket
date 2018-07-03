# websocket 数据交互

1.  性能高

2.  双向 - 数据实时性高

3.  HTML5 IE9+

4.  socket.io

    - 兼容

    - 传输二进制数据

- 双工

- HTML5

- 使用广泛

- 浏览器和服务器的通信采用 http 协议，websocket 协议是基于 http 的

## package.json

- 存依赖 `npm i socket.io -D` (-D:开发依赖)

- 在 `scripts` 中定义运行命令

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

### demo 案例功能

- 用户注册、登录

- 发言 -> 其他人

- 离线消息

#### 数据 -> 数据库

- 用户账号数据

- 消息数据
