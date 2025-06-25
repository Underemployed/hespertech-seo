$("#client-form").submit(function (e) {
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

    $.ajax({
        url: `

https://script.google.com/macros/s/AKfycbxJlv1NmFlwGK6TAzSaIe1etXk6FUJlU6vw6pvBSOu25oDbYEmUPDJ6P0JBL32C1L6W/exec


        `.trim(),
        method: "POST",
        data: JSON.stringify(data),
        success: function (response) {
            // console.log("Success:", response);
            $(".loader-text").html("Message sent successfully");
            $(".send-div").addClass("success");
            $(".send-div").fadeOut(2000);
        },
        error: function (err) {
            $(".loader-text").html("An error occurred while sending the message.<br>Please try again later.");
            $(".send-div").fadeOut(2000);
            $(".send-div").addClass("error");

        }
    });
});
