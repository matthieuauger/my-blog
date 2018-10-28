---
slug: /connected-door-with-arduino-and-google-api
title: Don't bother with keys, open your door with Google API
date: "2014-06-26T22:12:03.284Z"
---

At Theodo we face various issues, and sometimes it starts at the very beginning of the day.
- For safety concerns, the front door of the company does not have a handle, and only opens with a key or a RFID
 pass. 
- While Theodo had few employees, RFID passes were enough. But with the company development, and in prevision
 of new developers who regularly join us, we wanted to set up a simpler and more flexible solution allowing Theodoers to 
 be autonomous.
We are using Google Apps to handle company user accounts, and Google offers a powerful OAuth 2.0 API to authenticate users. Bazinga! Let's build a solution to open the front door with our smartphones using Google API.
Here is a summary of the technologies we are going to use:
  - Next to the door an [Arduino](http://www.arduino.cc/), connected to the network and whose only job is to listen for a 
private key and send the opening instruction to the door if the key is valid.
  - For authentication a simple [Node.js](http://nodejs.org) application, implementing OAuth 2.0 protocol. If the user email domain is [theodo.fr](http://www.theodo.fr), the application sends the valid private key to the Arduino
  - As a bonus, an HTML5 manifest will make the application load instantly because we don't like to wait!
Still interested? Here are the details.

Arduino
-------
First of all an Arduino, connected to the company network and listening to incoming connections.
Arduino runs programs written in C. For our case, the code is widely inspired of [https://github.com/guyzmo/FlyingDoor](https://github.com/guyzmo/FlyingDoor).
We only removed the beeps, and changed the expected message from "1" to a more complex private key.
Node.js
-------
Second part of development consisted of opening the door with Node.js, without interface nor verification.
Node.js offers powerful modules for almost everything. Here we only want to send a message to a server,
let's use [net](http://nodejs.org/api/net.html) module.

```javascript
// lib/client/door.js
var net = require('net');
function open() {
    var client = new net.Socket();
    client.connect("1337", "192.168.1.1", function() {
        console.log("Opening the Door");
        client.write("MY_AWESOME_PRIVATE_KEY" + "\r");
    });
    client.on("data", function(data) {
        console.log("Receiving response : " + data);
        if ("CLOSE\n" == data) {
            client.end();
        }
    });
}
```

Quite easy! We connect to the server port and send it the private key. The server answers "OPEN", sleeps for 2 seconds and answers again "CLOSE".
Once the "CLOSE" message is received back, we disconnect our client.

Web interface with Express framework
------------------------------------
Once the client has been developed, we needed a simple interface to display buttons. We decided to use 
[Express](http://expressjs.com/) Node.js framework with [Jade](http://jade-lang.com/) templates, and 
[Bootstrap](http://getbootstrap.com/) CSS for buttons.

```pug
//layout.jade
doctype html
    html
    head
        title Theodo Door
        link(rel='stylesheet', href='/stylesheets/bootstrap.min.css')
        link(rel='stylesheet', href='/stylesheets/style.css')
    body
        block content
//index.jade
extends layout
block content
    .body
        h1 Theodo Door
        button#openDoor.btn(type="button") OPEN
        a#googleSigninButton.btn.btn-primary(
            href=""
        ) Google
```

At this point, we have a client and an interface. The only missing piece is the logic which will make them work together.

Authentication with Oauth
-------------------------
Google offers a [client](https://github.com/google/google-api-nodejs-client/) to facilitate OAuth transactions.
We only need a Google application. For practical reasons, I will not detail here the steps to create one, but you can
doing it easily by going [there](https://console.developers.google.com/project), creating a new project and configuring 
the credentials properly (redirect URI is the most important part).
In practice, how does an OAuth transaction works?
- We display a link with our application ID and the callback URL where we want Google to answer back
- This link asks the user if he/she grants the application
- Once the user accepts it, Google sends back a code to our application
- Then, we can ask Google a token to read the user data, by giving him our application ID, our secret, and the received code
- Google finally sends back to us an *access token* and a *refresh token*
What is the utility of the *refresh token*? *Access tokens* have a limited lifetime. A refresh token can be stored
server-side to fetch a new access token whenever you need it, and this without new authorization of the user.
Now, how will we handle this? First we get the *refresh token* of the user and store it in his/her browser. Then another
action will be responsible of fetching this *refresh token* from the browser and check the user information to decide if
the door is to be opened.
Right now, you may ask if storing a refresh token client-side and transfer it on the network is a good idea. 
Indeed, it's not recommended. We are doing it here for three reasons :
  - The level of informations we are asking is the most basic (id, email). The criticity of a data theft is low.
  - We are using HTTPS to secure data exchanges in production
  - It's simple and easy!

Generating the connection page with Express
--------------------------------------------

```javascript
// Index action. Juste some buttons with the URL for Google Authentication
app.get('/', function(req, res) {
    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/userinfo.email',
        state: 'profile',
        approval_prompt: 'force'
    });
    res.render('index', {
        authUrl: authUrl
    });
});
// Action which will read the token sent back by Google
app.get('/oauthcallback', function(req, res) {
    var code = req.query.code;
    oauth2Client.getToken(code, function(err, tokens) {
        if (!"refresh_token" in tokens) {
            return res.send("Authentication process has failed");
        }
        // Send back the token to the client in URL
        res.redirect("/?refresh_token=" + tokens.refresh_token);
    });
});
```

Client-side, some javascript code manages to fetch the token in the URL and to store it in local storage.
Finally, each morning, the application checks if a refresh token is present in local storage.
If not the process above is triggered. Otherwise, we send it to our application in AJAX.
The remaining step is the easier, we read the domain of the user email with the token, and if the domain match, we call 
our client to open the door.

```javascript
app.post('/api/opendoor', function(req, res) {
    var refresh_token = req.body.refresh_token;
    oauth2Client.credentials = {
        refresh_token: refresh_token
    };
    googleapis.discover('oauth2', 'v1').execute(function(err, client) {
        if (!err) {
            client.oauth2.userinfo.get().withAuthClient(oauth2Client).execute(function(err, results) {
                var email = results.email;
                if ((email.indexOf('theodo.fr') + 'theodo.fr'.length) != email.length) {
                    return res.send({
                        status: -1,
                        message: "Google Plus authentication failed (domain mismatch)"
                    });
                }
                doorClient.open();
            
                res.send({
                    status: 0,
                    message: 'Door opened. Welcome !'
                });
            });
        }
    });
});
```

And voilà! The whole thing requires a small effort to set it up but offers ourselves a lot of flexibility.
A [new theodoer](https://www.theodo.fr/blog/2014/04/antoine-gruzelle-is-a-theodoer/) is autonomous the very first day
of its arrival.

Bonus: HTML5 manifest
----------------------
As a bonus, and in order to render the page as fast as possible, a HTML5 manifest has been added. Basically, the browser will cache the entire page and its assets (JavaScript and stylesheets).

```yml
CACHE MANIFEST
# v0.5
CACHE:
/
/stylesheets/bootstrap.min.css
/stylesheets/style.css
http://code.jquery.com/jquery-2.0.3.min.js
https://code.jquery.com/jquery-2.0.3.min.js
/javascripts/door.js
/javascripts/jquery-2.0.3.min.js
```

Thanks to this, once the token is safely stored in the local storage, the only data transmitted to the server will be the
only important information: the user token.

Result of the application can be seen at [http://door.bam.tech/](http://door.bam.tech/) and sources are available on 
[Github](https://github.com/matthieuauger/arduino-google-apps-door). Comments and pull requests are welcomed (maybe a WAP interface?).
Finally if you want to use it for real, why don't you [join us](https://www.m33.tech/je-postule-theodo)?
