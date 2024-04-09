function addCustomer() {
    const name = document.getElementById('name').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
  
    // Send a POST request to add customer
    fetch('/api/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, phoneNumber })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error adding customer');
      }
      console.log('Customer added successfully');
    })
    .catch(error => {
      console.error(error);
    });
  }
  
  function uploadImage() {
    const fileInput = document.getElementById('imageInput');
    const image = fileInput.files[0];
    const formData = new FormData();
    formData.append('image', image);
  
    // Send a POST request to upload image
    fetch('/api/images', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error uploading image');
      }
      console.log('Image uploaded successfully');
      // Add logic to display uploaded images
    })
    .catch(error => {
      console.error(error);
    });
  }
  
  function uploadBulkImages() {
    const fileInput = document.getElementById('bulkImageInput');
    const images = fileInput.files;
    const formData = new FormData();
    
    for (let i = 0; i < images.length; i++) {
      formData.append('images[]', images[i]);
    }
    
    // Send a POST request to upload images in bulk
    fetch('/api/bulk/images', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error uploading images');
      }
      console.log('Images uploaded successfully');
      // Add logic to display uploaded images
    })
    .catch(error => {
      console.error(error);
    });
  }
  