$(document).ready(function() {
  // array of all page numbers
  var pageNumbers = [];
  // initial page number 
  var lowEnd = 1;
  // potential highest page number
  var highEnd = 90;

  // add all pageNumbers to appropriate variable
  for (var i = lowEnd; i <= highEnd; i++) {
    pageNumbers.push(i);
  }

  // when the user clicks the Calculate button
  $("button").click(function() {
    // store input Shopify URL
    var url;
    // initialize cost to 0
    var totalCost = 0;
    // array of specific searched product types
    var productTypes = [];
    //check and remove any trailing '/' in URL
    var inputURL = $("#shopifyURL").val()
    var lastChar = inputURL[inputURL.length - 1];
    if (lastChar == '/') {
      //store correct link extension for product json info in variable
      url = $("#shopifyURL").val() + "products.json?page=";
    } else {
      //store correct link extension for product json info in variable
      url = $("#shopifyURL").val() + "/products.json?page=";
    }


    // convert product type(s) to lowercase 
    // store product type(s) from search boxes in corresponding array
    $(".productTypes").each(function() {
      productTypes.push($(this).val().toLowerCase());
    });

    // iterate through each page number until you've found all products
    $.each(pageNumbers, function(index, value) {
      // get the json file
      $.getJSON(url + value, function(json) {
        //check if page contains product info 
        if (json.products.length > 0) {
          //loop through the products in the json object
          $.each(json.products, function(i, product) {
            // this is where we check for products that match our search terms
            if ($.inArray(product.product_type.toLowerCase(), productTypes) !== -1) {
              //Add price of each variant
              $.each(product.variants, function(i, variant) {
                var price = parseFloat(variant.price);
                totalCost = totalCost + price;
              });
            }
          });
        } else {
          return false;
        }
      });
    })

    // display total cost on page
    function displayCost() {
      //round to two decimal     
      var totalCostString = totalCost.toFixed(2);
      $('#calcCost').text('$' + totalCostString);
      $('#resultText').css('visibility', 'visible');
    }

    // use setTimeout() to execute
    setTimeout(displayCost, 1000)



  });
});