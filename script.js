   // Function to handle successful login
   function onLogin(username) {
    document.getElementById('username').textContent = username; // Set username
    document.getElementById('profile-icon').src = 'path/to/user/icon.png'; // Set profile icon if needed
}

document.addEventListener('DOMContentLoaded', function() {
    const signInBtn = document.getElementById('signInBtn');
    const signInModal = document.getElementById('signInModal');
    const closeModal = document.getElementById('closeModal');
    const logInBtn = document.getElementById('logInBtn');
    const createAccountBtn = document.getElementById('createAccountBtn');
    const continueGoogleBtn = document.querySelector('.continue-google');
    const initialOptions = document.getElementById('initialOptions');
    const loginForm = document.getElementById('loginForm');
    const loginId = document.getElementById('loginId'); // Input for email
    const loginPassword = document.getElementById('loginPassword'); // Input for password
    const submitBtn = document.getElementById('submitBtn');
    const accountSection = document.getElementById('accountSection');
    const userNameSpan = document.getElementById('userName');

    // Check if elements are correctly selected
    if (!signInModal || !signInBtn || !closeModal || !logInBtn || !createAccountBtn || !continueGoogleBtn || !initialOptions || !loginForm || !loginId || !loginPassword) {
        console.error('Some elements are not found');
        return;
    }

    console.log("Elements found and ready for events.");

    // Function to show modal and reset to initial options
    function showModal() {
        console.log("Showing modal...");
        signInModal.style.display = 'flex'; // Show modal
        initialOptions.style.display = 'block';
        loginForm.style.display = 'none'; // Initially hide login form
        signInModal.setAttribute('aria-hidden', 'false');
        signInBtn.setAttribute('aria-expanded', 'true');
    }

    // Function to hide modal
    function hideModal() {
        console.log("Hiding modal...");
        signInModal.style.display = 'none'; // Hide modal
        signInModal.setAttribute('aria-hidden', 'true');
        signInBtn.setAttribute('aria-expanded', 'false');
        signInBtn.focus(); // Return focus to Sign In button for accessibility
    }

    // Show the modal when Sign In button is clicked
    signInBtn.addEventListener('click', showModal);

    // Hide the modal when the close button is clicked
    closeModal.addEventListener('click', hideModal);

    // Hide the modal when clicking outside the modal content
    window.addEventListener('click', function(event) {
        if (event.target === signInModal) {
            console.log("Clicked outside modal content.");
            hideModal();
        }
    });

    // Handle Log In button click
    logInBtn.addEventListener('click', function() {
        console.log("Log In button clicked.");

        // Show the login form and hide initial options
        initialOptions.style.display = 'none';
        loginForm.style.display = 'block'; // Show login form

        // Clear input fields for a fresh start
        loginId.value = '';
        loginPassword.value = '';
    });

    // Handle actual submission of the login form
    document.getElementById('submitLogin').addEventListener('click', async function() {
        console.log("Submit Login clicked.");

        const username = loginId.value; // Get username from input
        const password = loginPassword.value; // Get password from input

        try {
            // Send a POST request to the signin route
            const response = await fetch('http://localhost:3000/login', { // Replace with your server URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();

            if (response.ok) {
                localStorage.setItem('token', result.token); // Store the JWT token
                alert(result.message); // Show success message

                   // Call onLogin with the username after a successful login
                   onLogin(username); 

    
                // Redirect to homepage
                window.location.href = "index.html"; 
           
           
            } else {
                // Handle errors
                alert(result.message || 'Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
            //alert('An error occurred during login. Please try again.');00000000000000000
        }
        
  
        
    });

    // Handle Create Account button click (redirect to the create account page)
    createAccountBtn.addEventListener('click', function() {
        console.log("Create Account button clicked. Redirecting to Create Account page.");
        window.location.href = 'create-account.html';
    });

    // Handle Continue with Google button click
    continueGoogleBtn.addEventListener('click', function() {
        console.log("Continue with Google clicked.");
        initialOptions.style.display = 'block';
        loginForm.style.display = 'none';
        // Here, you can add the logic for Google Sign-In if you have it set up
    });
});
