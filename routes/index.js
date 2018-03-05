var express = require('express');
var router = express.Router();
var User=require('../node_modules/user.js')
var flash = require('connect-flash');
const crypto = require('crypto');

/* GET home page. */
router.get('/', function(req, res, next) {
    
  if(req.session.user){
        return  res.render('index',{
                title:'首頁',
                user:req.session.user
        });
       
  }
  else{
    return res.redirect('login');
  }
});



router.post('/post', function(req, res, next) {
  
});
router.get('/reg', function(req, res, next) {
  if(req.session.user){
        
         return res.redirect('/');
  }
  else{
      return res.render('reg',{
          title:'使用者註冊',
          user:req.session.user
      })
  }
});
router.post('/reg', function(req, res, next) {
  //檢驗使用者兩次輸入的密碼是否一致
  if(req.body['password-repeat'] != req.body['password']){
      
      
      return  res.render('reg',{
          title:'使用者註冊',
          user:req.session.user,
          error:'兩次密碼不同'
      });
      
      
  }
  
  //產生密碼的雜湊值
  var md5=crypto.createHash('md5');
  var password=md5.update(req.body.password).digest('base64');
  
  var newUser=new User({
      name:req.body.name,
      username:req.body.username,
      password:password
  });
  
  //檢查使用者是否存在
    User.get(newUser.username,function(err,user){
        if(err)console.log(err);
        if(user){
          
            return  res.render('reg',{
                title:'使用者註冊',
                error:'此帳號已有人使用!!',
                user:req.session.user
            });

          
        }
        //如果不存在則新增使用者
      
        newUser.save(function(err){
            if(err){
              
              return res.redirect('/reg');
            }
            
            
            return res.render('reg',{
               title:'使用者註冊',
               success:'註冊成功!!',
               user:req.session.user
            })
            
        });
      
    });
});
router.get('/login', function(req, res, next) {
 
  if(req.session.user){
        
         return res.redirect('/');
  }
  else{
      
      return res.render('login',{
         title:'使用者登入' ,
         user:req.session.user
      });
  }
});
router.post('/login', function(req, res, next) {
    //產生密碼的雜湊值
    var md5=crypto.createHash('md5');
    var password=md5.update(req.body.password).digest('base64');
    
    //檢查使用者是否存在
    User.get(req.body.username,function(err,user){
        if(err){
            console.log(err);
            return  res.render('login',{
                title:'使用者註冊',
                user:req.session.user,
                error:'使用者登入失敗!請通知資料庫管理人員:育銘!!'
            });
        }
        if(!user){
            
            return  res.render('login',{
                title:'使用者註冊',
                user:req.session.user,
                error:'使用者不存在!!'
            });

          
        }
        if(user.password!=password){
          
            return  res.render('login',{
                title:'使用者註冊',
                user:req.session.user,
                error:'使用者密碼錯誤!!'
            });
        }
        //登入成功
       
        req.session.user=user;
        console.log(req.session);
        return res.redirect('/');
        
    });
});
router.get('/logout', function(req, res, next) {
        
        req.session.user=null;
        return   res.redirect("./");
});
module.exports = router;
