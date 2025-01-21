document.getElementById('petForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Get form data
    const petData = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        gender: document.getElementById('gender').value,
        type: document.getElementById('type').value,
        description: document.getElementById('description').value,
        imageUrl: document.getElementById('imageUrl').value || "default_image_url_here",  // Default image if not provided
        location: {
            country: document.getElementById('country').value,
            state: document.getElementById('state').value,
            city: document.getElementById('city').value,
        },
        listedBy: "user-id-placeholder", // Replace with the actual logged-in user ID
    };

    // Validation for required fields (can be expanded as necessary)
    if (!petData.name || !petData.age || !petData.gender || !petData.type || !petData.description) {
        alert("Please fill in all required fields.");
        return;
    }

    // Attempt to submit the data
    try {
        const response = await fetch('http://localhost:5000/api/pets/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(petData),
        });

        if (response.ok) {
            const result = await response.json();
            alert(result.message); // Assuming the server sends a success message
            document.getElementById('petForm').reset(); // Optionally reset the form after submission
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);  // Display the error message
        }
    } catch (err) {
        console.error('Error listing pet:', err);
        alert('An error occurred while listing the pet.');
    }
});
