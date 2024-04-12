
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
                  <img src="${image.image}" alt="${image.image_name || image.name}" /> 
                  <button onClick="sendImageMessage('${image.name}')">Send</button>
                  <button onClick="deleteImage('${image.name}')" > Delete </button>
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
                if (response.status === 0) {
                    alert('CORS is blocking the request. Check server CORS configuration.');
                } else {
                    alert('Error');
                }
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
        tableHeader.innerHTML = '<th>Name</th><th>Phone Number</th><th>Action</th>';
        customerTable.appendChild(tableHeader);
  
        // Iterate over each customer and add them to the table
        data.customers.forEach(customer => {
          const row = document.createElement('tr');
  
          // Create table cells for name and phone number
          const nameCell = document.createElement('td');
          nameCell.textContent = customer.customer_name;
          row.appendChild(nameCell);
  
          const phoneCell = document.createElement('td');
          phoneCell.textContent = customer.phone_number;
          row.appendChild(phoneCell);
  
          // Create edit button with event listener
          const editButton = document.createElement('button');
          editButton.textContent = 'Edit';
          editButton.addEventListener('click', () => {
            // Replace phone and name cells with editable input fields
            phoneCell.innerHTML = `<input type="text" id="editPhone-${customer.phone_number}" value="${customer.phone_number}">`;
            nameCell.innerHTML = `<input type="text" id="editName-${customer.phone_number}" value="${customer.customer_name}">`;
  
            // Create save button next to edit button
            const saveButton = document.createElement('button');
            saveButton.textContent = 'Save';
            saveButton.addEventListener('click', () => {
              const editedPhone = document.getElementById(`editPhone-${customer.phone_number}`).value;
              const editedName = document.getElementById(`editName-${customer.phone_number}`).value;
  
              // Send edited data to server using editCustomer function
              editCustomer(customer.phone_number, editedPhone, editedName);
  
              // Restore original cell content and remove save button
              phoneCell.textContent = editedPhone;
              nameCell.textContent = editedName;
              row.removeChild(saveButton);
            });
  
            row.appendChild(saveButton);
          });
  
          // Create delete button (unchanged)
          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.addEventListener('click', () => {
            deleteCustomer(customer.phone_number);
          });
  
          // Add edit and delete buttons to the action cell
          const actionCell = document.createElement('td');
          actionCell.appendChild(editButton);
          actionCell.appendChild(deleteButton);
          row.appendChild(actionCell);
  
          customerTable.appendChild(row);
        });
      })
      .catch(error => {
        console.error(error);
      });
  }
  
  // Implement editCustomer function to send data to server
  // (This function is likely already defined elsewhere in your code)
  function editCustomer(existing_phone, phone, name) {
    if (confirm("Do you want to edit customer details?")) {
  
      const url = `https://kilimoappke.onrender.com/editCustomer`; 
  
      const requestBody = JSON.stringify({
        existing_phone,
        phone,
        name
      });
  
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: requestBody
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error editing customer: ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          alert(data.message || "Customer details edited successfully.");
        })
        .catch(error => {
          console.error('Error:', error);
          alert('An error occurred while editing customer details.');
        });
    } else {
      console.log("User clicked No ");
    }
  }
  
  
function deleteCustomer(customer_number){
    const result = window.confirm(`Do you want to continue?`);
    if (result) {
        fetch(`https://kilimoappke.onrender.com/deleteCustomer?customer_phone=${customer_number}`, {
            method: 'DELETE'
        })
       .then(response => response.json())
       .then(data => {
            alert(data.message);
        })
       .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the customer.');
        });
    } else {
        console.log("User clicked No ");
    }
}
function deleteImage(image_name){
    alert('Image ' + image_name )   
    const result = window.confirm("Do you want to continue?");
    if (result) {
        fetch(`https://kilimoappke.onrender.com/deleteImage?imageName=${image_name}`, {
            method: 'DELETE'
        })
       .then(response => response.json())
       .then(data => {
            alert(data.message);
        })
       .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the image.');
        });
    } else {
        console.log("User clicked No ");
    }
}

function toggleMenu() {
    var menu = document.querySelector('.nav-links');
    menu.classList.toggle('active');
}




