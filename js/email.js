const headers = {
    emailSheet: ["Name", "Email", "Subject", "Body", "Date", "Time"],
    error: ["Date", "Error Message"]
};

// const mygmail = getColumn('CONFIG', 'Email')[0]; // getting variables from sheet
const mygmail = Session.getActiveUser().getEmail();
const sheetName = "Sheet1";

// just for like knowing which excel
const url = "https://docs.google.com/spreadsheets/d/1acQ7qOlcUXHxdZ1QxOwBkcVVMxc_KsTtXM1jzh4LGYQ/edit?gid=0#gid=0"



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
    
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Hespertech Acknowledgement</title>

      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f1117; color: #f0f0f0; margin: 0; padding: 0;">
        <div class="container" style="background-color: #1a1c23; margin: 0 auto; padding: 40px; max-width: 800px; min-height: 100vh; box-sizing: border-box;">
          <h2 style="color: #58d68d;">Hey ${name},</h2>
          <p>Thanks for contacting <span class="highlight" style="color: #f1c40f;">Hespertech</span>! We've received your message regarding:</p>
          <p><strong>${subject}</strong></p>
          <p>Here's what you said:</p>
          <div class="message" style="font-style: italic; background-color: #2c2f36; padding: 15px; border-left: 4px solid #58d68d; margin: 20px 0; color: #ddd;">"${message}"</div>
          <p>We'll get back to you as soon as possible.</p>
          <div class="footer" style="margin-top: 40px; font-size: 0.85em; color: #888; text-align: center;">Hespertech · Innovate Beyond Limits</div>
        </div>
      </body>
    </html>

    `.trim();
}


function createInboxEmailTemplate(name, subject, message, email) {
    name = name.replace(/\b(\w)/g, (s) => s.toUpperCase());

    return `
    <!DOCTYPE html>
    <html>
      <head>

      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
        <div class="container" style="background-color: #ffffff; margin: 30px auto; padding: 30px; border-radius: 8px; max-width: 700px; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #222222; margin-top: 0;">📩 New Message Received</h2>
          <div class="meta" style="color: #555; margin-bottom: 20px;">
            <strong>From:</strong> ${name}<br>
            <strong>Email:</strong> <a href="mailto:${email}" style="color: #007BFF; text-decoration: none;">${email}</a><br>
            <strong>Subject:</strong> ${subject}
          </div>
          <div class="message" style="font-style: italic; color: #444; background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4CAF50; margin-top: 15px; white-space: pre-wrap;">${message}</div>
          <div class="footer" style="margin-top: 30px; font-size: 0.9em; color: #999999; text-align: center;">Hespertech · Contact Form Submission</div>
        </div>
      </body>
    </html>

    `, trim();
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

// main logic
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

// no reason
function doGet(e) {
    return HtmlService.createHtmlOutput("Were you bored ?<br>Well, I was too!<br>So I made this page.<br>Have a nice day :)");
}