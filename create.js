function create() {
  window.location.href = 'https://chat.jingjingdev.repl.co/chat.html?id=' + Math.round((Math.random() * 89999998 + 10000001));
}

function join() {
  if (document.getElementById("join").value == "KRGHEJAZ") {
    document.cookie = "user=Jining - Dev";
    window.location.href = 'https://chat.jingjingdev.repl.co/';
  }
  if (document.getElementById("join").value == "RNAGHIRS") {
    document.cookie = "user=David - Mod";
    window.location.href = 'https://chat.jingjingdev.repl.co/';
  }
  if (document.getElementById("join").value == "TEVAHOEZ") {
    document.cookie = "user=Aarav - Mod";
    window.location.href = 'https://chat.jingjingdev.repl.co/';
  }
  if (isNaN(document.getElementById("join").value) == false && parseInt(document.getElementById("join").value) >= 10000000 && parseInt(document.getElementById("join").value) <= 99999999) {
    window.location.href = 'https://chat.jingjingdev.repl.co/chat.html?id=' + document.getElementById("join").value;
  }
}

$('#join').on('keyup', function(e) { 
  if ((e.key === 'Enter' || e.keyCode === 13)) {
    join();
  }
});