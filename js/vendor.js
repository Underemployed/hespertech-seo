    document.getElementById('vendor-form').addEventListener('submit', function (e) {
        e.preventDefault();

    // Basic form validation
    const requiredFields = this.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
        field.style.borderColor = '#dc3545';
    isValid = false;
        } else {
        field.style.borderColor = '#e9ecef';
        }
    });

    if (isValid) {
        // Here you would typically send the form data to your server
        alert('Registration submitted successfully! We will contact you soon.');
    this.reset();
    } else {
        alert('Please fill in all required fields.');
    }
});

