const http = require('http');
const mysql = require('mysql');
const fs = require('fs');
const io = require('socket.io');
const url = require('url');
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
    const {
        pathname,
        query
    } = url.parse(req.url, true);

    // 重要（安全性）：校验数据是否符合规范
    // 验证用户名和密码的数据
    const validate = (username, password) => {
        let validated = true;

        if (!regs.username.test(username)) {
            console.log('用户名不符合规范');

            validated = false;
            res.write(JSON.stringify({
                code: 1,
                msg: '用户名不符合规范'
            })); // write 的参数只能是 string 或 buffer
            res.end();
        }

        if (validated && !regs.password.test(password)) {
            console.log('密码不符合规范');

            validate = false;
            res.write(JSON.stringify({
                code: 1,
                msg: '密码不符合规范'
            }));
            res.end();
        }
        return validated;
    }

    if (pathname == '/reg') { // 注册
        const {
            username,
            password
        } = query;

        if (validate(username, password)) {
            // 用户名是否重复
            db.query(`SELECT * FROM user_table WHERE username='${username}'`, (err, data) => {
                if (err) {
                    console.log('查询数据错误');

                    res.write(JSON.stringify({
                        code: 1,
                        msg: '数据库错误'
                    }));
                    res.end();
                } else {
                    if (data.length) {
                        console.log('用户名已经存在');

                        res.write(JSON.stringify({
                            code: 1,
                            msg: '用户名已经存在'
                        }));
                        res.end();
                    } else {
                        // 增加数据
                        db.query(`INSERT INTO user_table (username,password,online) VALUES ('${username}','${password}',0)`, (err, data) => {
                            if (err) {
                                console.log('增加数据错误');

                                res.write(JSON.stringify({
                                    code: 1,
                                    msg: '数据库错误'
                                }));
                                res.end();
                            } else {
                                console.log(data);

                                res.write(JSON.stringify({
                                    code: 0,
                                    msg: '新增成功'
                                }));
                                res.end();
                            }
                        });
                    }
                }
            });
        }
    } else if (pathname == '/login') {
        // 登录
        const {
            username,
            password
        } = query;
        if (validate(username, password)) {
            // 检查用户是否存在
            db.query(`SELECT ID,password FROM user_table WHERE username='${username}'`, (err, data) => {
                if (err) {
                    console.log('数据库查询错误');

                    res.write(JSON.stringify({
                        code: 1,
                        msg: '数据库错误'
                    }));
                    res.end();
                } else {
                    if (data.length) {
                        if (data[0].password == password) {
                            console.log('登录成功');

                            // 修改登录状态
                            db.query(`UPDATE user_table SET online=1 WHERE ID=${data[0].ID}`, (err, data) => {
                                if (err) {
                                    console.log('修改数据库错误');
                                    res.write(JSON.stringify({
                                        code: 1,
                                        msg: '数据库错误'
                                    }));
                                    res.end();
                                } else {
                                    // 修改状态成功 -> 登录成功
                                    res.write(JSON.stringify({
                                        code: 0,
                                        msg: '登陆成功'
                                    }));
                                    res.end();
                                }
                            });
                        } else {
                            console.log('密码不正确');

                            res.write(JSON.stringify({
                                code: 1,
                                msg: '密码不正确'
                            }));
                            res.end();
                        }
                    } else {
                        console.log('用户不存在');

                        res.write(JSON.stringify({
                            code: 1,
                            msg: '用户不存在'
                        }));
                        res.end();
                    }
                }
            })

            // 密码是否正确
        }
    } else {
        // 读取文件
        fs.readFile(`www${pathname}`, (err, data) => {
            if (err) {
                res.writeHeader(404);
                res.write('Not Found');
            } else {
                res.write(data);
            }

            res.end();
        });
    }
});
httpServer.listen(port);

// ws 服务
const wsServer = io.listen(httpServer);
wsServer.on('connection', sock => {

});


/* 
  接口定义：
    用户注册: /reg?username=xxx&password=xxx
            返回：{"code":0,"msg":"信息"}
    用户登录：/login?username=xxx&password=xxx
            返回：{"code":0,"msg":"信息"}
*/

/* 
  请求类型：
  1. 请求文件 -> fs
  2. 请求接口 -> 数据库
*/