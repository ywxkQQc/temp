const express = require('express');
const pool = require('../db/pool.js');

const r = express.Router();

//用户注册
r.post('/userRegister', (req, res) => {
    //1.获取post 请求数据
    let obj = req.body;
    console.log(obj)
    //2.验证数据是否为空
    if (!obj.uName) {
        res.send({code: 401, msg: 'uName required'});
        //阻止往后执行
        return;
    }
    if (!obj.uPwd) {
        res.send({code: 402, msg: 'uPwd required'});
        //阻止往后执行
        return;
    }
    if (!obj.uPhone) {
        res.send({code: 403, msg: 'uPhone required'});
        //阻止往后执行
        return;
    }
    //执行sql命令  将数据添加到数据库
    pool.query('INSERT INTO users SET ?', [obj], (err, result) => {
        if (err) throw err;
        console.log(result);
        //注册成功
        res.send({code: 200, msg: 'reg success'})
    })
})

//用户登录
r.post('/userLogin', (req, res) => {
    //获取数据
    let obj = req.body;
    console.log(obj);
    var uName = obj.uName;
    var uPwd = obj.uPwd;
    //验证数据是否为空
    if (!uName) {
        res.send({code: 401, msg: 'uName required'})
        return;
    }
    if (!uPwd) {
        res.send({code: 402, msg: 'userPwd required'})
        return;
    }
    //到数据库中查询是否有用户名和密码同时匹配的数据
    pool.query('SELECT * FROM users WHERE uName=? AND uPwd=?', [uName, uPwd], (err, result) => {
        if (err) throw err;
        //返回空数组，长度为0 ，说明登录失败
        if (result.length === 0) {
            res.send({code: 301, msg: 'login err'})
        } else {//查询到匹配的用户  登录成功
            req.session.uId = result[0].uId;
            console.log(result[0].uId)
            res.send({code: 300, msg: 'login success'})
        }
    })
})

r.post('/isLogin',(req, res) => {
    if(req.session.uId){
        res.send({code: 1, msg: '已登录'})
    }
    else{
        res.send({code: 0, msg: '未登录'})
    }
})

r.post('/userLogout', (req, res) => {
    console.log(req.session)
    if (req.session.uId) {
        var uId = req.session.uId;
        req.session.uId = ""
        res.send({code: 900, msg: 'logout success'});
    } else {
        res.send({code: 901, msg: 'logout err'});
    }
})

//导出路由器
module.exports = r;
