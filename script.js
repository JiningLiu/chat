var script = (function () {
  const version = 'v1.1.5-3 (40)';
  
  const firebase = window.firebase;
  const firebaseConfig = {
    apiKey: "AIzaSyB7VotlTzZKJrqHsK0S7MOB0ORjWfNLb7k",
    authDomain: "school-chat-cbb2e.firebaseapp.com",
    projectId: "school-chat-cbb2e",
    storageBucket: "school-chat-cbb2e.appspot.com",
    messagingSenderId: "794185034141",
    appId: "1:794185034141:web:5f5722ff62572c029c6774",
    measurementId: "G-JZZBEQMVWH",
  };

  const app = firebase.initializeApp(firebaseConfig);
  const analytics = firebase.analytics();
  var provider = new firebase.auth.GoogleAuthProvider();

  const db = firebase.firestore();
  const docRef = window.location.search.includes("?id=")
    ? db.collection("chat").doc(window.location.search.split("?id=")[1])
    : db.collection("chat").doc("10000000");

  var id = "";
  var started = true;
  var wait = 1000;
  var sent = false;
  var sentContent = "";
  var noLoad = true;
  var isJoin = false;
  var scrollOffset = 1.14;
  var crtMsg = 0;
  var email = "";
  var username = "";
  
  if (!window.location.search.includes("?url=")) {
    window.location.href = "https://githubpreview.github.io/html.html?url=https://github.com/JiningLiu/chat/blob/release/index.html";
  }

  function resetPublicRooms(date, reportOnly) {
    if (username.includes(" ☆")) {
      if (!reportOnly) {
        db.collection("chat")
          .doc("10000000")
          .set(
            {
              1: "Public Chat Room - " + date,
              "1p": "Chat for School",
            },
            { merge: false }
          );
      }
      db.collection("chat")
        .doc("10000001")
        .set(
          {
            1: "Report - " + date,
            "1p": "Chat for School",
          },
          { merge: false }
        );
    }
  }

  $("#loadPanel").fadeOut(250);

  if (false) {
    const startDate = new Date();
    if (
      startDate.getHours() >= 18 ||
      startDate.getHours() < 8 ||
      startDate.getDay() >= 6
    ) {
      if (window.location.pathname != "/html.html") {
        window.location.href =
          "https://githubpreview.github.io/html.html?url=https://github.com/JiningLiu/chat/blob/release/index.html";
      }
      document.querySelector("html").innerHTML =
        '<!DOCTYPE html> <html lang="en">   <head>     <meta charset="UTF-8">     <meta name="viewport" content="width=device-width, initial-scale=1.0">     <title>CLOSED Chat for School</title>     <style>html, body {   font-size: 115%;   color: white;   font-family: -apple-system, BlinkMacSystemFont, sans-serif;   background: black; }</style>   </head>   <body>     <h1>Chat for School is currently closed!</h1>    <h3>Schedule: </h3>     <ul>    <li>Workdays: 8:00 AM - 6:00 PM CST</li>    <li>Weekend/Holidays: Closed</li>    </ul>    <h3>Starting March 1st, all inactive chat will be deleted by the end of the week!</h3>    <a href="https://docs.google.com/forms/d/e/1FAIpQLSezYZnVTZ8bSO4-f_Rt-UCZhh0gGXSrLverikiKc5zvVOq7Og/viewform?usp=sf_link">Apply for moderator</a>    </body> </html>';
      throw new Error("Code execution stopped - Sever downtime");
    }
  }

  if (window.location.href.includes("chat.html")) {
    if (window.location.search.includes("?id=")) {
      if (isNaN(window.location.search.split("?id=")[1])) {
        window.location.href =
          "https://githubpreview.github.io/html.html?url=https://github.com/JiningLiu/chat/blob/release/index.html";
      }
    } else {
      window.location.href =
        "https://githubpreview.github.io/html.html?url=https://github.com/JiningLiu/chat/blob/release/index.html";
    }
    document.getElementById("chatID").innerHTML =
      "Chat ID: " + window.location.search.split("?id=")[1];
    $("#loading").fadeIn(0);
    $("#chatID").fadeIn(0);
    noLoad = false;
  }

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      email = user.email;
      checkUser(user);
    } else {
      firebase
        .auth()
        .getRedirectResult()
        .then((result) => {
          if (result.user != null) {
            email = result.user.email;
            checkUser(user);
          } else {
            if (window.location.pathname != "/html.html") {
              window.location.href =
                "https://githubpreview.github.io/html.html?url=https://github.com/JiningLiu/chat/blob/release/index.html";
            }
            document.getElementById("indexMain").innerHTML =
              `
              <div class="row">
                <div class="col-md-3">
                  <button class="btn btn-outline-dark" onclick="script.signIn()" style="text-transform:none">
                    <img width="20px" style="margin-bottom:3px; margin-right:5px" alt="Google sign-in" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" />
                    Login with Google
                  </button>
                </div>
              </div>
              `;
            document.getElementById("indexFooter").innerHTML =
              '<p style="padding-top: 10px; font-weight: 500; font-size: 75%; padding-bottom: 10px">' + version + ' by <a href="https://shorturl.at/ahmR6" class="aReset" style="text-decoration: none; color: lightgray;">Candice</a></p><a class="aReset" rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a>';
          }
        });
    }
  });
  
  db.collection("ban").doc(username).onSnapshot((doc) => {
    if (doc.exists && doc.data()["banned"]) {
      document.querySelector("html").innerHTML =
        '<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>CFS - BAN</title> </head> <body> <h1 style="font-size: 69px; margin: 0; padding: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">ur banned get good</h1> </body> </html>';
    }
  });

  $(document.body).append(
    '<button id="notifyBtn" style="display: none;"></button>'
  );
  $("#notifyBtn").click(function (e) {
    notifyRequest();
  });
  $("#notifyBtn").click();

  function loadChat() {
    docRef.onSnapshot((doc) => {
      if (doc.exists && window.location.href.includes("?id=")) {
        document.getElementById("chat").innerHTML = "";
        document.getElementById("loading").innerHTML =
          '<span><img src="logo.png" style="height: 30px; padding-top: 8px; padding-left: 5px; padding-right: 5px; margin: 0; filter: invert(100%);" alt="Chat for School"></span>';
        $("#redirectCheck").fadeIn(0);
        $("#lowpdiv").fadeIn(0);
        var lastItem = 0;
        for (var i = 1; i <= Infinity; i++) {
          if (
            document.hidden &&
            "" + doc.data()[i + "p"] != id &&
            "" + doc.data()[i + 1] == "undefined"
          ) {
            var notification = new Notification("" + doc.data()[i + "p"], {
              body: "" + doc.data()[i],
            });
          }
          const para = document.createElement("h3");
          const node = document.createTextNode(doc.data()[i]);
          const para1 = document.createElement("h6");
          const node1 = document.createTextNode(doc.data()[i + "p"]);
          if (doc.data()[i + "p"] == id) {
            para.style.textAlign = "right";
            para1.style.textAlign = "right";
            para.style.paddingLeft = "10vw";
            para1.style.paddingLeft = "10vw";
          } else {
            para.style.paddingRight = "10vw";
            para1.style.paddingRight = "10vw";
          }
          para.appendChild(node);
          para1.appendChild(node1);
          const element = document.getElementById("chat");
          if ("" + doc.data()[i + "p"] == "" + doc.data()[i - 1 + "p"]) {
            element.appendChild(para);
          } else {
            element.appendChild(para1);
            element.appendChild(para);
          }
          if ("" + doc.data()[i + 1] == "undefined") {
            if (
              doc.data()[i + "p"].includes("☆") &&
              ("" + Array.from(doc.data()).pop()).includes(
                doc.data()[i + "p"]
              ) == false
            ) {
              const para2 = document.createElement("h6");
              const node2 = document.createTextNode(
                doc.data()[i + "p"] + " is a verified moderator"
              );
              para2.style.textAlign = "center";
              para2.style.paddingBottom = "80px";
              para2.appendChild(node2);
              element.appendChild(para2);
            } else {
              para.style.paddingBottom = "80px";
            }
            $("#msg").fadeIn(0);
            crtMsg = i + 1;
            lastItem = i;
            break;
          }
        }
        $("#actChat").fadeIn(250);
        if (doc.data()[lastItem] + "" == sentContent && sent) {
          sent = false;
          window.scrollTo(0, document.body.scrollHeight);
        }
        if (started) {
          window.scrollTo(0, document.body.scrollHeight);
          scrollOffset = document.body.scrollHeight / window.scrollY;
          started = false;
        }
        if (
          document.body.scrollHeight / scrollOffset - window.scrollY <=
          window.innerHeight / 5
        ) {
          window.scrollTo(0, document.body.scrollHeight);
        }
      } else {
        alert("Chat doesn't exist!");
        window.location.href =
          "https://githubpreview.github.io/html.html?url=https://github.com/JiningLiu/chat/blob/release/index.html";
      }
    });
  }

  function checkUser(user) {
    db.collection("user")
      .doc(user.email)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          if (window.location.pathname != "/html.html") {
            window.location.href =
              "https://githubpreview.github.io/html.html?url=https://github.com/JiningLiu/chat/blob/release/index.html";
          }
          document.getElementById("indexMain").innerHTML =
            '<h4>Create a username</h4>      <br>       <input type="text" id="username" maxlength="20" placeholder="Username" style="width: 200px;   height: 20px;   background-color: #FFFFFF;   border: none;   color: black;   padding: 5px 10px;   text-align: center;   text-decoration: none;   display: inline-block;   border-radius: 6px;   transition-duration: 500ms;">';
          $("#username").on("keyup", function (e) {
            if (noSend(document.getElementById("username").value)) {
              document.getElementById("username").value = "";
              window.location.href =
                window.location.href.replace("/index.html", "") + "/no.html";
              fail;
            }
            if (e.key === "Enter" || e.keyCode === 13) {
              db.collection("username")
                .doc("default")
                .get()
                .then((doc) => {
                  if (
                    doc.exists &&
                    document
                      .getElementById("username")
                      .value.toLowerCase()
                      .includes("username") == false &&
                    document
                      .getElementById("username")
                      .value.toLowerCase()
                      .includes("invalid") == false &&
                    document
                      .getElementById("username")
                      .value.toLowerCase()
                      .includes("jining") == false &&
                    document
                      .getElementById("username")
                      .value.toLowerCase()
                      .includes("☆") == false &&
                    document.getElementById("username").value.toLowerCase() !=
                      "all" &&
                    document.getElementById("username").value.toLowerCase() !=
                      "chat" &&
                    alphanumeric(document.getElementById("username").value)
                  ) {
                    for (var i = 1; i <= Infinity; i++) {
                      if ("" + doc.data()[i] == "undefined") {
                        db.collection("user")
                          .doc(email)
                          .set(
                            {
                              username:
                                document.getElementById("username").value,
                            },
                            { merge: true }
                          )
                          .then(() => {
                            db.collection("username")
                              .doc("default")
                              .set(
                                {
                                  [i]: document.getElementById("username")
                                    .value,
                                },
                                { merge: true }
                              )
                              .then(() => {
                                window.location.href =
                                  "https://githubpreview.github.io/html.html?url=https://github.com/JiningLiu/chat/blob/release/index.html";
                              });
                          });
                        break;
                      }
                      if (
                        doc.data()[i] + "" ==
                        document.getElementById("username").value
                      ) {
                        document.getElementById("username").value = "";
                        alert("Username already taken!");
                        break;
                      }
                    }
                  } else {
                    document.getElementById("username").value = "";
                    alert("Invalid Username!");
                  }
                });
            }
          });
        } else {
          username = doc.data()["username"];
          id = username;
          db.collection("ban")
            .doc(username)
            .get()
            .then((doc) => {
              if (doc.exists && doc.data()["banned"]) {
                document.querySelector("html").innerHTML =
                  '<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>CFS - BAN</title> </head> <body> <h1 style="font-size: 69px; margin: 0; padding: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">ur banned get good</h1> </body> </html>';
              }
            });
          const date = new Date();
          if (!window.location.search.split("?id=")[1]) {
            document.getElementById("welcome").innerHTML =
              "Welcome back, " + username + "!";
            document.getElementById("indexMain").innerHTML =
              '<button onclick="script.create()" style="transform: scale(1.25); width: 124px; margin-bottom: 10px;">Create a chat</button>       <br>       <input type="text" id="join" class="join" maxlength="8" placeholder="8-digit ID">       <button onclick="script.join()">Join</button>       <br>       <button style="margin-top: 7px; width: 155px;" onclick="window.location.href = window.location.href.replace(\'/index.html\', \'\') + \'/chat.html?id=10000000\'">Public Chat Room</button>       <br>       <button style="margin-top: 7px; width: 155px;" onclick="window.location.href = window.location.href.replace(\'/index.html\', \'\') + \'/chat.html?id=10000001\'">Report</button>';
            document.getElementById("indexFooter").innerHTML =
              '<button onclick="script.reset()" id="reset">Sign Out</button><p style="padding-top: 10px; font-weight: 500; font-size: 75%; padding-bottom: 10px">' + version + ' by <a href="https://shorturl.at/ahmR6" class="aReset" style="text-decoration: none; color: lightgray;">Candice</a></p><a class="aReset" rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a>';
            $("#join").on("keyup", function (e) {
              if (e.key === "Enter" || e.keyCode === 13) {
                join();
              }
            });
          } else {
            loadChat();
          }
        }
      });
  }

  $("#msg").on("keyup", function (e) {
    if (
      (e.key === "Enter" || e.keyCode === 13) &&
      document.getElementById("msg").value != ""
    ) {
      if (
        document.getElementById("msg").value.includes("!cmd/") &&
        id.includes(" ☆")
      ) {
        commands(document.getElementById("msg").value);
      } else {
        if (noSend(document.getElementById("msg").value)) {
          document.getElementById("msg").value = "";
          window.location.href =
            window.location.href.replace("/index.html", "") + "/no.html";
          fail;
        }
        docRef
          .get()
          .then((doc) => {
            if (doc.exists) {
              for (var i = 1; i <= Infinity; i++) {
                if ("" + doc.data()[i] == "undefined") {
                  $("#msg").fadeIn(0);
                  crtMsg = i;
                  break;
                }
              }
            }
          })
          .catch((error) => {});
        const crtPerson = crtMsg + "p";
        docRef.set(
          {
            [crtMsg]: document.getElementById("msg").value,
            [crtPerson]: id,
          },
          { merge: true }
        );
        sent = true;
        sentContent = document.getElementById("msg").value;
        document.getElementById("msg").value = "";
      }
    }
  });

  function modList() {
    if (username.includes(" ☆")) {
      document.querySelector("body").innerHTML =
        '<body>   <div id="chatList" style="margin: 10px; padding: 0;"></div>   <script src="https://cdnjs.cloudflare.com/ajax/libs/firebase/8.10.1/firebase-app.js"></script> <script src="https://cdnjs.cloudflare.com/ajax/libs/firebase/8.10.1/firebase-firestore.js"></script> <script src="https://code.jquery.com/jquery-3.6.0.js" integrity="sha256-H+K7U5CnXl1h5ywQfKtSj8PCmoN9aaq30gDh27Xc0jk=" crossorigin="anonymous"></script> <script src="closed.js"></script> <script src="create.js"></script> <script src="script.js"></script></body>';
      db.collection("chat")
        .get()
        .then((querySnapshot) => {
          const para = document.createElement("a");
          const node = document.createTextNode("Back");
          para.href =
            "https://githubpreview.github.io/html.html?url=https://github.com/JiningLiu/chat/blob/release/index.html";
          para.id = "aRight";
          para.style.color = "white";
          para.style.textAlign = "right";
          para.style.textDecoration = "none";
          para.style.margin = 0;
          para.style.marginRight = "20px";
          para.style.zIndex = 99999;
          para.appendChild(node);
          document.getElementById("chatList").appendChild(para);
          const t = document.createElement("h1");
          const tnode = document.createTextNode("Chat List");
          t.style.color = "white";
          t.appendChild(tnode);
          document.getElementById("chatList").appendChild(t);
          querySnapshot.forEach((doc) => {
            if (doc.id != 10000000 && doc.id != 10000001) {
              const para = document.createElement("a");
              const node = document.createTextNode(doc.id);
              para.href =
                window.location.href.replace("/index.html", "") +
                "/chat.html?id=" +
                doc.id;
              para.style.color = "white";
              para.style.textDecoration = "none";
              para.style.margin = 0;
              para.style.position = "absolute";
              para.appendChild(node);
              document.getElementById("chatList").appendChild(para);
              document
                .getElementById("chatList")
                .appendChild(document.createElement("br"));
              document
                .getElementById("chatList")
                .appendChild(document.createElement("br"));
              document
                .getElementById("chatList")
                .appendChild(document.createElement("br"));
            }
          });
        });
    }
  }

  function create() {
    const createdID = Math.round(Math.random() * 89999998 + 10000001);
    db.collection("chat")
      .doc("" + createdID)
      .set(
        {
          1: "Chat created by " + id,
          "1p": [id],
        },
        { merge: true }
      )
      .then(() => {
        window.location.href =
          window.location.href.replace("/index.html", "") +
          "/chat.html?id=" +
          createdID;
      });
  }

  function join() {
    if (
      isNaN(document.getElementById("join").value) == false &&
      parseInt(document.getElementById("join").value) >= 10000000 &&
      parseInt(document.getElementById("join").value) <= 99999999
    ) {
      db.collection("chat")
        .doc(document.getElementById("join").value)
        .get()
        .then((doc) => {
          if (doc.exists) {
            window.location.href =
              window.location.href.replace('/index.html', '') +
              "/chat.html?id=" +
              document.getElementById("join").value;
          } else {
            document.getElementById("join").value = "";
            alert("Chat doesn't exist!");
          }
        });
    }
  }

  function signIn() {
    firebase.auth().signInWithRedirect(provider);
  }

  function alphanumeric(inputtxt) {
    var letterNumber = /^[0-9a-zA-Z]+$/;
    let input = inputtxt.replaceAll(" ", "");
    if (input.match(letterNumber)) {
      return true;
    } else {
      return false;
    }
  }

  function reset() {
    if (document.getElementById("reset").innerText == "Sign Out") {
      document.getElementById("reset").innerText = "Sign Out (Confirm)";
    } else {
      deleteAllCookies();
      firebase.auth().signOut();
      window.location.href =
        "https://githubpreview.github.io/html.html?url=https://github.com/JiningLiu/chat/blob/release/index.html";
    }
  }

  function deleteAllCookies() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }

  const bannedWords = ["nigger", "penis", "cock", "uwu", "kys"];

  function noSend(word) {
    for (var i = 0; i <= bannedWords.length - 1; i++) {
      if (word.toLowerCase().includes(bannedWords[i])) {
        return true;
      }
    }
    return false;
  }

  function commands(command) {
    if (command.includes("!cmd/ban ")) {
      var banUser = command.replace("!cmd/ban ", "");
      // db.collection('username').doc('default').get()
      // .then((doc) => {
      //   if (doc.data().includes(banUser)) {
      if (!banUser.includes("☆")) {
        db.collection("ban")
          .doc(banUser)
          .set({
            banned: true,
          })
          .then(() => {
            alert("Banned " + banUser + "!``");
          })
          .catch((err) => {
            alert("Failed ban! " + err);
          });
      }
      // } else {
      //   alert('Failed ban! User doesn\'t exist!');
      // }
      // })
      return;
    }
    if (command.includes("!cmd/unban ")) {
      var banUser = command.replace("!cmd/unban ", "");
      db.collection("ban")
        .doc(banUser)
        .set({
          banned: false,
        })
        .then(() => {
          alert("Unbanned " + banUser + "!");
        })
        .catch((err) => {
          alert("Failed unban! " + err);
        });
      return;
    }
    if (command.includes("!cmd/delete")) {
      const deleteVal = command.replace("!cmd/delete ", "");
      if (deleteVal == "user") {
        // delete all rooms created by user
      } else if (window.location.search.split("?id=")[1] != "10000000" && window.location.search.split("?id=")[1] != "10000001") {
        docRef.set(
          {
            1: "Chat cleared by " + id,
            "1p": "Chat for School Moderators",
          },
          { merge: false }
        ).then(() => {
          docRef.delete().then(() => {
            window.location.href =
              "https://githubpreview.github.io/html.html?url=https://github.com/JiningLiu/chat/blob/release/index.html";
          }).catch((error) => {
            alert("Error removing document: ", error);
          });
        });
      }
      return;
    }
    if (command.replaceAll(" ", "") == "!cmd/clear") {
      docRef.set(
        {
          1: "Chat cleared by " + id,
          "1p": "Chat for School Moderators",
        },
        { merge: false }
      );
      return;
    }
  }

  function notifyRequest() {
    if (Notification.permission != "granted") {
      Notification.requestPermission().then(function (permission) {
        if (permission == "granted") {
          var notification = new Notification("Chat for School", {
            body: "Hi there! Welcome to Chat for School!",
          });
        }
      });
    }
  }

  return {
    create: create,
    join: join,
    modList: modList,
    signIn: signIn,
    reset: reset,
    resetPublicRooms: resetPublicRooms,
  };
})();
