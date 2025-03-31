

// project
document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('.project-tab');
    const contents = document.querySelectorAll('.project-content');

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', function () {
            // Remove active states
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Add active states
            this.classList.add('active');
            contents[index].classList.add('active');
        });
    });
});