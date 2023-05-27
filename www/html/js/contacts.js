var urlBase = "https://mycontacts.fun/LAMPAPI";
var extension = "php";

var userId = 0;
var firstName = "";
var lastName = "";
var contacts = [];

function isAuthenticated() {
  userId = getUserId();

  if (!userId || userId < 0) {
    window.location.href = "index.html";
  } else {
    getName();
    document.getElementById("userName").innerHTML = `Welcome ${firstName} ${lastName}`;
  }
}

function getName() {
  userId = -1;
  var data = document.cookie;
  var splits = data.split(";");
  for (var i = 0; i < splits.length; i++) {
    var thisOne = splits[i].trim();
    var tokens = thisOne.split("=");
    if (tokens[0] == "firstName") {
      firstName = tokens[1];
    }
    if (tokens[0] == "lastName") {
      lastName = tokens[1];
    }
  }
}

function getUserId() {
  userId = -1;
  var data = document.cookie;
  var splits = data.split(";");
  for (var i = 0; i < splits.length; i++) {
    var thisOne = splits[i].trim();
    var tokens = thisOne.split("=");
    if (tokens[0] == "userId") {
      userId = parseInt(tokens[1].trim());
    }
  }
  return userId;
}

function resetDeleteMessage() {
  document.getElementById("deleteMessage").innerHTML = ``;
  searchContact();
}

function resetUpdateMessage() {
  document.getElementById("updateMessage").innerHTML = ``;
  searchContact();
}

function searchContact() {
  userId = getUserId();
  var searchText = document.getElementById("searchText").value;
  var searchResults = document.getElementById("search-results");

  let jsonPayload = {
    search: searchText,
    userId: userId,
  };

  var url = urlBase + "/SearchContacts." + extension;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);
        contacts = jsonObject.results;

        searchResults.innerHTML = "";

        if (contacts.length > 0) {
          if ($.fn.DataTable.isDataTable("#resultsTable")) {
            $("#resultsTable").DataTable().clear().destroy();
          }
          for (i = 0; i < contacts.length; i++) {
            let contact = contacts[i];
            searchResults.innerHTML += `
              <tr>
                <td id="fname${contact.ID}">${contact.FirstName}</td>
                <td id="lname${contact.ID}">${contact.LastName}</td>
                <td id="ph${contact.ID}">${contact.Phone}</td>
                <td id="em${contact.ID}">${contact.Email}</td>
                <td>
                  <a href="#">
                    <button type="button" class="btn btn-outline-info btn-rounded btn-sm" data-toggle="modal" data-target="#updateContactModalCenter" data-backdrop="static" onclick="editContactModal(${contact.ID})">Edit
                    </button> 
                  </a>
                  <a href="#">
                    <button type="button" class="btn btn-outline-danger btn-rounded btn-sm" data-toggle="modal" data-target="#deleteContactModalCenter" data-backdrop="static" onclick="deleteConfirmation(${contact.ID})">Delete
                    </button>
                  </a>
                </td>
              </tr>
              `;
          }
          createTable();
        } else {
          if (!$.fn.DataTable.isDataTable("#resultsTable")) {
            createTable();
          } else {
            $("#resultsTable").DataTable().clear().draw();
          }
        }
      }
    };
    xhr.send(JSON.stringify(jsonPayload));
  } catch (err) {
    searchResults.innerHTML = err.message;
  }
}

function createTable() {
  $("#resultsTable").DataTable({
    searching: false,
    lengthChange: false,
    language: {
      emptyTable: "No contacts found.",
    },
    autoWidth: false,
  });
}

function editContactModal(id) {
  firstName = document.getElementById("fname" + id).innerText;
  lastName = document.getElementById("lname" + id).innerText;
  phone = document.getElementById("ph" + id).innerText;
  email = document.getElementById("em" + id).innerText;
  var searchResults = document.getElementById("search-results");
  searchResults.innerHTML += `
  <div class="modal fade" id="updateContactModalCenter" tabindex="-1" role="dialog" aria-labelledby="updateModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title" id="exampleModalLongTitle" style="color:black;">Update Contact</h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="resetUpdateMessage()">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <form class="form" role="form" autocomplete="off" id="updateForm" method="POST">
      <div class="modal-body" style="color:black;">
        <div class="form-group">
          <input class="update-contact" name="firstname" placeholder="First Name" value="${firstName}" id="FirstName">
            <div class="invalid-feedback">Oops, you missed this one.</div>
          </div>
          <div class="form-group">
            <input class="update-contact" name="lastname" placeholder="Last Name" value="${lastName}" id="LastName">
            <div class="invalid-feedback">Oops, you missed this one.</div>
          </div>
          <div class="form-group">
            <input class="update-contact" name="phone" placeholder="Phone" value="${phone}" id="Phone">
            <div class="invalid-feedback">Oops, you missed this one.</div>
          </div>
          <div class="form-group">
            <input class="update-contact" name="email" placeholder="Email" value="${email}" id="Email">
            <div class="invalid-feedback">Oops, you missed this one.</div>
          </div>
      </div>
      <h6 id="updateMessage" style="text-align:center; color:green;"></h6>
      <div class="modal-footer">
        <button id="updateButton" onclick="editContact(${id})" type="button" class="btn btn-primary">Save</button>
      </div>
      <span class="text-white" id="updateResult"></span>
      </form>
    </div>
  </div>
</div>`;
}

function editContact(id) {
  firstName = document.getElementById("FirstName").value;
  lastName = document.getElementById("LastName").value;
  phone = document.getElementById("Phone").value;
  email = document.getElementById("Email").value;

  let jsonPayload = {
    id: id,
    firstName: firstName,
    lastName: lastName,
    email: email,
    phoneNum: phone,
  };

  let url = urlBase + "/EditContact." + extension;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);

  try {
    xhr.onreadystatechange = function () {
      if (
        this.readyState == XMLHttpRequest.DONE &&
        this.status == 200 &&
        (firstName || lastName || phone || email)
      ) {
        document.getElementById("updateMessage").innerHTML = `Contact Updated`;
        document.getElementById("updateForm").reset();
      }
    };
    if (firstName || lastName || phone || email)
      xhr.send(JSON.stringify(jsonPayload));
  } catch (err) {
    document.getElementById("updateResult").innerHTML = err.message;
  }
}

function deleteConfirmation(id) {
  var searchResults = document.getElementById("search-results");

  searchResults.innerHTML += `
  <div class="modal fade" id="deleteContactModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle" style="color:black;">Are you sure?</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="resetDeleteMessage()">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <form class="form" role="form" autocomplete="off" id="deleteForm" method="POST">
      <div class="modal-body" style="color:black;">
      Are you sure you want to delete this contact?
      </div>
      <h6 id="deleteMessage" style="text-align:center; color:red;"></h6>
      <div class="modal-footer">
        <button onclick="deleteContact(${id})" id="deleteButton"  type="button" class="btn btn-danger" data-dismiss="">Yes, delete</button>
      </div>
      </form>
    </div>
  </div>
  </div>
  `;
}

function deleteContact(id) {
  let jsonPayload = {
    id: id,
  };

  let url = urlBase + "/DeleteContacts." + extension;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        document.getElementById("deleteMessage").innerHTML = "Contact Deleted";
      }
    };

    xhr.send(JSON.stringify(jsonPayload));
  } catch (err) {
    document.getElementById("addResult").innerHTML = err.message;
  }
}

function addContact() {
  userId = getUserId();
  firstName = document.getElementById("firstName").value;
  lastName = document.getElementById("lastName").value;
  phone = document.getElementById("phoneNum").value;
  email = document.getElementById("email").value;

  document.getElementById("addResult").innerHTML = "";

  let jsonPayload = {
    userId: userId,
    firstName: firstName,
    lastName: lastName,
    email: email,
    phoneNum: phone,
  };

  let url = urlBase + "/AddContacts." + extension;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);

  try {
    xhr.onreadystatechange = function () {
      if (
        this.readyState == XMLHttpRequest.DONE &&
        this.status == 200 &&
        (firstName || lastName || phone || email)
      ) {
        document.getElementById("addMessage").innerHTML = `Contact Added`;
        document.getElementById("addForm").reset();
      }
    };
    if (firstName || lastName || phone || email)
      xhr.send(JSON.stringify(jsonPayload));
  } catch (err) {
    document.getElementById("addResult").innerHTML = err.message;
  }
}
