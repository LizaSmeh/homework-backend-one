document.addEventListener("DOMContentLoaded", () => {
  const submitButton = document.getElementById("submitButton");
  const successMessage = document.getElementById("successMessage");

  if (successMessage) {
    successMessage.style.display = "none";
  } 

  submitButton.addEventListener('click', ()=>{
    submitForm.reset();
    successMessage.style.display = "block";



  })
    
})