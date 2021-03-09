const $ = new Env('网易云音乐')
$.VAL_session = ('{"url":"https://music.163.com/weapi/user/level","body":"params=TwPcifBjvqAS%2FiMQ0GiRnn9WRwLLLrTyqg3s4%2F%2BxGxCO%2FN%2FqmpE1jxC2D1sRUBBleHPoO3boyp7nN7UNc4Q%2Bxn9P7umsworfhM8N8j7P5v%2B6Bp6E2B1pm5XlemLuKM%2B4&encSecKey=289dc52f84932e766cc3b1e9dad85775ee85633db326e727c2aa2b5cdfd1fee944a162f2cc476777b0206e887edaa8c3a8a1658bab3b1cc91eea5eb279607b2d6b9857436c7f4716cd626800905f46f3bef85d826d6768617b4a118c5eb5c375c5c783347db4f77c76deaeae3727a7df0197ae08153abfa59e9a34b8e7fbdaf7","headers":{"Cookie":"__csrf=ecd0f68ccf6e262f728784439d060109; appver=6.0.0; deviceId=ca60678ed0f1beb110057e08eca41377; machineid=iPhone10.1; os=iPhone OS; osver=13.7; JSESSIONID-WYYY=sy8T0%2BQpTBc0DFkBhfm3fT%2BsmYJo9PQBTYRiH1pnoBdIbcAqhSWIjkyS%5C%5CIVxS377fAWBwKpfxHoDRWhHu2AmmKfMM0SbGE%2FgQa0O57pGQUBY3q1rn%2F2%2FEEd94UCkw16yWgTWhHOwiWCvbeVyboVB7KTvU3kwv6smjVmGSzHg7VFFpl6%3A1603778222680; _iuqxldmzr_=33; NMTID=00OPJJZ0oyo-ChgKEbItwrQ7AnHrCsAAAF1aIGzkw; _ntes_nnid=b26f16d86e481e535e2fca9f34a70abf,1600539736269; _ntes_nuid=b26f16d86e481e535e2fca9f34a70abf; MUSIC_U=e00dbcb91dfcc583179fd99cd5d09e6896a0b314df4e7d0954999f17829263f133a649814e309366","Content-Type":"application/x-www-form-urlencoded","Origin":"https://music.163.com","Accept":"*/*","Referer":"https://music.163.com/store/m/gain/mylevel","Connection":"keep-alive","Host":"music.163.com","Accept-Language":"zh-cn","User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 NeteaseMusic/6.0.0","Accept-Encoding":"gzip, deflate, br"}}')
$.CFG_retryCnt = ($.getdata('CFG_neteasemusic_retryCnt') || '10') * 1
$.CFG_retryInterval = ($.getdata('CFG_neteasemusic_retryInterval') || '500') * 1

!(async () => {
  $.log('', `🔔 ${$.name}, 开始!`, '')
  init()
  await signweb()
  await signapp()
  await getInfo()
  await showmsg()
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.msg($.name, $.subt, $.desc), $.log('', `🔔 ${$.name}, 结束!`, ''), $.done()
  })

function init() {
  $.isNewCookie = /https:\/\/music.163.com\/weapi\/user\/level/.test($.VAL_session)
  $.Cookie = $.isNewCookie ? JSON.parse($.VAL_session).headers.Cookie : $.VAL_session
}

async function signweb() {
  for (let signIdx = 0; signIdx < $.CFG_retryCnt; signIdx++) {
    await new Promise((resove) => {
      const url = { url: `http://music.163.com/api/point/dailyTask?type=1`, headers: {} }
      url.headers['Cookie'] = $.Cookie
      url.headers['Host'] = 'music.163.com'
      url.headers['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15'
      $.get(url, (error, response, data) => {
        try {
          $.isWebSuc = JSON.parse(data).code === -2
          $.log(`[Web] 第 ${signIdx + 1} 次: ${data}`)
        } catch (e) {
          $.isWebSuc = false
          $.log(`❗️ ${$.name}, 执行失败!`, ` error = ${error || e}`, `response = ${JSON.stringify(response)}`, '')
        } finally {
          resove()
        }
      })
    })
    await new Promise($.wait($.CFG_retryInterval))
    if ($.isWebSuc) break
  }
}

async function signapp() {
  for (let signIdx = 0; signIdx < $.CFG_retryCnt; signIdx++) {
    await new Promise((resove) => {
      const url = { url: `http://music.163.com/api/point/dailyTask?type=0`, headers: {} }
      url.headers['Cookie'] = $.Cookie
      url.headers['Host'] = 'music.163.com'
      url.headers['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1'
      $.get(url, (error, response, data) => {
        try {
          $.isAppSuc = JSON.parse(data).code === -2
          $.log(`[App] 第 ${signIdx + 1} 次: ${data}`)
        } catch (e) {
          $.isAppSuc = false
          $.log(`❗️ ${$.name}, 执行失败!`, ` error = ${error || e}`, `response = ${JSON.stringify(response)}`, '')
        } finally {
          resove()
        }
      })
    })
    await new Promise($.wait($.CFG_retryInterval))
    if ($.isAppSuc) break
  }
}

function getInfo() {
  if (!$.isNewCookie) return
  return new Promise((resove) => {
    $.post(JSON.parse($.VAL_session), (error, response, data) => {
      try {
        $.userInfo = JSON.parse(data)
      } catch (e) {
        $.log(`❗️ ${$.name}, 执行失败!`, ` error = ${error || e}`, `response = ${JSON.stringify(response)}`, '')
      } finally {
        resove()
      }
    })
  })
}

function showmsg() {
  return new Promise((resove) => {
    $.subt = $.isWebSuc ? 'PC: 成功' : 'PC: 失败'
    $.subt += $.isAppSuc ? ', APP: 成功' : ', APP: 失败'
    if ($.isNewCookie && $.userInfo) {
      $.desc = `等级: ${$.userInfo.data.level}, 听歌: ${$.userInfo.data.nowPlayCount} => ${$.userInfo.data.nextPlayCount} 升级 (首)`
      $.desc = $.userInfo.data.level === 10 ? `等级: ${$.userInfo.data.level}, 你的等级已爆表!` : $.desc
    }
    resove()
  })
}

// prettier-ignore
function Env(s){this.name=s,this.data=null,this.logs=[],this.isSurge=(()=>"undefined"!=typeof $httpClient),this.isQuanX=(()=>"undefined"!=typeof $task),this.isNode=(()=>"undefined"!=typeof module&&!!module.exports),this.log=((...s)=>{this.logs=[...this.logs,...s],s?console.log(s.join("\n")):console.log(this.logs.join("\n"))}),this.msg=((s=this.name,t="",i="")=>{this.isSurge()&&$notification.post(s,t,i),this.isQuanX()&&$notify(s,t,i);const e=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];s&&e.push(s),t&&e.push(t),i&&e.push(i),console.log(e.join("\n"))}),this.getdata=(s=>{if(this.isSurge())return $persistentStore.read(s);if(this.isQuanX())return $prefs.valueForKey(s);if(this.isNode()){const t="box.dat";return this.fs=this.fs?this.fs:require("fs"),this.fs.existsSync(t)?(this.data=JSON.parse(this.fs.readFileSync(t)),this.data[s]):null}}),this.setdata=((s,t)=>{if(this.isSurge())return $persistentStore.write(s,t);if(this.isQuanX())return $prefs.setValueForKey(s,t);if(this.isNode()){const i="box.dat";return this.fs=this.fs?this.fs:require("fs"),!!this.fs.existsSync(i)&&(this.data=JSON.parse(this.fs.readFileSync(i)),this.data[t]=s,this.fs.writeFileSync(i,JSON.stringify(this.data)),!0)}}),this.wait=((s,t=s)=>i=>setTimeout(()=>i(),Math.floor(Math.random()*(t-s+1)+s))),this.get=((s,t)=>this.send(s,"GET",t)),this.post=((s,t)=>this.send(s,"POST",t)),this.send=((s,t,i)=>{if(this.isSurge()){const e="POST"==t?$httpClient.post:$httpClient.get;e(s,(s,t,e)=>{t&&(t.body=e,t.statusCode=t.status),i(s,t,e)})}this.isQuanX()&&(s.method=t,$task.fetch(s).then(s=>{s.status=s.statusCode,i(null,s,s.body)},s=>i(s.error,s,s))),this.isNode()&&(this.request=this.request?this.request:require("request"),s.method=t,s.gzip=!0,this.request(s,(s,t,e)=>{t&&(t.status=t.statusCode),i(null,t,e)}))}),this.done=((s={})=>this.isNode()?null:$done(s))}
