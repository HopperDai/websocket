const http = require('http');
const mysql = require('mysql');
const fs = require('fs');
const io = require('socket.io');
const regs = require('./libs/regs');

const port = 8080;

// 连接数据库
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'websocket'
});

// http 服务
const httpServer = http.createServer((req, res) => {
    fs.readFile(`www${req.url}`, (err, data) => {
        if (err) {
            console.log('读取文件失败');
            res.writeHeader(404);
            res.write('Not Found');
            res.end();
        } else {
            res.write(data);
            res.end();
        }
    })
});
httpServer.listen(port);

// ws 服务
const wsServer = io.listen(httpServer);
wsServer.on('connection', sock => {

    // 校验数据
    const validate = (ret_name, username, password) => {
        let validated = true;

        if (!regs.username.test(username)) {
            console.log('用户名不符合规范');

            validated = false;
            sock.emit(ret_name, 1, '用户名不符合规范');
        }

        if (validated && !regs.password.test(password)) {
            console.log('密码不符合规范');

            validated = false;
            sock.emit(ret_name, 1, '密码不符合规范');
        }

        return validated;
    }

    // 注册
    sock.on('reg', (username, password) => {

        if (validate('reg_ret', username, password)) {
            // 用户名是否重复
            db.query(`SELECT * FROM user_table WHERE username='${username}'`, (err, data) => {
                if (err) {
                    console.log('数据库 SELECT 错误');
                    sock.emit('reg_ret', 1, '数据库错误');
                } else {
                    console.log(data);
                    if (data.length) {
                        console.log('用户名已经存在');

                        sock.emit('reg_ret', 1, '用户名已经存在');
                    } else {
                        // 新增数据

                        db.query(`INSERT INTO user_table (username,password,online) VALUES ('${username}','${password}',0)`, (err, data) => {
                            if (err) {
                                console.log('数据库 INSERT 错误', err);
                                sock.emit('reg_ret', 1, '数据库错误');
                            } else {
                                sock.emit('reg_ret', 0, '注册成功');
                            }
                        });
                    }
                }
            })

        }
    });

    // 登录
});


/* 
    ws 接口
    'reg',username,password  ->  'reg_ret',code,msg
    'login',username,password  ->  'login_ret',code,msg
*/