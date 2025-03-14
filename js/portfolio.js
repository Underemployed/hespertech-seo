

document.querySelectorAll('.project-header').forEach(header => {
    header.addEventListener('click', () => {
        const card = header.parentElement;
        const isActive = card.classList.contains('active');

        // Close all cards first
        document.querySelectorAll('.project-card').forEach(c => c.classList.remove('active'));

        // Toggle clicked card if not already active
        if (!isActive) {
            card.classList.add('active');
            // Scroll to the card smoothly
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
});
