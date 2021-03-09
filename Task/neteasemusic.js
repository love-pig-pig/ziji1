const cookieName = '网易云音乐'
const cookieKey = '{"url":"https://music.163.com/weapi/user/level","body":"params=TwPcifBjvqAS%2FiMQ0GiRnn9WRwLLLrTyqg3s4%2F%2BxGxCO%2FN%2FqmpE1jxC2D1sRUBBleHPoO3boyp7nN7UNc4Q%2Bxn9P7umsworfhM8N8j7P5v%2B6Bp6E2B1pm5XlemLuKM%2B4&encSecKey=289dc52f84932e766cc3b1e9dad85775ee85633db326e727c2aa2b5cdfd1fee944a162f2cc476777b0206e887edaa8c3a8a1658bab3b1cc91eea5eb279607b2d6b9857436c7f4716cd626800905f46f3bef85d826d6768617b4a118c5eb5c375c5c783347db4f77c76deaeae3727a7df0197ae08153abfa59e9a34b8e7fbdaf7","headers":{"Cookie":"__csrf=ecd0f68ccf6e262f728784439d060109; appver=6.0.0; deviceId=ca60678ed0f1beb110057e08eca41377; machineid=iPhone10.1; os=iPhone OS; osver=13.7; JSESSIONID-WYYY=sy8T0%2BQpTBc0DFkBhfm3fT%2BsmYJo9PQBTYRiH1pnoBdIbcAqhSWIjkyS%5C%5CIVxS377fAWBwKpfxHoDRWhHu2AmmKfMM0SbGE%2FgQa0O57pGQUBY3q1rn%2F2%2FEEd94UCkw16yWgTWhHOwiWCvbeVyboVB7KTvU3kwv6smjVmGSzHg7VFFpl6%3A1603778222680; _iuqxldmzr_=33; NMTID=00OPJJZ0oyo-ChgKEbItwrQ7AnHrCsAAAF1aIGzkw; _ntes_nnid=b26f16d86e481e535e2fca9f34a70abf,1600539736269; _ntes_nuid=b26f16d86e481e535e2fca9f34a70abf; MUSIC_U=e00dbcb91dfcc583179fd99cd5d09e6896a0b314df4e7d0954999f17829263f133a649814e309366","Content-Type":"application/x-www-form-urlencoded","Origin":"https://music.163.com","Accept":"*/*","Referer":"https://music.163.com/store/m/gain/mylevel","Connection":"keep-alive","Host":"music.163.com","Accept-Language":"zh-cn","User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 NeteaseMusic/6.0.0","Accept-Encoding":"gzip, deflate, br"}}'
const cookieVal = $persistentStore.read(cookieKey)

const pc = `http://music.163.com/api/point/dailyTask?type=1`
const mobile = `http://music.163.com/api/point/dailyTask?type=0`

function sign() {
  let url = {
    url: null,
    headers: {
      Cookie: cookieVal
    }
  }

  let signinfo = {}

  url.url = pc
  $httpClient.post(url, (error, response, data) => {
    let result = JSON.parse(data)
    signinfo.pc = {
      title: `网易云音乐(PC)`,
      success: result.code == 200 || result.code == -2 ? true : false,
      skiped: result.code == -2 ? true : false,
      resultCode: result.code,
      resultMsg: result.msg
    }
    console.log(`开始签到: ${signinfo.pc.title}, 编码: ${result.code}, 原因: ${result.msg}`)
  })

  url.url = mobile
  $httpClient.post(url, (error, response, data) => {
    let result = JSON.parse(data)
    signinfo.app = {
      title: `网易云音乐(APP)`,
      success: result.code == 200 || result.code == -2 ? true : false,
      skiped: result.code == -2 ? true : false,
      resultCode: result.code,
      resultMsg: result.msg
    }
    console.log(`开始签到: ${signinfo.app.title}, 编码: ${result.code}, 原因: ${result.msg}`)
  })
  check(signinfo)
}

function check(signinfo, checkms = 0) {
  if (signinfo.pc && signinfo.app) {
    log(signinfo)
    $done({})
  } else {
    if (checkms > 5000) {
      $done({})
    } else {
      setTimeout(() => check(signinfo, checkms + 100), 100)
    }
  }
}

function log(signinfo) {
  let title = `${cookieName}`
  let subTitle = ``
  let detail = `今日共签: ${signinfo.signedCnt}, 本次成功: ${signinfo.successCnt}, 本次失败: ${signinfo.failedCnt}`

  if (signinfo.pc.success && signinfo.app.success) {
    subTitle = `签到结果: 全部成功`
    detail = `PC: ${signinfo.pc.success ? '成功' : '失败'}, APP: ${signinfo.app.success ? '成功' : '失败'}`
  } else if (!signinfo.pc.success && !signinfo.app.success) {
    subTitle = `签到结果: 全部失败`
    detail = `PC: ${signinfo.pc.success ? '成功' : '失败'}, APP: ${signinfo.app.success ? '成功' : '失败'}, 详见日志!`
  } else {
    subTitle = ``
    detail = `PC: ${signinfo.pc.success ? '成功' : '失败'}, APP: ${signinfo.app.success ? '成功' : '失败'}, 详见日志!`
  }
  $notification.post(title, subTitle, detail)
}

sign()
