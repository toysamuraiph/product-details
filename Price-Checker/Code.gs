function doGet(e) {
  // Define the name of the sheets
  var skuSheetName = "SKU";
  var notificationsSheetName = "notifications";
  
  // Open the spreadsheet by ID
  var spreadsheet = SpreadsheetApp.openById("10c-4AbE-li-Y4Xm5La83-KBZ0RTldX42kIwr7uWm9Y8");
  var skuSheet = spreadsheet.getSheetByName(skuSheetName);
  var notificationsSheet = spreadsheet.getSheetByName(notificationsSheetName);
  
  // If the SKU sheet is not found, return an error
  if (!skuSheet) {
    return ContentService.createTextOutput("Error: Sheet '" + skuSheetName + "' not found")
                         .setMimeType(ContentService.MimeType.TEXT);
  }
  
  // If the notifications sheet is not found, return an error
  if (!notificationsSheet) {
    return ContentService.createTextOutput("Error: Sheet '" + notificationsSheetName + "' not found")
                         .setMimeType(ContentService.MimeType.TEXT);
  }
  
  // Check if e and e.parameter are defined
  if (!e || !e.parameter) {
    notificationsSheet.appendRow([new Date(), "Error", "No parameters found"]);
    return ContentService.createTextOutput("Error: No parameters found")
                         .setMimeType(ContentService.MimeType.TEXT);
  }
  
  // Log the incoming parameters
  notificationsSheet.appendRow([new Date(), "Request Parameters", JSON.stringify(e.parameter)]);
  
  // Get the SKU parameter from the query string
  var sku = e.parameter.sku;
  if (!sku) {
    notificationsSheet.appendRow([new Date(), "Error", "SKU parameter is missing"]);
    return ContentService.createTextOutput("Error: SKU parameter is missing")
                         .setMimeType(ContentService.MimeType.TEXT);
  }
  
  // Get all data from the SKU sheet
  var range = skuSheet.getDataRange();
  var values = range.getValues();
  
  // Initialize the response object
  var response = {};
  
  // Search for the SKU in the sheet
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    if (row[0] === sku) {
      var productId = row[1];
      var cost = row[2];
      var srp = row[4];
      var productImage = row[11];
      var ownerId = row[6];

      // Fetch the product name from the 'Product' sheet
      var productSheet = spreadsheet.getSheetByName("Product");
      if (!productSheet) {
        notificationsSheet.appendRow([new Date(), "Error", "Sheet 'Product' not found"]);
        return ContentService.createTextOutput("Error: Sheet 'Product' not found")
                             .setMimeType(ContentService.MimeType.TEXT);
      }
      
      var productRange = productSheet.getDataRange();
      var productValues = productRange.getValues();
      var productName = "Product not found";
      
      for (var j = 1; j < productValues.length; j++) {
        if (productValues[j][0] === productId) {
          productName = productValues[j][1];
          break;
        }
      }
      
      response = {
        "ProductName": productName,
        "SRP": srp,
        "Cost": cost,
        "ProductImage": productImage,
        "OwnerID": ownerId
      };
      
      // Log the successful response
      notificationsSheet.appendRow([new Date(), "Response", JSON.stringify(response)]);
      
      break;
    }
  }
  
  // Check if SKU was found
  if (!response.ProductName) {
    response.error = "SKU not found";
    notificationsSheet.appendRow([new Date(), "Error", "SKU not found"]);
  }

  // Return the response as JSON
  return ContentService.createTextOutput(JSON.stringify(response))
                       .setMimeType(ContentService.MimeType.JSON);
}
