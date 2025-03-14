(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    try {
        new WOW().init();
    } catch (error) {
        // console.error('Error initializing WOW.js:', error);
    }


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.navbar').addClass('sticky-top shadow-sm');
        } else {
            $('.navbar').removeClass('sticky-top shadow-sm');
        }
    });
    
    // Dropdown on mouse hover
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";
    
    $(window).on("load resize", function() {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
            function() {
                const $this = $(this);
                $this.addClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "true");
                $this.find($dropdownMenu).addClass(showClass);
            },
            function() {
                const $this = $(this);
                $this.removeClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "false");
                $this.find($dropdownMenu).removeClass(showClass);
            }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        dots: true,
        loop: true,
        center: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });


    // Vendor carousel
    $('.vendor-carousel').owlCarousel({
        loop: true,
        margin: 45,
        dots: false,
        loop: true,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0:{
                items:2
            },
            576:{
                items:4
            },
            768:{
                items:6
            },
            992:{
                items:8
            }
        }
    });
    
})(jQuery);


$(document).ready(function () {
    // Keep track of loaded components
    let loadedComponents = 0;
    const totalComponents = 3;

    function onComponentLoad() {
        loadedComponents++;
        if (loadedComponents === totalComponents) {
            // Update active link only after all components are loaded
            let currentPath = window.location.pathname.split("/").pop().split(".")[0];
            updateActiveLink(currentPath);
        }
    }

    // Load reusable HTML files
    loadHTML('#navbar', 'html/nav.html', onComponentLoad);
    loadHTML('#nav', 'html/nav.html', onComponentLoad);
    loadHTML('#footer', 'html/footer.html', onComponentLoad);
});

function loadHTML(elementSelector, filePath, callback) {
    $.get(filePath, function (data) {
        $(elementSelector).html(data);
        if (callback) callback();
    }).fail(function (xhr, status, error) {
        console.error(`Error loading ${filePath}: ${status} - ${error}`);
        if (callback) callback(); // Call callback even on failure to maintain count
    });
}

// Update the active link based on the current page
function updateActiveLink(currentPath) {
    console.log("Current Path:", currentPath);

    if (currentPath === "" || currentPath === "/") currentPath = "index";

    currentPath = currentPath.split("#")[0];

    const pathToIdMap = {
        "index": "index",
        "about": "about",
        "service": "service",
        "portfolio": "portfolio",
        "contact": "contact",
        "history": "history"
    };

    const elementId = pathToIdMap[currentPath] || currentPath;
    const element = $("#" + elementId);

    if (element.length) {
        $(".navbar-nav .nav-link").removeClass("active");
        element.addClass("active");
    } else {
        // console.error(`Element with id '${elementId}' not found`);
    }
}
