const axios = require('axios')
exports.handler = function (event, context, callback) {
  const parseBody = JSON.parse(event.body)
  console.log(parseBody)
  axios({
    method: 'post',
    url: 'https://enj521z9xemsn.x.pipedream.net/', // https://requestbin.com
    data: { name: parseBody.name },
  })
    .then((response) => {
      console.log(response)
      callback(null, {
        statusCode: 200,
        body: 'Netlify funcitons work just so easy oh yeah',
      })
    })
    .catch((err) => {
      console.log(err)
      callback(new Error('someting went wrong'))
    })
}
