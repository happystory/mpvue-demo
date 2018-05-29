const https = require('https')

const { mysql } = require('../qcloud')

// 新增图书
// 1. 获取豆瓣信息
// 2. 入库
// https://api.douban.com/v2/book/isbn/9787229030933
module.exports = async ctx => {
  const { isbn, openid } = ctx.request.body
  if (isbn && openid) {
    const findRes = await mysql('books').select().where('isbn', isbn)
    if (findRes.length) {
      ctx.state = {
        code: -1,
        data: {
          msg: '图书已存在'
        }
      }
      return
    }

    let url = `https://api.douban.com/v2/book/isbn/${isbn}`
    const bookinfo = await getJson(url)

    const rate = bookinfo.rating.average
    const { title, image, alt, publisher, summary, price } = bookinfo
    const tags = bookinfo.tags.map(v => `${v.title} ${v.count}`).join(',')
    const author = bookinfo.author.join(',')
    console.log({
      isbn, rate, title, image, alt, publisher, summary, price, tags, author
    })

    try {
      await mysql('books').insert({
        openid, isbn, rate, title, image, alt, publisher, summary, price, tags, author
      })
      ctx.state.data = {
        title,
        msg: 'success'
      }
    } catch (err) {
      ctx.state = {
        code: -1,
        data: {
          msg: `新增失败：${err.sqlMessage}`
        }
      }
    }
  }
}

function getJson (url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let urlData = ''

      res.on('data', data => {
        urlData += data
      })

      res.on('end', data => {
        const bookinfo = JSON.parse(urlData)
        if (bookinfo.title) {
          resolve(bookinfo)
        } else {
          reject(bookinfo)
        }
      })
    })
  })
}
