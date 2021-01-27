

//独立COOKIE文件     ck在``里面填写，多账号换行
let iboxpayheaderVal= `{"Content-Type":"application/json; charset=utf-8","X-User-Agent":"VeiShop, 1.4.4 (iOS, 13.7, zh_CN, Apple, iPhone, 9BFBF900-5890-4A6F-8D94-E9EA628EC3D1)","Accept":"*/*","version":"1.4.4","shopkeeperId":"1148855820752977920","source":"VEISHOP_APP_IOS","Host":"veishop.iboxpay.com","Accept-Language":"zh-Hans-CN;q=1","token":"6480b56e31aa41ff8ee6137da140e55e","Accept-Encoding":"gzip, deflate, br","traceid":"3135077695733883699216117640543862bfa26fca4b8","User-Agent":"VeiShop, 1.4.4 (iOS, 13.7, zh_CN, Apple, iPhone, 9BFBF900-5890-4A6F-8D94-E9EA628EC3D1)","Connection":"keep-alive","mchtNo":"100529600058887"}`



let iboxpaycookie = {
  iboxpayheaderVal: iboxpayheaderVal,  
  
}

module.exports =  iboxpaycookie
  


