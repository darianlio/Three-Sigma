//var SSL = require('stock-symbol-lookup');

let request = new XMLHttpRequest();
let url = 'https://www.alphavantage.co/query?function=';
let key = "2KB9NN0PM0V7H1YD";
var func = "TIME_SERIES_";
var symbol = "";
var interval = "";
var chart = null;
var alphaData;
var labelName;
var time_series = {
    "Intraday": "INTRADAY",
    "Daily": "DAILY",
    "Weekly": "WEEKLY",
    "Monthly": "MONTHLY"
};

document.getElementById("button-search").addEventListener("click", function() {
    document.getElementById("main").style.height = "1200px";
    document.getElementById("predict-button").style.display = "block";
    document.getElementById("predictChart").style.display = "none";
    alphaAPICall();
});

request.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
        let json = JSON.parse(this.responseText);
        alpha(json);
    }
}

function getFunc(sel){
    switch(sel){
        case "intraday":
            sel="TIME_SERIES_INTRADAY";
            break;
        case "daily":
            sel="TIME_SERIES_DAILY"
            break;
        case "weekly":
            sel="TIME_SERIES_WEEKLY"
            break;
        case "monthly":
            sel="TIME_SERIES_MONTHLY"
            break;
    }
    return sel;
}

/*function getSymbol(sel){
    SSL.loadData().then((data) => {
        SSL.searchBySecurity(sel, 5).then((data) => {
            console.log(data[0].symbol);
            return sel = data[0].symbol;
        });
    });
    return sel;
}*/

function alphaAPICall(){
    //symbol = getSymbol(document.getElementById("symbol-search").value.toUpperCase);

    symbol = document.getElementById("symbol-search").value.toUpperCase();
    interval = document.getElementById("interval-select").value;

    var dropdown = document.getElementById("time-series-select");
    var ts = time_series[dropdown.options[dropdown.selectedIndex].value]; // Time series
    jsonParseTS = dropdown.options[dropdown.selectedIndex].value;

    if(ts === "INTRADAY"){
        labelName = "Time Series (" + interval + ")";
        url = url + func + ts + "&symbol=" + symbol + "&interval=" + interval + "&apikey=" + key;
    } else if (ts === "DAILY"){
        labelName = "Time Series (Daily)";
        url = url + func + ts + "&symbol=" + symbol + "&apikey=" + key;
    } else { //WEEKLY, MONTHLY, DAILY'
        labelName = document.getElementById("time-series-select").value + " Time Series";
        console.log(labelName);
        url = url + func + ts + "&symbol=" + symbol + "&apikey=" + key;
    }
    console.log(url);
    request.open("GET", url , true);
    url = 'https://www.alphavantage.co/query?function=';
    request.send();
}

function show(select_item) {
    if (select_item == "intraday") {
        document.getElementById('int').style.display = "block";
    } else {
        document.getElementById('int').style.display = "none";
    }
}

alpha = function(json) {
    alphaData = json;
    console.log(json);
    displayChart();
}

function displayChart(){

    if (chart != null){
        chart.destroy();
    }

    var lbl = [];
    var dat = [];
    for (var i in alphaData[labelName]){
        lbl.unshift(i);
        let num = alphaData[labelName][i]["4. close"];
        dat.unshift(num);
    }

    var ctx = document.getElementById('stockChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: lbl,
            datasets: [{
                label: 'Stock Time Series: ' + symbol,
                data: dat,
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
                borderWidth: 1
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