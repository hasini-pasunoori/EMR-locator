// Authentication handling with OTP verification

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const role = document.getElementById('loginRole').value;

            if (!email || !password || !role) {
                showToast('Please fill in all fields including role', 'error');
                return;
            }

            try {
                const response = await fetch('/auth/signin/send-otp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password, role })
                });

                const data = await response.json();

                if (data.success) {
                    showToast(data.message, 'success');
                    // Close modal and redirect to OTP verification
                    const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                    modal.hide();
                    window.location.href = '/verify-otp?type=signin';
                } else {
                    showToast(data.message, 'error');
                }
            } catch (error) {
                showToast('Network error. Please try again.', 'error');
            }
        });
    }

    // Handle register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const role = document.getElementById('userRole').value;
            const termsAgree = document.getElementById('termsAgree').checked;

            if (!name || !email || !password || !confirmPassword || !role) {
                showToast('Please fill in all fields', 'error');
                return;
            }

            if (password !== confirmPassword) {
                showToast('Passwords do not match', 'error');
                return;
            }

            if (password.length < 6) {
                showToast('Password must be at least 6 characters', 'error');
                return;
            }

            if (!termsAgree) {
                showToast('Please agree to the terms and conditions', 'error');
                return;
            }

            try {
                const response = await fetch('/auth/signup/send-otp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, password, role })
                });

                const data = await response.json();

                if (data.success) {
                    showToast(data.message, 'success');
                    // Close modal and redirect to OTP verification
                    const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
                    modal.hide();
                    window.location.href = '/verify-otp?type=signup';
                } else {
                    showToast(data.message, 'error');
                }
            } catch (error) {
                showToast('Network error. Please try again.', 'error');
            }
        });
    }
});

// Toast notification function
function showToast(message, type = 'success') {
    const toast = document.getElementById('authToast');
    const toastMessage = document.getElementById('toastMessage');
    const toastHeader = toast.querySelector('.toast-header');
    
    // Update message
    toastMessage.textContent = message;
    
    // Update styling based on type
    if (type === 'error') {
        toastHeader.className = 'toast-header bg-danger text-white';
        toastHeader.querySelector('i').className = 'fas fa-exclamation-circle me-2';
    } else {
        toastHeader.className = 'toast-header bg-success text-white';
        toastHeader.querySelector('i').className = 'fas fa-check-circle me-2';
    }
    
    // Show toast
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}