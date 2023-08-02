const deleBtn = document.querySelectorAll(".deletConfirm");
const message = document.querySelectorAll(".message-form");
const erroMassge = document.getElementById("form-error-msg");


function handleForm(e) {
  e.preventDefault();

  let data = new FormData(e.target);

  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/secure/message", true);

  xhr.onload = function (e) {
    if (this.status == 200) {
      erroMassge.innerHTML = `<div class="alert ${
        e.currentTarget.responseText != "Message Sent"
          ? "alert-warning"
          : "alert-success"
      } text-center alert-dismissible fade show" role="alert">
                   ${e.currentTarget.responseText}
       <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div> `;
       
      //  if(e.currentTarget.responseText == 'Message Sent'){
      //   messForm.reset();
      //  }
    }
    
  };

  xhr.send(data);
}

// delete confirmation

for (let i = 0; i < deleBtn.length; i++) {
  deleBtn[i].addEventListener("click", () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "question",
      iconColor: "#d33",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleBtn[i].nextElementSibling.click();
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  });
}
