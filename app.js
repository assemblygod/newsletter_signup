const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const https = require('https');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/html/signup.html")
})

app.post("/", function(req, res) {

  const firstName = req.body.firstName
  const lastName = req.body.lastName
  const email = req.body.email

  console.log(firstName + "," + lastName + "," + email);

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const JSONdata = JSON.stringify(data)
  const url = "https://us21.api.mailchimp.com/3.0/lists/bffdcad1b7"
  const options = {
    method: "POST",
    auth: "varinder1:aa74c1ed0c7edcf445189e82be13fbf4a-us21"
  }

  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/public/html/success.html")
    } else {
      res.sendFile(__dirname + "/public/html/failure.html")
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
    console.log("The staus code is: " + response.statusCode);
  })

  request.write(JSONdata);
  request.end();

})

app.post("/failure", function(req, res) {
  res.redirect("/")
})

app.listen(process.env.PORT || 3000, function(req, res) {
  console.log("The server is now active on port 3000.");
})

//  mailchimp api key = a74c1ed0c7edcf445189e82be13fbf4a-us21
//  mailchimp audience id = bffdcad1b7
