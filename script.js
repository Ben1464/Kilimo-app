
async function uploadImage() {
    const fileInput = document.getElementById('imageInput');
    const image_name = document.getElementById('image_name').value; // Get the value of the input field
    
    const image = fileInput.files[0];
    if (!image) {
        alert('Please select an image to upload');
        return; // Handle missing image selection
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
        
    alert('Uploading');
        const response = await fetch(`https://kilimoappke.onrender.com/addImage?image_name=${encodeURIComponent(image_name)}`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Error uploading image: ${response.statusText}`);
        }

        console.log('Image uploaded successfully');
        // Reload images after upload or display a success message
    } catch (error) {
        console.error('Error uploading image:', error);
        // Handle upload errors (e.g., display error message to user)
    }
}


function displayUploadedImages() {
    const imageList = document.getElementById('imageList');
    imageList.innerHTML = ''; 
    // Fetch and display uploaded images
    fetch('https://kilimoappke.onrender.com/viewImages')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching images');
            }
            return response.json();
        })
        .then(data => {
            const fragment = document.createDocumentFragment();
          
            // Check if data is an array
            if (!Array.isArray(data)) {
              console.error("Error: Expected data to be an array of images.");
              return;
            }
          
            data.forEach(image => {
              const html = `
                  <p>Name: ${image.name}</p>
                  <img src="${image.image}" alt="${image.image_name || image.name}" /> <button onClick="sendImageMessage('${image.name}')">Send</button>
                  <button> Delete </button>
              `;
          
              // Create actual DOM elements from the HTML string
              const imageItem = document.createElement('div');
              imageItem.classList.add('image-item');
              imageItem.innerHTML = html;
          
              fragment.appendChild(imageItem);
            });
          
            // Check if imageList element exists before appending
            const imageList = document.getElementById('imageList');
            if (imageList) {
              imageList.appendChild(fragment);
            } else {
              console.warn("Warning: Could not find element with ID 'imageList'.");
            }
          })
          .catch(error => {
            console.error(error);
          });
          
}
function sendImageMessage(imageName){
    const result = window.confirm("Do you want to continue?");
if (result) {
    } else {
    console.log("User clicked No or closed the dialog. Cancel the action.");
    return;
}
    // alert('sending image message to ' + imageName);
    fetch(`https://kilimoappke.onrender.com/sendMessage?imageName=${imageName}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // body: imageName
    })
   .then(response => response.json())
   .then(data => {
        console.log(data.message);
    })
}
function addCustomer() {
    const customer_name = document.getElementById('name').value;
    const phone_number = document.getElementById('phoneNumber').value;

    // Send a POST request to add customer
    fetch('https://kilimoappke.onrender.com/addCustomer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ customer_name, phone_number })
    })
        .then(response => {
            if (!response.ok) {
                console.log("Error adding customer")
                throw new Error('Error adding customer');
            }
            return response.json();
            // console.log('Customer added successfully');
        })
        .then(data => {
            alert('Customer added successfully')
            document.getElementById('name').value =""
            document.getElementById('phoneNumber').value =""
        
            console.log('Customer added successfully:', data.message);
          })
        .catch(error => {
            console.error(error);
        });
}

function viewCustomers() {
    // Fetch the list of added customers
    fetch('https://kilimoappke.onrender.com/viewCustomers')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching customers');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message);
            // Display the list of customers
            const customerTable = document.getElementById('customerTable');
            customerTable.innerHTML = ''; // Clear previous entries
        
            // Create table header
            const tableHeader = document.createElement('tr');
            tableHeader.innerHTML = '<th>Name</th><th>Phone Number</th> <th>Action</th>';
            customerTable.appendChild(tableHeader);
        
            // Iterate over each customer and add them to the table
            data.customers.forEach(customer => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${customer.customer_name}</td><td>${customer.phone_number} </td> <td>  <button> Edit </button> <button> delete </button> </td>`;
                customerTable.appendChild(row);
            });
        })
        .catch(error => {
            console.error(error);
        });
        ;
}



function toggleMenu() {
    var menu = document.querySelector('.nav-links');
    menu.classList.toggle('active');
}




