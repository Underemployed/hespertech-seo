document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.checkbox-item').forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const label = item.querySelector('label');

        // Prevent double toggling from <label for="">
        if (label && checkbox) {
            label.removeAttribute('for');
        }

        item.addEventListener('click', function (e) {
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
            }
        });
    });
});

  

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

