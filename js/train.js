function predict(data){
  var network = new neataptic.architect.LSTM(1,12,1);

  var trainingData = {}
  var normalizedData = [];

  normalize(data, normalizedData);

  // Convert the training data to a json object
  for (var i = 0; i < data.length - 1; i++){
    trainingData[i] = { input: [normalizedData[i]] , output:[normalizedData[i + 1]]};
  }

  var ratePol = new neataptic.methods.rate.EXP();

  network.train(trainingData, {
  log: 200,
  iterations: 1000,
  error: 0.1,
  clear: true,
  ratePolicy: ratePol
  });

  for (i in trainingData){
    var input = trainingData[i].input;
    var output = network.activate([input]);
  }

  var lbls = [];
  var predictions = [];
  for (var i = 0; i < 10; i++){
    var input = output;
    var output = network.activate([input]);
    lbls.push(i);
    predictions.push(denormalizeVal(data, output));
    console.log(denormalizeVal(data, input) + " " + denormalizeVal(data, output));
  }

  var body = document.getElementById("main");
  var canvas = document.createElement("canvas");
  canvas.id = "predictChart";
  body.appendChild(canvas);

  var ctx = document.getElementById('predictChart').getContext('2d');
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: lbls,
        datasets: [{
            label: jsonParseTS + " Price of " + symbol + " for the next 10 iterations",
            backgroundColor: '#00e68a',
            borderColor: '#00e68a',
            data: predictions,
        }]
    },

    // Configuration options go here
    options: {
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
              labelString: 'Iteration'
            }
          }]
        }
      }
  });

}

function normalize(data, normalizedData){
  var max = Math.max(...data);
  var min = Math.min(...data);
  for (var i = 0; i < data.length; i++){
    normalizedData.push((data[i] - min) / (max-min));
  }
}

function denormalizeVal(data, normalizedVal){
  var max = Math.max(...data);
  var min = Math.min(...data);

  return (max-min)*normalizedVal + min;

}
