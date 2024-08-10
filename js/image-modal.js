// Create this new JavaScript file

document.addEventListener('DOMContentLoaded', function() {
  // Create modal element
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <span class="close">&times;</span>
    <img class="modal-content" id="modalImage">
  `;
  document.body.appendChild(modal);

  const modalImg = document.getElementById("modalImage");
  const closeBtn = modal.querySelector('.close');

  // Get all images inside articles
  const images = document.querySelectorAll('.article img');

  images.forEach(img => {
    img.addEventListener('click', function() {
      modal.classList.add('show');
      modalImg.src = this.src;
    });
  });

  // Close modal when clicking the close button or outside the image
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function(event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  function closeModal() {
    modal.classList.remove('show');
  }

  // Close modal with Escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      closeModal();
    }
  });
});
