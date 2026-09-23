const imageInput = document.querySelector("#images");
const imageError = document.querySelector("#image-error");
const previewContainer = document.querySelector("#image-preview-container");

if (imageInput && imageError && previewContainer) {
  const renderImagePreviews = () => {
    imageError.innerText = "";
    previewContainer.innerHTML = "";
    const files = Array.from(imageInput.files || []);
    const oversized = files.find(file => file.size > 5 * 1024 * 1024);

    if (files.length > 10) imageError.innerText = "Choose no more than 10 photos at a time.";
    else if (oversized) imageError.innerText = `${oversized.name} is larger than 5 MB.`;
    if (files.length > 10 || oversized) {
      imageInput.value = "";
      return;
    }

    files.forEach((file, index) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("image-preview");
      const img = document.createElement("img");
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;
      img.alt = `Selected photo ${index + 1}: ${file.name}`;
      img.addEventListener("load", () => URL.revokeObjectURL(objectUrl), { once: true });

      const removeBtn = document.createElement("button");
      removeBtn.innerText = "×";
      removeBtn.type = "button";
      removeBtn.classList.add("remove-image");
      removeBtn.setAttribute("aria-label", `Remove ${file.name}`);
      removeBtn.addEventListener("click", () => {
        const remainingFiles = files.filter((_, fileIndex) => fileIndex !== index);
        const transfer = new DataTransfer();
        remainingFiles.forEach(remainingFile => transfer.items.add(remainingFile));
        imageInput.files = transfer.files;
        renderImagePreviews();
      });

      wrapper.append(img, removeBtn);
      previewContainer.appendChild(wrapper);
    });
  };
  imageInput.addEventListener("change", renderImagePreviews);
}

const galleryMain = document.querySelector("#show-gallery-main");
if (galleryMain) {
  document.querySelectorAll(".show-gallery-thumb").forEach(thumb => {
    thumb.addEventListener("click", () => {
      galleryMain.src = thumb.dataset.photoUrl;
      galleryMain.alt = thumb.dataset.photoAlt;
      document.querySelectorAll(".show-gallery-thumb").forEach(item => {
        item.classList.toggle("active", item === thumb);
        item.setAttribute("aria-pressed", item === thumb ? "true" : "false");
      });
    });
  });
}

// Dismiss flash messages automatically, while allowing time to read or pause on hover.
document.querySelectorAll(".flash-message").forEach(message => {
  const timeout = Number(message.dataset.flashTimeout) || 5000;
  const progress = message.querySelector(".flash-progress");
  let remaining = timeout;
  let startedAt = Date.now();
  let timer;

  const dismiss = () => {
    if (window.bootstrap?.Alert) bootstrap.Alert.getOrCreateInstance(message).close();
    else message.remove();
  };
  const start = () => {
    startedAt = Date.now();
    message.classList.remove("flash-paused");
    if (progress) progress.style.animationDuration = `${remaining}ms`;
    timer = window.setTimeout(dismiss, remaining);
  };
  const pause = () => {
    window.clearTimeout(timer);
    remaining = Math.max(0, remaining - (Date.now() - startedAt));
    message.classList.add("flash-paused");
  };

  message.addEventListener("mouseenter", pause);
  message.addEventListener("mouseleave", () => { if (remaining > 0) start(); });
  message.addEventListener("focusin", pause);
  message.addEventListener("focusout", event => {
    if (!message.contains(event.relatedTarget) && remaining > 0) start();
  });
  start();
});

// Bootstrap form validation
(() => {
  'use strict';
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
})();
