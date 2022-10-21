//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const https = require("https");

const homeStartingContent = "Hey! Welcome to DAILY JOURNAL (created by Sayandeep Adhikary). This is a Versatile Web Application which is mainly designed for reading Daily Updates and Journals, but it can be used as a Daily Task Tracker or a simple To-Do List too, depending how you wanna use it :)";


const aboutContent = "Hey! It's Sayandeep Adhikary, from Asansol, West Bengal. I am a 2nd year undergrad in NETAJI SUBHASH ENGINEERING COLLEGE, in INFORMATION TECHNOLOGY. I am a die-hard coder and an explorer. I code efficiently in C++. I am currently gaining control on Data Structures and Algorithms, learning Python and also entering in the world of Web Development as a side hustle. I always try to be fully proficient in whatever I am doing and I am still exploring new technical aspects in this broad digital universe ...                        Besides, I love to listen to music in my free time and I play piano too. I have a keen interest in chess also.";


const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

let allPosts = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("home", {
    homeStartingContent: homeStartingContent,
    posts: allPosts
  });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutStartingContent: aboutContent })
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactStartingContent: contactContent })
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.get("/posts/:postName", function (req, res) {
  const requestedTitle = _.lowerCase(req.params.postName);
  allPosts.forEach(function (post) {
    const storedTitle = post.title;
    if (requestedTitle === (_.lowerCase(storedTitle))) {
      res.render("post", {
        postTitle: storedTitle,
        postContent: post.content
      });
    }
  });
});





app.post("/compose", function (req, res) {
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };
  allPosts.push(post);
  res.redirect("/");
});


app.post("/contact", function (req, res) {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;
  console.log(firstName, lastName, email);

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
  }

  const jsonData = JSON.stringify(data);
  const url = "https://us21.api.mailchimp.com/3.0/lists/20cac0d43a";
  const options = {
    method: "POST",
    auth: "sayan2003:d149d63859035e1d719015c868edab95-us21"
  }
  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/public/success.html");
    }
    else {
      res.sendFile(__dirname + "/public/failure.html");
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});


app.post("/failure", function (req, res) {
  res.redirect("/contact");
});






app.listen(3000, function () {
  console.log("Server started on port 3000");
});
