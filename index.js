var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var token = 'CAANGz8pkhZCEBANzaUf1lDRJtnYZBxBuLfuZC6fZATQTEAYkd7EwW3dreMJPVVYt1fcM516FjhS7xs52ZBFaJVU0ULj5ftsey3U0pKRn1yWmgX1aVZC3oOOiv8CXmL4I20YunKRWpRppqddUt70ZCS3rN0388iVAwET7wv8VSemkTxWyHHy51huQxZAAK8iEBCvWEuOBl6iZBxQZDZD'
var request = require('request')
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === '1234') {
    res.send(req.query['hub.challenge'])
  }
  res.send('Error, wrong validation token')
})

app.post('/webhook/', function (req, res) {
  var messaging_events = req.body.entry[0].messaging
  for (var i = 0; i < messaging_events.length; i++) {
    var event = req.body.entry[0].messaging[i]
    var sender = event.sender.id
    if (event.message && event.message.text) {
      var text = event.message.text
      console.log(text)
      if (text === 'hi') {
        sendTextMessage(sender, 'Hello!')
      }
      else if (text.substring(0, 3) === 'sum') {
        var num1 = parseInt(text.substring(4, 6))
        var num2 = parseInt(text.substring(6, 8))
        // sendTextMessage(sender, text.substring(4, 6) + text.substring(6, 8))
        sendTextMessage(sender, num1 + num2)
      }
      else if (text.substring(0, 3) === 'max') {
        var num1 = parseInt(text.substring(4, 6))
        var num2 = parseInt(text.substring(6, 8))
        sendTextMessage(sender, Math.max(num1, num2))
      }
      else if (text.substring(0, 3) === 'min') {
        var num1 = parseInt(text.substring(4, 6))
        var num2 = parseInt(text.substring(6, 8))
        sendTextMessage(sender, Math.min(num1, num2))
      }

      else if (text.substring(0, 3) === 'avg') {
        var num = []
        var sum = 0
        var gettext = text.substring(4, text.length)
        //console.log('text : ' + gettext)
        num = gettext.split(' ')
        //console.log('split : ' + num + ' len = ' + num.length)
        for (var i = 0;i < num.length;i++) {
          sum += parseFloat(num[i])
        }
        sendTextMessage(sender, (sum / num.length).toFixed(2))
      }
    // sendTextMessage(sender, 'Text received, echo: ' + text.substring(0, 200))
    }
  }
  res.sendStatus(200)
})
function sendTextMessage (sender, text) {
  var messageData = {
    text: text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: token},
    method: 'POST',
    json: {
      recipient: {id: sender},
      message: messageData,
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending message: ', error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }
  })
}

app.set('port', (process.env.PORT || 5000))

app.listen(app.get('port'), function () {
  console.log('Example app listening on port ' + app.get('port') + '!')
})
