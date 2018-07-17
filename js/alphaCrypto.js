// Variable declarations for the API call
let request = new XMLHttpRequest();
let url = 'https://www.alphavantage.co/query?function=';
let func = "DIGITAL_CURRENCY_";
var symbol = "";
var market = "";

var time_series = {
  "Intraday": "INTRADAY",
  "Daily": "DAILY",
  "Weekly": "WEEKLY",
  "Monthly": "MONTHLY"
};

let key = "2KB9NN0PM0V7H1YD";

var alphaData;
var jsonParseTS;

//Tool tip
$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

request.onreadystatechange = function() {
  if (this.readyState === 4 && this.status === 200) {
	  let json = JSON.parse(this.responseText);
	  alpha(json);
  }
}


// Function to make the API Call
function alphaAPICall(){
  symbol = document.getElementById("symbol-search").value.toUpperCase();
  market = document.getElementById("market-search").value.toUpperCase();

  var dropdown = document.getElementById("time-series-select");
  var ts = time_series[dropdown.options[dropdown.selectedIndex].value]; // Time series
  jsonParseTS = dropdown.options[dropdown.selectedIndex].value;

  url = url + func + ts + "&symbol=" + symbol + "&market=" + market + "&apikey=" + key;
  request.open("GET", url , true);
  url = 'https://www.alphavantage.co/query?function='; // Reset the url for future api calls
  request.send();
}

// Save the json object from collected from API to a global variable and draw the graph
alpha = function(json) {

  if (chart != null){
    chart.destroy();
  }

  document.getElementById("main").style.height = "1200px";
  document.getElementById("predict-button").style.display = "block";
  document.getElementById("predictChart").style.display = "none";

  alphaData = json;
  var lbl = [];
  var dat = [];
  for (var i in alphaData["Time Series (Digital Currency " + jsonParseTS + ")"]){
    lbl.unshift(i);
    let num = alphaData["Time Series (Digital Currency " + jsonParseTS + ")"][i]["4a. close (" + market + ")"];
    num = Math.round(num * 100) / 100;
    dat.unshift(num);
  }

  var ctx = document.getElementById('stockChart').getContext('2d');
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: lbl,
        datasets: [{
            label: jsonParseTS + "Price of " + symbol + " (" + market + ")",
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1,
          data: dat,
        }]
    },
    options: {
            maintainAspectRatio: true,
            scales: {
              yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Price'
                }
              }],

              xAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Time'
                }
              }]
            }

    }
  });

  // Add button
  document.getElementById("predict-button").addEventListener("click", function() {
    predict(dat);
    document.getElementById("predictChart").style.display = "block";
    document.getElementById("predict-button").style.marginTop = "50px";
    document.getElementById("main").style.height = "1950px";
  });
}
