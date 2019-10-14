
function warn(){
  return confirm("Are you sure you want to delete this tokimon?");
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
