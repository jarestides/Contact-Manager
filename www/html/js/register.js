// Listen for the enter key press to "submit" the form
window.addEventListener(
  "keypress",
  function (e) {
    if (e.keyCode === 13) {
      addUser();
    }
  },
  false
);

const urlBase = "https://mycontacts.fun/LAMPAPI";
const extension = "php";

var userId = 0;
var firstName = "";
var lastName = "";
var checkEmail = /\S+@\S+\.\S+/;

function addUser() {
  firstName = document.getElementById("firstName").value;
  lastName = document.getElementById("lastName").value;
  email = document.getElementById("email").value;
  login = document.getElementById("signUpLogin").value;
  password = document.getElementById("loginPassword1").value;
  password2 = document.getElementById("loginPassword2").value;


  document.getElementById("signUpResult").innerHTML = "";

  let jsonPayload = {
    login: login,
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
	confirmPassword: password2,
  };

  let url = urlBase + "/Register." + extension;

  let xhr = new XMLHttpRequest();

  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);

        if (jsonObject.error) {
          if (jsonObject.error.includes("Account already exists")) {
            document.getElementById("signUpResult").innerHTML =
              "Sorry, that account already exists.";
			document.getElementById("signUpResult").style.color = "red";
            return;
          } else if (jsonObject.error == "Please fill out all the fields.") {
			  document.getElementById("signUpResult").innerHTML =
                jsonObject.error;
                document.getElementById("signUpResult").style.color = "red";
              return;
          } else if (jsonObject.error == "Please enter a valid email.") {
			  document.getElementById("signUpResult").innerHTML =
                "Please enter a valid email.";
			  document.getElementById("signUpResult").style.color = "red";
			  return;
		  } else if (jsonObject.error == "Passwords do not match.") {
			  document.getElementById("signUpResult").innerHTML =
                "Passwords do not match.";
		      document.getElementById("signUpResult").style.color = "red";
			  return;
		  } else {
			  document.getElementById("signUpResult").innerHTML =
                "Error. Refresh the page and try again.";
			  document.getElementById("signUpResult").style.color = "red";
			  return;
		  }
        }
        else if (password == "") {
          document.getElementById("signUpResult").innerHTML =
            "Please provide a valid password.";
          return;
        }
		else {
		  document.getElementById("signUpTitle").innerHTML = `Registration successful. Redirecting...`;
          document.getElementById("signUpTitle").style.color = "blue";
		  setTimeout(() => { window.location.replace("https://mycontacts.fun"); }, 4000);
		  return;
		}
      }
    };
    xhr.send(JSON.stringify(jsonPayload));
  } catch (err) {
    document.getElementById("signUpResult").innerHTML = err.message;
  }
}
