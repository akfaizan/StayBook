const imageInput = document.querySelector("#image");
const imageError = document.querySelector("#image-error");
const previewContainer = document.querySelector("#image-preview-container");

imageInput.addEventListener("change", function () {

    const file = this.files[0];

    imageError.innerText = "";
    previewContainer.innerHTML = "";

    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5 MB

    // Check image size first
    if (file.size > maxSize) {

        imageError.innerText = "Image size must be less than 5 MB.";

        this.value = "";

        return;
    }

    // If size is valid → create preview
    const wrapper = document.createElement("div");
    wrapper.classList.add("image-preview");

    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);

    const removeBtn = document.createElement("button");
    removeBtn.innerText = "X";
    removeBtn.type = "button";
    removeBtn.classList.add("remove-image");

    removeBtn.addEventListener("click", function () {
        imageInput.value = "";
        previewContainer.innerHTML = "";
        imageError.innerText = "";
    });

    wrapper.appendChild(img);
    wrapper.appendChild(removeBtn);

    previewContainer.appendChild(wrapper);
});


//BOOTSTRAP FORM VALIDATOR
// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()


