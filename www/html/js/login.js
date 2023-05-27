// Listen for the enter key press to "submit" the form
window.addEventListener(
  "keypress",
  function (e) {
    if (e.keyCode === 13) {
      doLogin();
    }
  },
  false
);

var urlBase = "https://mycontacts.fun/LAMPAPI";
var extension = "php";

var userId = 0;
var firstName = "";
var lastName = "";

window.onload = function() {
  let name = "userId" + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      userId = c.substring(name.length, c.length);
    }
  }	
	
  if( userId > 0 && window.location.toString() !== "https://mycontacts.fun/contacts.html") {
	window.location.replace("https://mycontacts.fun/contacts.html");
  }
};


function doLogin() {
    
  userId = 0;
  firstName = "";
  lastName = "";

  var login = document.getElementById("loginUsername").value;
  var password = document.getElementById("loginPassword").value;

//  var hash = md5(password);
  document.getElementById("loginResult").innerHTML = "";

  var jsonPayload = {
    login: login,
    password: password,
  };

  var url = urlBase + "/Login." + extension;
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, false);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.send(JSON.stringify(jsonPayload));

    var jsonObject = JSON.parse(xhr.responseText);

    userId = jsonObject.id;
    error = jsonObject.error;
	
	firstName = jsonObject.firstName;
	lastName = jsonObject.lastName;
	
	if (login == "" || password == "") {
      document.getElementById("loginResult").innerHTML =
        "Please fill out all the fields.";
      document.getElementById("loginResult").style.color = "red";
    } else if 
	  (error.length > 0) {
        document.getElementById("loginResult").innerHTML = "Username or password is incorrect.";
        document.getElementById("loginResult").style.color = "red";
        
    } else {
      saveCookie();
      window.location.replace("https://mycontacts.fun/contacts.html");
    }
  } catch (err) {
    document.getElementById("loginResult").innerHTML = "Server error.";
  }
}

function saveCookie() {
	var minutes = 30;
  var date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);
  document.cookie = `firstName=${firstName};expires=${date.toGMTString()};`;
  document.cookie = `lastName=${lastName};expires=${date.toGMTString()};`;
  document.cookie = `userId=${userId};expires=${date.toGMTString()};`;
}