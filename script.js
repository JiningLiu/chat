const firebaseConfig = {
  apiKey: "AIzaSyB7VotlTzZKJrqHsK0S7MOB0ORjWfNLb7k",
  authDomain: "school-chat-cbb2e.firebaseapp.com",
  projectId: "school-chat-cbb2e",
  storageBucket: "school-chat-cbb2e.appspot.com",
  messagingSenderId: "794185034141",
  appId: "1:794185034141:web:5f5722ff62572c029c6774",
  measurementId: "G-JZZBEQMVWH"
};

const app = firebase.initializeApp(firebaseConfig);
var provider = new firebase.auth.GoogleAuthProvider();

const user = firebase.auth().currentUser;

if (!user) {
  firebase.auth()
    .getRedirectResult()
    .then((result) => {
      if (result.user != null) {
        console.log(result.user.email);
      }
    });
}


var db = firebase.firestore();
var docRef = window.location.search.includes('?id=') ? db.collection("chat").doc(window.location.search.replace("?id=", "")) : db.collection("chat").doc('10000000');
var pplRef = window.location.search.includes('?id=') ? db.collection("chat").doc(window.location.search.replace("?id=", "")) : db.collection("chat").doc('10000000');
var id = "";
var started = true;
var wait = 1000;
var sent = false;
var sentContent = "";
var noLoad = true;
var isJoin = false;
var scrollOffset = 1.14;
var crtMsg = 0;

window.onload = function() {
  const date = new Date();
  if ((date.getHours() >= 18 || date.getHours() < 8 || date.getDay() >= 6) && document.cookie.includes('- Dev') == false && document.cookie.includes('- Dev') == false) {
    document.querySelector('html').innerHTML = '<!DOCTYPE html> <html lang="en">   <head>     <meta charset="UTF-8">     <meta name="viewport" content="width=device-width, initial-scale=1.0">     <title>CLOSED Chat for School</title>     <link rel="stylesheet" href="closed.css">   </head>   <body>     <h1>Chat for School is currently closed!</h1>    <h3>Schedule: </h3>     <ul>    <li>Weekdays: 8:00 AM - 6:00 PM CST</li>    <li>Weekend: Closed</li>    </ul>   </body> </html>';
  }
  $('#loadPanel').fadeOut(250);
  if (window.location.href.includes("chat.html")) {
    if (window.location.search.includes("?id=")) {
      if (isNaN(window.location.search.replace("?id=", ""))) {
        window.location.href = "https://chat.jingjingdev.repl.co/";
      }
    } else {
      window.location.href = "https://chat.jingjingdev.repl.co/";
    }
    document.getElementById('chatID').innerHTML = 'Chat ID: ' + window.location.search.replace("?id=", "");
    pplRef.set({
      1: "created"
    }, { merge: true });
    if (document.cookie != "") {
      id = document.cookie.replace("user=", "");
      if (id.includes("- Dev") || id.includes("- Mod")) {
        id = id.replace('- Dev','');
        id = id.replace('- Mod','');
        id += "☆";
      }
      document.getElementById("login").remove();
      document.getElementById("username").remove();
      $("#actChat").fadeIn(0);
      $("#loading").fadeIn(0);
      $('#chatID').fadeIn(0);
      noLoad = false;
    }
  }
}

docRef.onSnapshot((doc) => {
  if (doc.exists) {
    document.getElementById("chat").innerHTML = '';
    document.getElementById("loading").innerHTML = "Chat for School";
    $('#redirectCheck').fadeIn(0);
    $('#lowpdiv').fadeIn(0);
    var lastItem = 0;
    for(var i = 1; i <= Infinity; i ++) {
      const para = document.createElement("h3");
      const node = document.createTextNode(doc.data()[i]);
      const para1 = document.createElement("h6");
      const node1 = document.createTextNode(doc.data()[i + "p"]);
      if (doc.data()[i + "p"] == id) {
        para.style.textAlign = "right";
        para1.style.textAlign = "right";
        para.style.paddingLeft = "8vw";
        para1.style.paddingLeft = "8vw";
      } else {
        para.style.paddingRight = "8vw";
        para1.style.paddingRight = "8vw";
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
        if (doc.data()[i + "p"].includes("☆") && ("" + Array.from(doc.data()).pop()).includes(doc.data()[i + "p"]) == false) {
          const para2 = document.createElement("h6");
          const node2 = document.createTextNode(doc.data()[i + "p"] + ' is a verified moderator');
          para2.style.textAlign = "center";
          para2.style.paddingBottom = "80px";
          para2.appendChild(node2);
          element.appendChild(para2);
        } else {
          para.style.paddingBottom = "80px";
        }
        $('#msg').fadeIn(0);
        crtMsg = i + 1;
        lastItem = i;
        break;
      }
    }
    if (doc.data()[lastItem] + "" == sentContent && sent) {
      sent = false;
      window.scrollTo(0,document.body.scrollHeight);
    }
    if (started) {
      window.scrollTo(0,document.body.scrollHeight);
      scrollOffset = document.body.scrollHeight / window.scrollY;
      started = false;
    }
    if (document.body.scrollHeight / scrollOffset - window.scrollY <= window.innerHeight / 5) {
      window.scrollTo(0,document.body.scrollHeight);
    }
  } else {
    if (isJoin) {
      window.location.href = "https://chat.jingjingdev.repl.co/";
    } else {
      docRef.set({
        "1": "Chat created by " + id, 
        "1p": id
      }, { merge: true });
    }
  }
});

function signIn() {
  firebase.auth().signInWithRedirect(provider);
}

document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});

document.onkeydown = function(e) {
  if(event.keyCode == 123) {
     return false;
  }
  if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
     return false;
  }
  if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
     return false;
  }
  if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
     return false;
  }
  if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
     return false;
  }
}

$('#msg').on('keyup', function (e) {
  if ((e.key === 'Enter' || e.keyCode === 13) && document.getElementById("msg").value != "") {
    if (noSend(document.getElementById("msg").value)) {
      document.getElementById("msg").value = "";
      window.location.href = './no.html';
      fail;
    }
    docRef.get().then((doc) => {
      if (doc.exists) {
        for(var i = 1; i <= Infinity; i ++) {
          if ("" + doc.data()[i] == "undefined") {
            $('#msg').fadeIn(0);
            crtMsg = i;
            break;
          }
        }
      }
    }).catch((error) => {});
    const crtPerson = crtMsg + "p"
    docRef.set({
      [crtMsg]: document.getElementById("msg").value, 
      [crtPerson]: id
    }, { merge: true });
    sent = true;
    sentContent = document.getElementById("msg").value;
    document.getElementById("msg").value = "";
  }
});

$('#user').on('keyup', function (e) {
  if (noSend(document.getElementById("user").value)) {
    document.getElementById("user").value = "";
    window.location.href = './no.html';
    fail;
  }
  if (e.key === 'Enter' || e.keyCode === 13) {
    pplRef.get().then((doc) => {
      if (doc.exists && document.getElementById("user").value.toLowerCase().includes("username already taken") == false && document.getElementById("user").value.toLowerCase().includes("invalid") == false && document.getElementById("user").value.toLowerCase().includes("jining") == false && document.getElementById("user").value.toLowerCase().includes("- mod") == false && document.getElementById("user").value.toLowerCase().includes("- dev") == false && document.getElementById("user").value.toLowerCase().includes("☆") == false && alphanumeric(document.getElementById("user").value)) {
        for(var i = 1; i <= Infinity; i ++) {
          if ("" + doc.data()[i] == "undefined") {
            pplRef.set({
              [i]: document.getElementById("user").value
            }, { merge: true });
            id = document.getElementById("user").value;
            document.cookie = "user=" + id;
            document.getElementById("login").remove();
            document.getElementById("username").remove();
            $("#loadPanel").fadeIn(0);
            window.location.href = window.location.href;
            break;
          }
          if (doc.data()[i] + "" == document.getElementById("user").value) {
            document.getElementById("user").value = "Username already taken!"
            break;
          }
        }
      } else {
        document.getElementById("user").value = "Invalid Username!"
      }
    });
  }
});

function modList() {
  if (document.cookie.includes("- Dev") || document.cookie.includes("- Mod")) {
    document.querySelector('body').innerHTML = '<body>   <div id="chatList" style="margin: 10px; padding: 0;"></div>   <script src="https://cdnjs.cloudflare.com/ajax/libs/firebase/8.10.1/firebase-app.js"></script> <script src="https://cdnjs.cloudflare.com/ajax/libs/firebase/8.10.1/firebase-firestore.js"></script> <script src="https://code.jquery.com/jquery-3.6.0.js" integrity="sha256-H+K7U5CnXl1h5ywQfKtSj8PCmoN9aaq30gDh27Xc0jk=" crossorigin="anonymous"></script> <script src="closed.js"></script> <script src="create.js"></script> <script src="script.js"></script></body>';
    db.collection("chat").get().then((querySnapshot) => {
      const para = document.createElement("a");
      const node = document.createTextNode('Back');
      para.href = 'https://chat.jingjingdev.repl.co/';
      para.id = 'aRight';
      para.style.color = 'white';
      para.style.textAlign = 'right';
      para.style.textDecoration = 'none';
      para.style.margin = 0;
      para.style.marginRight = '20px';
      para.style.zIndex = 99999;
      para.appendChild(node);
      document.getElementById('chatList').appendChild(para);
      const t = document.createElement("h1");
      const tnode = document.createTextNode("Chat List");
      t.style.color = 'white';
      t.appendChild(tnode);
      document.getElementById('chatList').appendChild(t);
      querySnapshot.forEach((doc) => {
        const para = document.createElement("a");
        const node = document.createTextNode(doc.id);
        para.href = 'https://chat.jingjingdev.repl.co/chat.html?id=' + doc.id;
        para.style.color = 'white';
        para.style.textDecoration = 'none';
        para.style.margin = 0;
        para.style.position = 'absolute';
        para.appendChild(node);
        document.getElementById('chatList').appendChild(para);
        document.getElementById('chatList').appendChild(document.createElement("br"));
        document.getElementById('chatList').appendChild(document.createElement("br"));
        document.getElementById('chatList').appendChild(document.createElement("br"));
      });
    });
  }
}

function alphanumeric(inputtxt) {
  var letterNumber = /^[0-9a-zA-Z]+$/;
  if(inputtxt.match(letterNumber)) {
    return true;
  } else { 
    return false; 
  }
}

function reset() {
  if (document.getElementById('reset').innerText == 'Reset') {
    document.getElementById('reset').innerText = 'Reset (Confirm)';
  } else {
    deleteAllCookies();
    window.location.href = '.';
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

const bannedWords = ["nigger"];

function noSend(word) {
  for(var i = 0; i <= bannedWords.length - 1; i ++) {
    if (word.includes(bannedWords[i])) {
      return true;
    }
  }
  return false;
}