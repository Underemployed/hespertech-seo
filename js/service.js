$("#service-form").submit(function (e) {
    e.preventDefault();

    $(".send-div").removeClass("error");
    $(".send-div").removeClass("success");

    $(".send-div").show();
    $(".loader-text").html("Sending...<br>Please wait...");
    const formData = $(this).serializeArray();
    const data = {};

    $(formData).each(function (index, obj) {
        data[obj.name] = obj.value.trim();
    });

    // console.log("Sending:", data);

    console.log("Sending:", data);

    $.ajax({
        url: `
        
https://script.google.com/macros/s/AKfycbx-PPZmb9BvVfvvgoBsnATLk5EZSxEn9Xjofh8Atyoxv4NFiEMi4bgbZRw7rCuK7me9/exec

        `.trim(),
        method: "POST",
        data: JSON.stringify(data),
        success: function (response) {


            if (response.result === "error") {
                console.log("Error", response);
                $(".loader-text").html("An error occurred while submitting the application.<br>Please try again later.");
                $(".send-div").addClass("error");
                $(".send-div").fadeOut(3000);
            } else {
                // susccess
                console.log("Success:", response);
                $(".loader-text").html("Application submitted successfully!");
                $(".send-div").addClass("success");
                $(".send-div").fadeOut(3000);
        

            }


        },
        error: function (err) {
            console.log("Error", err);
            $(".loader-text").html("An error occurred while submitting the application.<br>Please try again later.");
            $(".send-div").addClass("error");
            $(".send-div").fadeOut(3000);
        }
    });
});
