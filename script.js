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
            // Reload images after upload
            displayUploadedImages();
        })
        .catch(error => {
            console.error(error);
        });
}

function displayUploadedImages() {
    // Fetch and display uploaded images
    fetch('/api/images')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching images');
            }
            return response.json();
        })
        .then(data => {
            const imageList = document.getElementById('imageList');
            imageList.innerHTML = ''; // Clear previous entries

            data.forEach(image => {
                const imageButton = document.createElement('button');
                imageButton.classList.add('btn', 'btn-secondary', 'image-item');
                const img = document.createElement('img');
                img.src = image.url; // Assuming each image object has a 'url' property
                img.alt = 'Image';
                img.classList.add('uploaded-image');
                
                // Add click event listener to select/deselect image
                img.addEventListener('click', function() {
                    if (imageButton.classList.contains('selected')) {
                        imageButton.classList.remove('selected');
                    } else {
                        imageButton.classList.add('selected');
                    }
                });

                imageButton.appendChild(img);

                imageList.appendChild(imageButton);
            });
        })
        .catch(error => {
            console.error(error);
        });
}

function viewAllImages() {
    // Fetch and display uploaded images
    fetch('/api/images')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching images');
            }
            return response.json();
        })
        .then(data => {
            // Create a gallery view for all images
            const galleryView = document.createElement('div');
            galleryView.classList.add('gallery-view');

            data.forEach(image => {
                const img = document.createElement('img');
                img.src = image.url; // Assuming each image object has a 'url' property
                img.alt = 'Image';
                img.classList.add('uploaded-image');
                galleryView.appendChild(img);
            });

            // Display gallery view in a modal or new page
            // For example, you can use a lightbox library like Fancybox or build a custom modal
            // Here, I'll just append the gallery view to the body
            document.body.appendChild(galleryView);
        })
        .catch(error => {
            console.error(error);
        });
}

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

function viewCustomers() {
    // Fetch the list of added customers
    fetch('/api/customers')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching customers');
            }
            return response.json();
        })
        .then(data => {
            // Display the list of customers
            const customerList = document.getElementById('customerList');
            customerList.innerHTML = ''; // Clear previous entries

            data.forEach(customer => {
                const listItem = document.createElement('li');
                listItem.textContent = `Name: ${customer.name}, Phone Number: ${customer.phoneNumber}`;
                customerList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error(error);
        });
}

function sendSelectedImages() {
    const selectedImages = document.querySelectorAll('.image-item.selected img');
    const imageUrls = Array.from(selectedImages).map(img => img.src);
    
    // Retrieve phone numbers of selected customers
    const selectedCustomerPhoneNumbers = Array.from(document.querySelectorAll('.image-item.selected'))
        .map(item => item.dataset.phoneNumber);

    // Fetch API endpoint to send images to customers
    fetch('/api/sendImagesToCustomers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phoneNumbers: selectedCustomerPhoneNumbers, imageUrls: imageUrls })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error sending images to customers');
        }
        console.log('Images sent to customers successfully');
    })
    .catch(error => {
        console.error(error);
    });
}

function toggleMenu() {
    var menu = document.querySelector('.nav-links');
    menu.classList.toggle('active');
}



