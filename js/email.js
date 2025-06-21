const headers = {
    emailSheet: ["Name", "Email", "Subject", "Body", "Date", "Time"],
    error: ["Date", "Error Message"]
};

// const mygmail = getColumn('CONFIG', 'Email')[0]; // getting variables from sheet
const mygmail = Session.getActiveUser().getEmail();
const sheetName = "Sheet1";

// just for like knowing which excel
const url = "https://docs.google.com/spreadsheets/d/1acQ7qOlcUXHxdZ1QxOwBkcVVMxc_KsTtXM1jzh4LGYQ/edit?gid=0#gid=0"



function testEmailTemplatesSendToSelf() {
    const testName = "john doe";
    const testEmail = "johndoe@example.com";
    const testSubject = "Product Inquiry";
    const testMessage = "I would like to know more about your product pricing and availability.";

    const clientHTML = createClientEmailTemplate(testName, testSubject, testMessage);
    const inboxHTML = createInboxEmailTemplate(testName, testSubject, testMessage, testEmail);

    const myEmail = Session.getActiveUser().getEmail();

    // // Send the "client" styled email
    // MailApp.sendEmail({
    //   to: myEmail,
    //   subject: "TEST: Client Email Template",
    //   htmlBody: clientHTML
    // });

    // Send the "inbox" styled email
    MailApp.sendEmail({
        to: myEmail,
        subject: "TEST: Inbox Email Template",
        htmlBody: inboxHTML
    });
}









function createSuccessResponse() {
    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
        .setMimeType(ContentService.MimeType.JSON);
}

function createErrorResponse(err) {
    let errorSheet = selectOrCreateSheet("Errors");
    let dateTime = new Date();
    let errorInfo = [dateTime.toLocaleString(), err.message];
    if (errorSheet.getLastRow() === 0) errorSheet.appendRow(headers.error);
    errorSheet.appendRow(errorInfo);
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": err.message }))
        .setMimeType(ContentService.MimeType.JSON);
}

// Function to get a column from a sheet with trimming
function getColumn(sheetName, column, url = null) {
    let sheet = selectOrCreateSheet(sheetName, url);
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    // Normalize headers by trimming and lowering case
    const lowerHeaders = headers.map(header => header.toString().trim().toLowerCase());
    const lowerColumn = column.trim().toLowerCase();
    const columnIndex = lowerHeaders.indexOf(lowerColumn);

    if (columnIndex === -1) {
        throw new Error(`Header "${column}" not found in sheet "${sheetName}"`);
    }

    const columnValues = sheet.getRange(2, columnIndex + 1, sheet.getLastRow() - 1, 1).getValues();
    const flattenedValues = columnValues.map(row => row[0]?.toString().trim() ?? '');

    return flattenedValues;
}

function createClientEmailTemplate(name, subject, message) {
    name = name.replace(/\b(\w)/g, (s) => s.toUpperCase()).split(" ")[0];

    return `
    
Hey ${name},

Thanks for contacting Hespertech! We've received your message regarding:

${subject}

Here's a copy of what you sent us:
"${message}"

We'll get back to you as soon as possible.

Hespertech · Innovate Beyond Limits

    `.trim();
}


function createInboxEmailTemplate(name, subject, message, email) {
    name = name.replace(/\b(\w)/g, (s) => s.toUpperCase());

    return `
        From: ${name}
        Email: ${email}
        Subject: ${subject}

        Message:
        ${message}

        Hespertech - Contact Form Submission
    `.trim();
}

function validateInput(e) {
    if (!e.postData.contents) throw new Error("No data provided");
    let obj = JSON.parse(e.postData.contents);
    if (!obj.name || !obj.email || !obj.subject || !obj.body) throw new Error("Missing required fields");

    for (let key in obj) {
        if (typeof obj[key] === 'string') {
            obj[key] = obj[key].trim();
        }
    }

    return obj;
}

// Function to select or create a sheet
function selectOrCreateSheet(sheetName, url = null) {
    let app;
    if (url) {
        app = SpreadsheetApp.openByUrl(url);
    } else {
        app = SpreadsheetApp.getActiveSpreadsheet();
    }
    let sheet = app.getSheetByName(sheetName.trim());
    return sheet ? sheet : app.insertSheet(sheetName.trim());
}


function appendToSheet(dataObject, sheet) {
    if (sheet.getLastRow() === 0) sheet.appendRow(Object.keys(dataObject));
    sheet.appendRow(Object.values(dataObject));
}

function doPost(e) {
    try {
        // Validate input using your existing function
        const obj = validateInput(e);

        // Add date and time fields
        const now = new Date();
        obj["Date"] = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd");
        obj["Time"] = Utilities.formatDate(now, Session.getScriptTimeZone(), "HH:mm:ss");

        // Select or create the main sheet and append the data
        const mainSheet = selectOrCreateSheet(sheetName);
        appendToSheet(obj, mainSheet);

        // Create confirmation email content
        const htmlBody = createClientEmailTemplate(obj.name, obj.subject, obj.body);

        // Send the confirmation email
        MailApp.sendEmail({
            to: obj.email,
            subject: `From: ${obj.name} - ${obj.subject}`,
            htmlBody: htmlBody
        });
        const inboxMail = createInboxEmailTemplate(obj.name, obj.subject, obj.body, obj.email);

        // Send the confirmation email
        MailApp.sendEmail({
            to: mygmail,
            subject: `From: ${obj.name} - ${obj.subject}`,
            htmlBody: inboxMail
        });



        // Optionally store email metadata in a tracking sheet
        const emailSheet = selectOrCreateSheet("Email");
        const trackingData = {
            Name: obj.name,
            Email: obj.email,
            Subject: obj.subject,
            Body: obj.body,
            Date: obj.Date,
            Time: obj.Time
        };
        appendToSheet(trackingData, emailSheet);



        // Return success response
        return createSuccessResponse();


    } catch (err) {
        return createErrorResponse(err);
    }
}




function doGet(e) {
    return HtmlService.createHtmlOutput("Were you bored ?<br>Well, I was too!<br>So I made this page.<br>Have a nice day :)");
}