
function warn(){
  return confirm("Are you sure you want to delete this tokimon?");
}

function checkFields(){
  var allFields = document.getElementsByClassName("attribute");
  var error = 0;
  for (k = 0; k < allFields.length; k++){
    if (!allFields[k].checkValidity()){
      error = 1;
    }
    if (allFields[k].value != ''){
      allWeights[k].style.border = "1px solid red";
      error = 1;
    }
    else{
      allFields[k].style.border = "";
    }
  }
  if (error == 1){
    alert("Please fill in all fields");
    return false;
  }
  return true;
}

var deleteForm = document.getElementById('deleteForm');
deleteForm.addEventListener('submit', event => {
  bool ok = warn();
  if (!ok){
    event.preventDefault();
    // actual logic, e.g. validate the form
    console.log('Form submission cancelled.');
  }

});



var deleteButton = document.getElementById("delete");
deleteButton.onclick = warn;

var addButton = document.getElementById("addButton");
addButton.onclick = checkFields;

var addForm = document.getElementById("addForm");
addForm.onsubmit = checkFields;
