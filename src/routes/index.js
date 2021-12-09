const express = require('express');
const cors = require('cors');
const mcache = require('memory-cache');
const path = require('path')
const breej = require('breej')
const CryptoJS = require("crypto-js");
const cookieParser = require('cookie-parser');
const axios = require('axios')
const moment = require('moment');
const router = express.Router();
var pathParse = require("path-parse")
var Meta = require('html-metadata-parser');
var getSlug = require('speakingurl');
var randomstring = require("randomstring");
var api_url = 'https://api.breezechain.org';

router.use(cookieParser());
breej.init({ api: 'https://api.breezechain.org', bwGrowth: 36000000000, vpGrowth: 60000000000 })
var msgkey = process.env.msgKey;
var iv = process.env.breezval;
var category = ['News','Cryptocurrency','Food','Sports','Technology','LifeStyle','Health','Gaming','Business','General'];

var cache = (duration) => {
    return (req, res, next) => { let key = '__express__' + req.originalUrl || req.url
        let cachedBody = mcache.get(key)
        if (cachedBody) { res.send(cachedBody)
            return
        } else { res.sendResponse = res.send
            res.send = (body) => {
                mcache.put(key, body, duration * 1000);
                res.sendResponse(body)
            }
            next()
        }
    }
}


const getAccountPub = (username) => { 
    return new Promise((res, rej) => {
        breej.getAccount(username, function (error, account) {
            if(error) rej(error); if(!account) rej(); if(account.pub) res(account.pub);
        })
    })
}
const validateToken = async(username, token) => {if(!username || !token) return false; try { var decrypted = CryptoJS.AES.decrypt(token, msgkey, { iv: iv }); return breej.privToPub(decrypted.toString(CryptoJS.enc.Utf8)) === await getAccountPub(username); }catch(err){return false;} }

router.get('', async (req, res) => {
    res.locals.title='BeSocial - Share To Earn1';
    let postsAPI = await axios.get(api_url+`/new/`);
    let nTags = await fetchTags();
    let promotedAPI = await axios.get(api_url+`/promoted`);
    let promotedData = [];
    let finalData = postsAPI.data;
    if (promotedAPI.data.length > 0) promotedData = promotedAPI.data.slice(0, 3).map(x => ({ ...x, __promoted: true }));
    if (promotedData.length > 0) finalData.splice(1, 0, promotedData[0]); if (promotedData.length > 1) finalData.splice(5, 0, promotedData[1]); if (promotedData.length > 2) finalData.splice(10, 0, promotedData[2]);
    let _finalData = await Promise.all(finalData.map(async (post) => { let userAPI = await axios.get(api_url+`/account/${post.author}`); return { ...post, user: userAPI.data.json } }));
    if (await validateToken(req.cookies.breeze_username, req.cookies.token)) { loguser = req.cookies.breeze_username; let actAPI = await axios.get(api_url+`/account/${loguser}`); let noticeAPI = await axios.get(api_url+`/unreadnotifycount/${loguser}`); res.render('index', { articles: _finalData, moment: moment, trendingTags: nTags, loguser: loguser, acct: actAPI.data, category: category, notices: noticeAPI.data.count}) } else { loguser = ""; res.render('index', { articles: _finalData, moment: moment, trendingTags: nTags, loguser: loguser, category: category, notices:'0' }) }
})

router.get('/profile/:name', async (req, res) => {
    let name = req.params.name; let userAPI = await axios.get(api_url+`/account/${name}`); let nTags = await fetchTags(); let act = userAPI.data; let vp = breej.votingPower(act); let bw = breej.bandwidth(act); let blogAPI = await axios.get(api_url+`/blog/${name}`); let likesAPI = await axios.get(api_url+`/votes/${name}`); 
    if (blogAPI.data.length > 0)
      _finalData = await Promise.all(blogAPI.data.map(async (post) => { let userAPI = await axios.get(api_url+`/account/${post.author}`); return { ...post, user: userAPI.data.json || false } }));
    else _finalData = blogAPI.data
    if (likesAPI.data.length > 0)
      _finalDataL = await Promise.all(likesAPI.data.map(async (post) => { let userLAPI = await axios.get(api_url+`/account/${post.author}`); return { ...post, user: userLAPI.data.json || false } }));
    else _finalDataL = likesAPI.data
    res.locals.title= name.charAt(0).toUpperCase() + name.slice(1) +' Profile - BeSocial';
    if (await validateToken(req.cookies.breeze_username, req.cookies.token)) { loguser = req.cookies.breeze_username; let actAPI = await axios.get(api_url+`/account/${loguser}`);let noticeAPI = await axios.get(api_url+`/unreadnotifycount/${loguser}`); res.render('profile', { user: userAPI.data, articles: _finalData, likes: _finalDataL, moment: moment, bw: bw, vp: vp, loguser: loguser, profName: name, trendingTags: nTags, acct: actAPI.data, category: category, notices: noticeAPI.data.count }) } else { loguser = ""; res.render('profile', { user: userAPI.data, articles: _finalData, likes: _finalDataL, moment: moment, bw: bw, vp: vp, loguser: loguser, profName: name, trendingTags: nTags, category: category }) }
})

router.get('/tags/:tag', async (req, res) => {
    let tag = req.params.tag; let postsAPI = await axios.get(api_url+`/new?tag=${tag}`); let nTags = await fetchTags(); let _finalData = [];
    if (postsAPI.data.length > 0) 
    _finalData = await Promise.all(postsAPI.data.map(async (post) => { let userAPI = await axios.get(api_url+`/account/${post.author}`); return { ...post, user: userAPI.data.json || false } }));
    if (await validateToken(req.cookies.breeze_username, req.cookies.token)) { loguser = req.cookies.breeze_username; let actAPI = await axios.get(api_url+`/account/${loguser}`);let noticeAPI = await axios.get(api_url+`/unreadnotifycount/${loguser}`);  res.render('tags', { articles: _finalData, moment: moment, trendingTags: nTags, calledTag: tag, loguser: loguser, acct: actAPI.data, category: category, notices: noticeAPI.data.count }) } else { loguser = ""; res.render('tags', { articles: _finalData, moment: moment, trendingTags: nTags, calledTag: tag, loguser: loguser, category: category }) }
})

router.get('/category/:catg', async (req, res) => {
    let catg = req.params.catg; res.locals.title = "Latest "+ catg +" updates shared on BeSocial - Share To Earn";let postsAPI = await axios.get(api_url+`/new?category=${catg}`); let nTags = await fetchTags();
    if (postsAPI.data.length > 0) _finalData = await Promise.all(postsAPI.data.map(async (post) => { let userAPI = await axios.get(api_url+`/account/${post.author}`); return { ...post, user: userAPI.data.json || false } })); else _finalData = postsAPI.data
    if (await validateToken(req.cookies.breeze_username, req.cookies.token)) { loguser = req.cookies.breeze_username; let userAPI = await axios.get(api_url+`/account/${loguser}`); let noticeAPI = await axios.get(api_url+`/unreadnotifycount/${loguser}`); res.render('category', { articles: _finalData, moment: moment, trendingTags: nTags, calledCatg: catg, loguser: loguser, acct: userAPI.data, category: category, notices: noticeAPI.data.count }) } else { loguser = ""; res.render('category', { articles: _finalData, moment: moment, trendingTags: nTags, calledCatg: catg, loguser: loguser, category: category }) }
})

router.get('/witnesses', async (req, res, next) => {
    res.locals.title = "Breeze Witnesses";res.locals.page = "witness";
    let nTags = await fetchTags(); let witnessAPI = await axios.get(api_url+`/rank/witnesses`); let approved = [];
    if (await validateToken(req.cookies.breeze_username, req.cookies.token)) { loguser = req.cookies.breeze_username; let userAPI = await axios.get(api_url+`/account/${loguser}`); let noticeAPI = await axios.get(api_url+`/unreadnotifycount/${loguser}`);let act = userAPI.data; let approved = act.approves; res.render('witnesses', { witnesses: witnessAPI.data, approved: approved, trendingTags: nTags, loguser: loguser, acct: userAPI.data, category: category, notices: noticeAPI.data.count }); } else { loguser = ""; res.render('witnesses', { witnesses: witnessAPI.data, approved: approved, trendingTags: nTags, loguser: loguser, category: category }); }
})

router.get('/wallet', async (req, res) => {
    let token = req.cookies.token; let user = req.cookies.breeze_username;
    if (token && await validateToken(req.cookies.breeze_username, token)) { let decrypted = CryptoJS.AES.decrypt(token, msgkey, { iv: iv }); let wifKey = decrypted.toString(CryptoJS.enc.Utf8); let pubKey = breej.privToPub(wifKey);let earnAPI = await axios.get(api_url+`/distributed/${user}/today`); let transferAPI = await axios.get(api_url+`/transfers/${user}`); let userAPI = await axios.get(api_url+`/account/${user}`); let noticeAPI = await axios.get(api_url+`/unreadnotifycount/${user}`);let nTags = await fetchTags(); res.render('wallet', { activities: transferAPI.data, acct: userAPI.data, trendingTags: nTags, loguser: user, earnToday: earnAPI, category: category,wifKey:wifKey,pubKey:pubKey, notices: noticeAPI.data.count }) } else { res.redirect('/welcome'); }
})

router.get('/share', async (req, res) => {
    let token = req.cookies.token;
    if (!token || !await validateToken(req.cookies.breeze_username, req.cookies.token)) { res.redirect('/welcome'); } else { loguser = req.cookies.breeze_username; let actAPI = await axios.get(api_url+`/account/${loguser}`); let noticeAPI = await axios.get(api_url+`/unreadnotifycount/${loguser}`);let nTags = await fetchTags(); res.render('share', { loguser: loguser, trendingTags: nTags, acct: actAPI.data, category: category, notices: noticeAPI.data.count }) }
})

router.get('/rewards', async (req, res) => {
    let nTags = await fetchTags(); let votesAPI = await axios.get(api_url+`/votestoday`);
    if (await validateToken(req.cookies.breeze_username, req.cookies.token)) { loguser = req.cookies.breeze_username; let actAPI = await axios.get(api_url+`/account/${loguser}`);let noticeAPI = await axios.get(api_url+`/unreadnotifycount/${loguser}`); res.render('rewards', { loguser: loguser, trendingTags: nTags, acct: actAPI.data, todayVotes: votesAPI.data, category: category, notices: noticeAPI.data.count }) } else { loguser = ""; res.render('rewards', { loguser: loguser, trendingTags: nTags, todayVotes: votesAPI.data, category: category }) }
})

router.get('/welcome', async (req, res) => {
    let token = req.cookies.token; let user = req.cookies.breeze_username;
    if (token && await validateToken(req.cookies.breeze_username, req.cookies.token)) { res.redirect('/profile/' + user); } else { let ref = ''; let nTags = await fetchTags(); let loguser = ''; res.render('welcome', { ref: ref, user: loguser, loguser: loguser, trendingTags: nTags, category: category }) }
})

router.get('/welcome/:name', async (req, res) => {
    let token = req.cookies.token; let user = req.cookies.breeze_username; if (!token || await validateToken(req.cookies.breeze_username, req.cookies.token)) { let name = req.params.name; let nTags = await fetchTags(); let loguser = ''; res.render('welcome', { ref: name, loguser: loguser, trendingTags: nTags, category: category }) } else { res.redirect('/profile/' + user); }
})

router.get('/trending', async (req, res) => {
    let nTags = await fetchTags(); let timeNow = new Date().getTime(); let postsTime = timeNow - 86400000; let postsAPI = await axios.get(api_url+`/trending?after=${postsTime}`);
    if (postsAPI.data.length > 0) _finalData = await Promise.all(postsAPI.data.map(async (post) => { let userAPI = await axios.get(api_url+`/account/${post.author}`); return { ...post, user: userAPI.data.json || false } }));
    if (await validateToken(req.cookies.breeze_username, req.cookies.token)) { loguser = req.cookies.breeze_username; let actAPI = await axios.get(api_url+`/account/${loguser}`);let noticeAPI = await axios.get(api_url+`/unreadnotifycount/${loguser}`); res.render('trending', { articles: _finalData, moment: moment, trendingTags: nTags, loguser: loguser, acct: actAPI.data, category: category, notices:noticeAPI.data.count}) } else { loguser = ""; res.render('trending', { articles: _finalData, moment: moment, trendingTags: nTags, loguser: loguser, category: category }) }
})

router.get('/post/:name/:link', cache(30), async (req, res) => {let author = req.params.name; let link = req.params.link; let nTags = await fetchTags(); let postAPI = await axios.get(api_url+`/content/${author}/${link}`);
    let post_category = postAPI.data.json.category; let simAPI = await axios.get(api_url+`/new?category=${post_category}`);let userAPI = await axios.get(api_url+`/account/${author}`); let post_title = postAPI.data.json.title; res.locals.title = post_title;let post_body = postAPI.data.json.body; let post_description = post_body.split(" ").splice(0,60).join(" ");  res.locals.description = post_description;let post_link = postAPI.data._id;res.locals.link='https://besocial.ai/post/'+post_link;let post_img = postAPI.data.json.image;res.locals.image=post_img;
    if (await validateToken(req.cookies.breeze_username, req.cookies.token)) { loguser = req.cookies.breeze_username; let actAPI = await axios.get(api_url+`/account/${loguser}`);let noticeAPI = await axios.get(api_url+`/unreadnotifycount/${loguser}`); res.render('post', { article: postAPI.data, simPosts: simAPI.data, moment: moment, trendingTags: nTags, loguser: loguser, acct: actAPI.data, user: userAPI.data, category: category,notices:noticeAPI.count }) } else { loguser = ""; res.render('post', { article: postAPI.data, simPosts: simAPI.data, moment: moment, trendingTags: nTags, loguser: loguser, user: userAPI.data, category: category }) }
})

router.get('/notifications', async (req, res) => {res.locals.page = "notifications";
  const thousandSeperator = (num) => { let num_parts = num.toString().split("."); num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ","); return num_parts.join(".") }
  function aUser(user) { return '<a href="/profile/' + user + '">@' + user + '</a>'}
  function aContent(content) {return '<a href="/post/' + content + '">@' + content + '</a>'}

  function data_process(temp) {
    result = '<span style="font-weight: 600;font-size: 14px;">'+moment.utc(temp.ts).fromNow()+'</span>' + '<img src="https://img.icons8.com/ios-filled/20/000000/thick-vertical-line.png" style="vertical-align: middle;">' + aUser(temp.sender);
    switch (temp.type) {
      case 0:
        return result + ' created new account ' + aUser(temp.data.name)
      case 1:
        return result + ' approved witness ' + aUser(temp.data.target)
      case 2:
        return result + ' disapproved witness ' + aUser(temp.data.target)
      case 3:
        result = result + ' transferred ' + thousandSeperator(temp.data.amount / 1000000) + ' Breeze to ' + aUser(temp.data.receiver)
        if (temp.data.memo)
          result += ', memo: ' + temp.data.memo
        return result
      case 4:
        return result + ' shared new post ' + aContent(temp.sender + '/' + temp.data.link)
      case 5:
        return result + ' upvoted ' + aContent(temp.data.author + '/' + temp.data.link)
      case 6:
        return result + ' update profile'
      case 7:
        return result + ' subscribed to ' + aUser(temp.data.target)
      case 8:
        return result + ' unsubscribed to ' + aUser(temp.data.target)
      case 10:
        return result + ' created a custom key with id ' + temp.data.id
      case 11:
        return result + ' removed a custom key with id ' + temp.data.id
      case 12:
        return result + ' changed the master key'
      case 13:
        if (temp.data.pa && temp.data.pp)
          result += ' commented on ' + aContent(temp.data.pa + '/' + temp.data.pp)
        else
          result += ' posted a new video ' + aContent(temp.sender + '/' + temp.data.link)
        result += ' and burnt ' + (temp.data.burn / 1000000) + ' Breeze '
        return result
      case 14:
        return result + ' transferred ' + thousandSeperator(temp.data.amount) + ' VP to ' + aUser(temp.data.receiver)
      case 15:
        return result + ' transferred ' + thousandSeperator(temp.data.amount) + ' bytes to ' + aUser(temp.data.receiver)
      case 16:
        return result + ' set a limit on account voting power to ' + temp.data.amount + ' VP'
      case 17:
        return result + ' claimed curation rewards on ' + aContent(temp.data.author + '/' + temp.data.link)
      case 18:
        return result + ' updated leader key for block production'
      case 19:
        if (temp.data.vt > 0)
          result += ' upvoted '
        else
          result += ' downvoted '
        result += aContent(temp.data.author + '/' + temp.data.link) + ' with ' + thousandSeperator(temp.data.vt) + ' VP'
        if (temp.data.tag)
          result += ' and tagged it with ' + temp.data.tag
        result += ' (' + temp.data.tip + '% author tip)'
        return result
      case 20:
        return result + ' created a custom key with id ' + temp.data.id + ' and weight ' + temp.data.weight
      case 21:
        return result + ' set signature thresholds'
      case 22:
        return result + ' set master key weight to ' + temp.data.weight
      case 26:
        return result + ' subscribed to category ' + '<a href="/category/'+(temp.data.category).toLowerCase()+'">'+temp.data.category+'</a>'
      default:
        return 'Unknown transaction type ' + temp.type
    }
  }
  let token = req.cookies.token; let user = req.cookies.breeze_username;let send_data = [];
  if (token) { let noticeAPI = await axios.get(api_url+`/unreadnotifycount/${user}`);let historyAPI = await axios.get(api_url+`/history/${user}/0`);let actAPI = await axios.get(api_url+`/account/${user}`); let nTags = await fetchTags(); let temps = historyAPI.data;
    temps.forEach(function (temp) { send_data.push(data_process(temp.txs[0])+ " " + "<a href='https://explorer.dlkweb.ml/#/tx/"+ temp.txs[0].hash +"' target='_blank'><span class='trx_id'>" + temp.txs[0].hash.substring(0,6) + "</span></a>"); });
    res.render('notifications', { activities: send_data, acct: actAPI.data, trendingTags: nTags, loguser: user, category: category, notices:noticeAPI.data.count })
  } else { res.redirect('/welcome');}
})

router.get('/lpmining', async (req, res, next) => {res.locals.page = "mining"; let nTags = await fetchTags();
  if (await validateToken(req.cookies.breeze_username, req.cookies.token)) { loguser = req.cookies.breeze_username; let userAPI = await axios.get(api_url+`/account/${loguser}`); let noticeAPI = await axios.get(api_url+`/unreadnotifycount/${loguser}`); let act = userAPI.data; res.render('lpmining', { trendingTags: nTags, loguser: loguser, acct: userAPI.data, category: category, notices: noticeAPI.data.count }); } else { loguser = ""; res.render('lpmining', { trendingTags: nTags, loguser: loguser, category: category }); }
})

router.get('/staking', async (req, res, next) => { res.locals.title = "BeSocial Staking - Top DeFi Project"; res.locals.page = "staking"; let nTags = await fetchTags();
  if (await validateToken(req.cookies.breeze_username, req.cookies.token)) { loguser = req.cookies.breeze_username; let userAPI = await axios.get(api_url+`/account/${loguser}`); let noticeAPI = await axios.get(api_url+`/unreadnotifycount/${loguser}`); let act = userAPI.data; res.render('staking', { trendingTags: nTags, loguser: loguser, acct: userAPI.data, category: category, notices: noticeAPI.data.count }); } else { loguser = ""; res.render('staking', { trendingTags: nTags, loguser: loguser, category: category }); }
})

router.get('/explore', async (req, res, next) => {res.locals.page = "explore";
  let nTags = await fetchTags();let nTagsAll = await fetchTags(10);
  if (await validateToken(req.cookies.breeze_username, req.cookies.token)) { loguser = req.cookies.breeze_username; let noticeAPI = await axios.get(api_url+`/unreadnotifycount/${loguser}`);let userAPI = await axios.get(api_url+`/account/${loguser}`); let act = userAPI.data; res.render('explore', { trendingTags: nTags, loguser: loguser, acct: userAPI.data, category: category,trendingTagsAll: nTagsAll, kind: '', notices:noticeAPI.data.count }); } else { loguser = ""; res.render('explore', { trendingTags: nTags, loguser: loguser, category: category,trendingTagsAll: nTagsAll, kind: '', notices: '0' }); }
})

router.get('/explore/:kind', async (req, res, next) => {res.locals.page = "explore"; let kind = req.params.kind; let nTagsAll = await fetchTags(10); let nTags = nTagsAll.slice(0, 6);
  if (await validateToken(req.cookies.breeze_username, req.cookies.token)) {  loguser = req.cookies.breeze_username;  let userAPI = await axios.get(api_url+`/account/${loguser}`); let noticeAPI = await axios.get(api_url+`/unreadnotifycount/${loguser}`); let act = userAPI.data; 
    res.render('explore', { trendingTags: nTags, trendingTagsAll: nTagsAll, loguser: loguser, acct: userAPI.data, kind: kind, category: category, notices: noticeAPI.data.count }); 
  } else {loguser = ""; res.render('explore', {trendingTagsAll: nTagsAll, trendingTags: nTags, loguser: loguser, kind: kind,category: category, notices: '0'}); }
})

router.get('/feed', async (req, res, next) => {
  if (await validateToken(req.cookies.breeze_username, req.cookies.token)) { loguser = req.cookies.breeze_username;
    let noticeAPI = await axios.get(api_url+`/unreadnotifycount/${loguser}`); let postsAPI = await axios.get(api_url+`/categoryfeed/${loguser}`);let userAPI = await axios.get(api_url+`/account/${loguser}`); let act = userAPI.data; let nTags = await fetchTags(); let promotedAPI = await axios.get(api_url+`/promoted`); let promotedData = []; let finalData = postsAPI.data;
    if (promotedAPI.data.length > 0) promotedData = promotedAPI.data.slice(0, 3).map(x => ({ ...x, __promoted: true }));
    if (promotedData.length > 0) finalData.splice(1, 0, promotedData[0]); if (promotedData.length > 1) finalData.splice(5, 0, promotedData[1]); if (promotedData.length > 2) finalData.splice(10, 0, promotedData[2]);
    let _finalData = await Promise.all(finalData.map(async (post) => { let userAPI = await axios.get(api_url+`/account/${post.author}`); return { ...post, user: userAPI.data.json } }));
    res.render('feed', {  articles: postsAPI.data, moment: moment, trendingTags: nTags, loguser: loguser, acct: userAPI.data, category: category, notices: noticeAPI.data.count }); 
  } else { res.redirect('/'); }
})

router.post('/loginuser', function (req, res) {
  var user = req.body;
  var key = user.pivkey;
  var username = user.username;
  breej.getAccount(username, function (error, account) {
    if (account.error) {res.send({ error: true, message: 'Not a valid user' });return false}
    try { pubKey = breej.privToPub(key) } catch (e) { res.send({ error: true, message: 'Password (privkey) seems incorrect' }); return }
    if (account.pub !== pubKey) {res.send({ error: true, message: 'Password (privkey) validation fails' });}else{
      var encrypted = CryptoJS.AES.encrypt(key, msgkey, { iv: iv }); var token = encrypted.toString();
      res.cookie('breeze_username', username, { expires: new Date(Date.now() + 86400000000), httpOnly: false }); 
      res.cookie('token', token, { expires: new Date(Date.now() + 86400000000), httpOnly: true }); 
      res.send({ error: false });
    }
  })
});


router.post('/post', function (req, res) {
  let post = req.body;
  var permlink = getSlug(post.title);
  let token = req.cookies.token;
  let author = req.cookies.breeze_username;
  //let link = randomstring.generate({ length: 11, capitalization: 'lowercase'});
  let content = { title: post.title, body: post.description, category: post.category, url: post.exturl, image: post.image, tags: post.tags };
  let newTx = { type: 4, data: { link: permlink, json: content } }
  let decrypted = CryptoJS.AES.decrypt(token, msgkey, { iv: iv });
  let wifKey = decrypted.toString(CryptoJS.enc.Utf8)
  breej.getAccount(author, function (error, account) {
    if (breej.privToPub(wifKey) !== account.pub) {
      res.send({ error: true })
    } else {
      newTx = breej.sign(wifKey, author, newTx)
      breej.sendTransaction(newTx, function (err, response) {//console.log(err,response)
        if (err === null) { res.send({ error: false }); } else { res.send({ error: true, message: err['error'] }); }
      })
    }
  })
});

router.post('/share', function (req, res) { var post = req.body; var sharedUrl = post.url; Meta.parser(sharedUrl, function (err, result) { let meta = result['og']; res.send(meta); }) });
router.post('/logout', function (req, res) { res.clearCookie('breeze_username'); res.clearCookie('token'); res.send({ error: false }); });

router.post('/upvote', function (req, res) {
  let post = req.body; let token = req.cookies.token; let voter = req.cookies.breeze_username;
  let newTx = { type: 5, data: { link: post.postLink, author: post.author } };
  let decrypted = CryptoJS.AES.decrypt(token, msgkey, { iv: iv });
  let wifKey = decrypted.toString(CryptoJS.enc.Utf8)
  let pubKey = breej.privToPub(wifKey);
  breej.getAccount(voter, function (error, account) {
    if (pubKey !== account.pub) { res.send({ error: true }) } else {
      newTx = breej.sign(wifKey, voter, newTx);
      breej.sendTransaction(newTx, function (err, response) {//console.log(err,response)
        if (err === null) { res.send({ error: false }); } else { res.send({ error: true, message: err['error'] }); }
      })
    }
  })
});

router.post('/witup', function (req, res) {
  let post = req.body; let token = req.cookies.token; let voter = req.cookies.breeze_username;
  let newTx = { type: 1, data: { target: post.nodeName } }; let decrypted = CryptoJS.AES.decrypt(token, msgkey, { iv: iv }); let wifKey = decrypted.toString(CryptoJS.enc.Utf8); let pubKey = breej.privToPub(wifKey);
  breej.getAccount(voter, function (error, account) {
    if (pubKey !== account.pub) { res.send({ error: true }) } else {
      newTx = breej.sign(wifKey, voter, newTx)
      breej.sendTransaction(newTx, function (err, response) { if (err === null) { res.send({ error: false }); } else { res.send({ error: true, message: err['error'] }); } })
    }
  })
});


router.post('/witunup', function (req, res) {
  let post = req.body; let token = req.cookies.token; let voter = req.cookies.breeze_username;
  let newTx = { type: 2, data: { target: post.nodeName } };
  let decrypted = CryptoJS.AES.decrypt(token, msgkey, { iv: iv }); let wifKey = decrypted.toString(CryptoJS.enc.Utf8); let pubKey = breej.privToPub(wifKey);
  breej.getAccount(voter, function (error, account) {
    if (pubKey !== account.pub) { res.send({ error: true }) } else {
      newTx = breej.sign(wifKey, voter, newTx)
      breej.sendTransaction(newTx, function (err, response) {
        if (err === null) { res.send({ error: false }); } else { res.send({ error: true, message: err['error'] }); }
      })
    }
  })
});

router.post('/notify', function (req, res) {
  let token = req.cookies.token; let loguser = req.cookies.breeze_username;let timestamp = new Date().getTime();
  let newTx = { type: 28, data: {} };
  let decrypted = CryptoJS.AES.decrypt(token, msgkey, { iv: iv }); let wifKey = decrypted.toString(CryptoJS.enc.Utf8); let pubKey = breej.privToPub(wifKey);
  breej.getAccount(loguser, function (error, account) {
    if (pubKey !== account.pub) { res.send({ error: true }) } else {
      newTx = breej.sign(wifKey, loguser, newTx)
      breej.sendTransaction(newTx, function (err, response) {
        if (err === null) { res.send({ error: false }); } else { res.send({ error: true, message: err['error'] }); }
      })
    }
  })
});

router.post('/follow', function (req, res) {
  let post = req.body; let token = req.cookies.token; let loguser = req.cookies.breeze_username;
  let newTx = { type: 7, data: { target: post.followName } };
  let decrypted = CryptoJS.AES.decrypt(token, msgkey, { iv: iv }); let wifKey = decrypted.toString(CryptoJS.enc.Utf8); let pubKey = breej.privToPub(wifKey);
  breej.getAccount(loguser, function (error, account) {
    if (pubKey !== account.pub) { res.send({ error: true }) } else {
      newTx = breej.sign(wifKey, loguser, newTx)
      breej.sendTransaction(newTx, function (err, response) {
        if (err === null) { res.send({ error: false }); } else { res.send({ error: true, message: err['error'] }); }
      })
    }
  })
});


router.post('/unfollow', function (req, res) {
  let post = req.body; let token = req.cookies.token; let loguser = req.cookies.breeze_username;
  let newTx = { type: 8, data: { target: post.unfollowName } };
  let decrypted = CryptoJS.AES.decrypt(token, msgkey, { iv: iv }); let wifKey = decrypted.toString(CryptoJS.enc.Utf8); let pubKey = breej.privToPub(wifKey);
  breej.getAccount(loguser, function (error, account) {
    if (pubKey !== account.pub) { res.send({ error: true }) } else {
      newTx = breej.sign(wifKey, loguser, newTx)
      breej.sendTransaction(newTx, function (err, response) {
        if (err === null) { res.send({ error: false }); } else { res.send({ error: true, message: err['error'] }); }
      })
    }
  })
});

router.post('/followCatg', function (req, res) {
  let post = req.body; let token = req.cookies.token; let loguser = req.cookies.breeze_username;
  let newTx = { type: 26, data: { category: post.catgName } };
  let decrypted = CryptoJS.AES.decrypt(token, msgkey, { iv: iv }); let wifKey = decrypted.toString(CryptoJS.enc.Utf8); let pubKey = breej.privToPub(wifKey);
  breej.getAccount(loguser, function (error, account) {
    if (pubKey !== account.pub) { res.send({ error: true }) } else {
      newTx = breej.sign(wifKey, loguser, newTx)
      breej.sendTransaction(newTx, function (err, response) {
        if (err === null) { res.send({ error: false }); } else { res.send({ error: true, message: err['error'] }); }
      })
    }
  })
});


router.post('/pupdate', function (req, res) {
  let post = req.body; let token = req.cookies.token; let loguser = req.cookies.breeze_username;
  let content = { about: post.acc_about, website: post.acc_website, location: post.acc_location, cover_image: post.acc_cover_img, avatar: post.acc_img };
  let newTx = { type: 6, data: { json: { profile: content } } };
  let decrypted = CryptoJS.AES.decrypt(token, msgkey, { iv: iv }); let wifKey = decrypted.toString(CryptoJS.enc.Utf8); let pubKey = breej.privToPub(wifKey);
  breej.getAccount(loguser, function (error, account) {
    if (pubKey !== account.pub) { res.send({ error: true }) } else {
      newTx = breej.sign(wifKey, loguser, newTx)
      breej.sendTransaction(newTx, function (err, response) {
        if (err === null) { res.send({ error: false }); } else { res.send({ error: true, message: err['error'] }); }
      })
    }
  })
});

router.post('/signup', function (req, res) {let post = req.body; 
  let allowed_name=/^[0-9a-z]+$/; if(!post.name.match(allowed_name)){res.send({error: true, message: 'Only alphanumeric usernames allowed (all lowercase)'});return false;};
  if(post.name.length<5){res.send({error: true, message: 'Username length should not be less than 5'});return false;};
  breej.getAccounts([post.name], function(error, accounts) {
    if (!accounts || accounts.length === 0) {let keys=breej.keypair(); let pub=keys.pub;let priv=keys.priv;
      let newTx = { type: 0, data: { name: post.name, pub: pub, ref: post.ref } }; let privAc = process.env.privKey; let signedTx = breej.sign(privAc, 'breeze', newTx)
      breej.sendTransaction(signedTx, (error, result) => {
        if (error === null) {
          res.send({ error: false, priv: priv});
          let newVTx = { type: 14, data: { receiver: post.name, amount: parseInt(90) } };
          let signedVTx = breej.sign(privAc, 'breeze', newVTx);
          breej.sendTransaction(signedVTx, (error, result) => { })
          let newBTx = { type: 15, data: { receiver: post.name, amount: parseInt(1500) } };
          let signedBTx = breej.sign(privAc, 'breeze', newBTx);
          breej.sendTransaction(signedBTx, (error, result) => { })
        } else { res.send({ error: true, message: error['error'] }); }
      })
    } else {res.send({ error: true, message: 'phew.. Username already exist'});}
  })
});

router.post('/keys', async (req, res, next) => {
  if (await validateToken(req.cookies.breeze_username, req.cookies.token)) 
    { let token = req.cookies.token; let loguser = req.cookies.breeze_username; let decrypted = CryptoJS.AES.decrypt(token, msgkey, { iv: iv }); let wifKey = decrypted.toString(CryptoJS.enc.Utf8); let pubKey = breej.privToPub(wifKey);
      console.log(wifKey)
      let keys=breej.keypair(); let pub=keys.pub;let priv=keys.priv;
      console.log(pub);console.log(priv);
      let newTx = { type: 12, data: {pub: keys.pub } }; 
      let signedTx = breej.sign(wifKey, loguser, newTx)
      breej.sendTransaction(signedTx, (error, result) => {
        if (error === null) {
          res.send({ error: false, priv: priv, pub:pub});
          console.log(result)
        } else { res.send({ error: true, message: error['error']}); }
      })
      //res.render('rewards', { loguser: loguser, trendingTags: nTags, acct: actAPI.data, todayVotes: votesAPI.data, category: category, notices: noticeAPI.data.count }) 
    } else { console.log('user not login')
      res.send({ error: true, message: 'Login user not found' }); 
    }

})
router.post('/transfer', function (req, res) {
  let post = req.body; let token = req.cookies.token; let sender = req.cookies.breeze_username;
  let decrypted = CryptoJS.AES.decrypt(token, msgkey, { iv: iv }); let wifKey = decrypted.toString(CryptoJS.enc.Utf8); let pubKey = breej.privToPub(wifKey);

  breej.getAccount(post.rec_user, function (error, account) {
    if (!account) {
      res.send({ error: true, message: 'Not a valid receiver' });
    } else if (sender == post.rec_user) {
      res.send({ error: true, message: 'can not transfer to yourself' });
    } else {
      breej.getAccount(sender, function (error, account) {
        if (pubKey !== account.pub) {
          res.send({ error: true, message: 'Unable to validate user' });
        } else if (post.trans_amount > (account.balance) / 1000000) {
          res.send({ error: true, message: 'Not enough balance' });
        } else {
          let amount = parseInt((post.trans_amount) * 1000000);
          let newTx = { type: 3, data: { receiver: post.rec_user, amount: amount, memo: post.memo } };
          let signedTx = breej.sign(wifKey, sender, newTx);
          breej.sendTransaction(signedTx, (error, result) => { if (error === null) { res.send({ error: false }); } else { res.send({ error: true, message: error['error'] }); } })
        }
      });
    }
  });
});


router.post('/boost', function (req, res) {
  let post = req.body; let token = req.cookies.token; let sender = req.cookies.breeze_username;
  let decrypted = CryptoJS.AES.decrypt(token, msgkey, { iv: iv }); let wifKey = decrypted.toString(CryptoJS.enc.Utf8); let pubKey = breej.privToPub(wifKey);
  let boostUrl = pathParse(post.boost_url); let boostLink = boostUrl.base
  breej.getAccount(sender, function (error, account) {
    if (pubKey !== account.pub) {res.send({ error: true, message: 'Unable to validate user' });
    } else { let amount = parseInt((post.boost_amount) * 1000000);
      let newTx = { type: 13, data: { link: boostLink, burn: amount } };
      let signedTx = breej.sign(wifKey, sender, newTx);
      breej.sendTransaction(signedTx, (error, result) => { if (error === null) { res.send({ error: false }); } else { res.send({ error: true, message: error['error'] }); } })
    }
  });
});

router.post('/withdraw', function (req, res) {
  let post = req.body; let token = req.cookies.token; let sender = req.cookies.breeze_username;
  let decrypted = CryptoJS.AES.decrypt(token, msgkey, { iv: iv }); let wifKey = decrypted.toString(CryptoJS.enc.Utf8); let pubKey = breej.privToPub(wifKey);

  breej.getAccount(sender, function (error, account) {
    if (pubKey !== account.pub) {
      res.send({ error: true, message: 'Unable to validate user' });
    } else {
      let amount = parseInt((post.wid_amount) * 1000000);
      let newTx = { type: 23, data: { destaddr: post.wid_addr, network: 'BSC', amount: amount } };
      let signedTx = breej.sign(wifKey, sender, newTx);
      breej.sendTransaction(signedTx, (error, result) => { if (error === null) { res.send({ error: false }); } else { res.send({ error: true, message: error['error'] }); } })
    }
  });
});

const fetchTags = async (maxTags) => { if(!maxTags) maxTags = 6; let timeNow = new Date().getTime(); let postsTime = timeNow - 86400000; let tagsAPI = await axios.get(api_url+`/trending?after=${postsTime}&limit=100`); let posts = tagsAPI.data; let tags = {};
  for (let p in posts) if (posts[p].json && posts[p].json.tags) { let postTags = posts[p].json.tags;for (let t in postTags) if (!tags[postTags[t]]) { tags[postTags[t]] = 1 } else { tags[postTags[t]] += 1 }}; let tagArr = [];
  for (let t in tags) tagArr.push({ m: t, v: tags[t] }); tagsArr = tagArr.sort((a, b) => b.v - a.v); tagsArr = tagsArr.slice(0, maxTags); return tagsArr
}

router.get('/robots.txt', function (req, res) { res.type('text/plain'); res.send("User-agent: *\nDisallow:"); });

router.use(async (req, res) => { let nTags = await fetchTags(); if (await validateToken(req.cookies.breeze_username, req.cookies.token)) { loguser = req.cookies.breeze_username; let userAPI = await axios.get(api_url+`/account/${loguser}`); let noticeAPI = await axios.get(api_url+`/unreadnotifycount/${loguser}`); let act = userAPI.data; res.status(404).render('common/404', { trendingTags: nTags, loguser: loguser, acct: userAPI.data, category: category, notices: noticeAPI.data.count }); } else { loguser = ""; res.status(404).render('common/404', { trendingTags: nTags, loguser: loguser, category: category }); } });

module.exports = router;