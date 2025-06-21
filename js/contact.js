$("#client-form").submit(function (e) {
    e.preventDefault();
    const formData = $(this).serializeArray();
    const data = {};

    $(formData).each(function (index, obj) {
        data[obj.name] = obj.value.trim();
    });

    console.log("Sending:", data);

    $.ajax({
        url: `

https://script.google.com/macros/s/AKfycbxJlv1NmFlwGK6TAzSaIe1etXk6FUJlU6vw6pvBSOu25oDbYEmUPDJ6P0JBL32C1L6W/exec

        `.trim(),
        method: "POST",
        data: JSON.stringify(data),
        success: function (response) {
            console.log("Success:", response);
            alert("Message sent successfully!");
        },
        error: function (err) {
            console.error("Error:", err);
            alert("An error occurred while sending the message.");
        }
    });
});
