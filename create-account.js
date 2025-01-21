// create-account.js

document.addEventListener('DOMContentLoaded', function () {
    const userTypeSelect = document.getElementById('user-type');
    const organizationFields = document.getElementById('organization-fields');
    const registrationForm = document.getElementById('registrationForm');

    // Check if elements are correctly selected
    if (!userTypeSelect || !organizationFields || !registrationForm) {
        console.error('Required elements not found');
        return;
    }

    // Show or hide organization fields based on user type selection
    userTypeSelect.addEventListener('change', function () {
        if (userTypeSelect.value === 'organization') {
            organizationFields.classList.remove('hidden');
        } else {
            organizationFields.classList.add('hidden');
        }
    });

    // Handle form submission
    registrationForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(registrationForm);
        const data = Object.fromEntries(formData.entries());

        // Basic client-side validation for password confirmation
        if (data.password !== data['confirm-password']) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/register", { // Ensure the correct URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: data.username,
                    email: data.email,
                    password: data.password,
                    userType: data['user-type'],
                    organizationName: data['organization-name'] || '',
                    establishmentYear: data['establishment-year'] || '',
                    organizationSocialMedia: data['organization-social-media'] || '',
                    organizationDescription: data['organization-description'] || '',
                    country: data.country,
                    state: data.state,
                    city: data.city,
                    pincode: data.pincode,
                }),
            });

            if (response.ok) {
                alert("Account created successfully!");
                registrationForm.reset(); // Reset the form after successful submission
            } else {
                // Check for a specific error response structure
                const errorData = await response.json();
                alert("Error creating account: " + (errorData.message || "Unknown error occurred."));
            }
        } catch (error) {
            console.error('Error:', error);
            alert("There was a problem creating your account. Please try again.");
        }
    });
});
