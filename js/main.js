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
        new WOW({
            offset: 120
        }).init();
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

    $(window).on("load resize", function () {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
                function () {
                    const $this = $(this);
                    $this.addClass(showClass);
                    $this.find($dropdownToggle).attr("aria-expanded", "true");
                    $this.find($dropdownMenu).addClass(showClass);
                },
                function () {
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
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
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
            0: {
                items: 1
            },
            576: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            }
        }
    });

    // Vendor carousel
    $('.vendor-carousel').owlCarousel({
        loop: true,
        margin: 45,
        dots: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0: {
                items: 2
            },
            576: {
                items: 4
            },
            768: {
                items: 6
            },
            992: {
                items: 8
            }
        }
    });

})(jQuery);

// ---------------------- DOM READY ------------------------

$(document).ready(function () {
    let loadedComponents = 0;
    const totalComponents = 5;

    function onComponentLoad() {
        loadedComponents++;
        if (loadedComponents === totalComponents) {
            const currentPath = window.location.pathname.split("/").pop().split(".")[0] || "index";
            updateActiveLink(currentPath);
        }
    }

    // Load reusable components
    loadHTML('#navbar', 'html/nav.html', function () {
        onComponentLoad();
        initLogoSwap(); // Initialize logo switching after navbar is loaded
    });

    loadHTML('#timeline', 'html/timeline.html', onComponentLoad);
    loadHTML('#nav', 'html/nav.html', onComponentLoad);
    loadHTML('#client_logo', 'html/client_logo.html', onComponentLoad);
    loadHTML('#footer', 'html/footer.html', onComponentLoad);

    // Project carousel
    $('.project-carousel').owlCarousel({
        center: true,
        loop: true,
        margin: 30,
        responsiveClass: true,
        nav: true,
        dots: true,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0: { items: 1 },
            576: { items: 1 },
            768: { items: 2 },
            992: { items: 3 },
            1200: { items: 3 }
        },
        navText: [
            '<i class="fa fa-chevron-left"></i>',
            '<i class="fa fa-chevron-right"></i>'
        ]
    });
});

// ------------------ HELPER FUNCTIONS ------------------

function loadHTML(elementSelector, filePath, callback) {
    $.get(filePath, function (data) {
        $(elementSelector).html(data);
        if (callback) callback();
    }).fail(function (xhr, status, error) {
        console.error(`Error loading ${filePath}: ${status} - ${error}`);
        if (callback) callback(); // still call to avoid hanging
    });
}

function updateActiveLink(currentPath) {
    const pathToIdMap = {
        "index": "index",
        "about": "about",
        "service": "service",
        "portfolio": "portfolio",
        "contact": "contact",
        "job": "job"
    };

    const elementId = pathToIdMap[currentPath] || currentPath;
    const element = $("#" + elementId);

    if (element.length) {
        $(".navbar-nav .nav-link").removeClass("active");
        element.addClass("active");
    }
}

// ------------------ LOGO SWAP FUNCTION ------------------

function initLogoSwap() {
    function swapLogo() {
        const scroll = document.documentElement.scrollTop || document.body.scrollTop;
        const width  = window.innerWidth;
        const logo   = document.getElementById('navbar-logo');
        if (!logo) return;

        if (scrollY > 50 || (width > 400 && width < 1100)) {
                    logo.src = "img/logo/blue_text_logo.png";
                } else if (width < 400) {
                    logo.src = "img/logo/hespertech-logo-min.png";
                }
                else if(width > 400 && width < 1100){
                    logo.src = "img/logo/blue_text_logo.png";
                }
                else
                 {
                    logo.src = "img/logo/logo_3.30.png";
                }
    }

    window.addEventListener('scroll',  swapLogo, { passive: true });
    window.addEventListener('resize', swapLogo, { passive: true });
    swapLogo();          // initial run
}
