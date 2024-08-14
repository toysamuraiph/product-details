function doPost(e) {
    try {
        // Check if the request contains postData
        if (!e || !e.postData || !e.postData.contents) {
            throw new Error('No parameters found in the POST request.');
        }
       
        // Parse the JSON data from the request
        var data = JSON.parse(e.postData.contents);
        Logger.log(data)
        var sku = data.SKU;
        var quantitySold = data.QuantitySold;
        var salePrice = data.SalePrice;
        var ownerID = data.OwnerID;

        // Open the spreadsheet and access the "Sales" sheet
        var ss = SpreadsheetApp.openById('10c-4AbE-li-Y4Xm5La83-KBZ0RTldX42kIwr7uWm9Y8'); // Replace with your Spreadsheet ID
        var sheet = ss.getSheetByName('Sales');

        // Append the new sale record to the sheet
        sheet.appendRow([
            generateUniqueID(),  // Generate a unique ID for the sale
            sku,
            new Date(),           // Record the current date and time
            quantitySold,
            salePrice,
            ownerID               // Use the OwnerID from the request
        ]);

        // Create a success response
        var result = {
            status: 'success',
            message: 'Data successfully recorded'
        };

        // Log the result for debugging purposes
        Logger.log(result);
        logToNotifications(ss, 'Success', 'Data successfully recorded: ' + JSON.stringify(data));

        // Return the success response as JSON
        return ContentService.createTextOutput(JSON.stringify(result))
                             .setMimeType(ContentService.MimeType.JSON);
    } catch (e) {
        // Log the error for debugging purposes
        Logger.log('Error: ' + e.message);
        logToNotifications(ss, 'Error', e.message);

        // Create an error response
        var errorResult = {
            status: 'error',
            message: e.message
        };

        // Return the error response as JSON
        return ContentService.createTextOutput(JSON.stringify(errorResult))
                             .setMimeType(ContentService.MimeType.JSON);
    }
}

// Function to generate a unique ID for each sale
function generateUniqueID() {
    return 'WEBSALE_' + new Date().getTime();
}

// Function to log messages to the "notifications" sheet
function logToNotifications(ss, status, message) {
    var ss = SpreadsheetApp.openById('10c-4AbE-li-Y4Xm5La83-KBZ0RTldX42kIwr7uWm9Y8'); // Replace with your Spreadsheet ID
    var notificationsSheet = ss.getSheetByName('notifications');
    if (!notificationsSheet) {
        // If the "notifications" sheet does not exist, create it
        notificationsSheet = ss.insertSheet('notifications');
        notificationsSheet.appendRow(['Timestamp', 'Status', 'Message']); // Add headers
    }
    
    // Append the log entry to the "notifications" sheet
    notificationsSheet.appendRow([new Date(), status, message]);
}
