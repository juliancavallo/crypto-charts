const apiKey = "";//"da9d8380e36af30bb06d3467354651a0f3e850a6569e9baf452aeda5431894a6"

async function returnApiData(currency){
  const response = await fetch(`https://min-api.cryptocompare.com/data/v2/histohour?fsym=${currency}&tsym=USD&limit=100`);
  const json = await response.json();
  const data = json.Data.Data
  const times = data.map(obj => new Date(obj.time * 1000).toLocaleDateString())
  const prices = data.map(obj => obj.high)
  return {
    times,
    prices
  }
}

async function updatePrice(data, element){

  let { times, prices } = await data;
  let currentPrice = prices[prices.length-1].toFixed(2);

  document.getElementById(element).innerHTML = "$" + currentPrice;
}

function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}



let createBtcChart;
let createCosmosChart;
let createethereumChart;
  
async function printChart(chart, data, hexColor) {
  let { times, prices } = await data;

  let btcChart = document.getElementById(chart).getContext('2d');

  let gradient = btcChart.createLinearGradient(0, 0, 0, 400);

  gradient.addColorStop(0, hexColor);
  gradient.addColorStop(1, "#fff");

  Chart.defaults.global.defaultFontFamily = 'Red Hat Text';
  Chart.defaults.global.defaultFontSize = 12;

  createBtcChart = new Chart(btcChart, {
    type: 'line',
    data: {
      labels: times,
      datasets: [{
        label: '$',
        data: prices,
        backgroundColor: gradient,
        borderColor: hexColor,
        borderJoinStyle: 'round',
        borderCapStyle: 'round',
        borderWidth: 3,
        pointRadius: 0,
        pointHitRadius: 10,
        lineTension: .2,
      }]
    },

    options: {
      title: {
        display: false,
        text: 'Heckin Chart!',
        fontSize: 35
      },

      legend: {
        display: false
      },

      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        }
      },

      scales: {
        xAxes: [{
          gridLines: {}
        }],
        yAxes: [{
          gridLines: {}
        }]
      },

      tooltips: {
        callbacks: {
          //This removes the tooltip title
          title: function() {}
        },
        //this removes legend color
        displayColors: false,
        yPadding: 10,
        xPadding: 10,
        position: 'nearest',
        caretSize: 10,
        backgroundColor: 'rgba(255,255,255,.9)',
        bodyFontSize: 15,
        bodyFontColor: '#303030' 
      }
    }
  });
}



let btcData = returnApiData("BTC");  
let cosmosData = returnApiData("ATOM");
let ethData = returnApiData("ETH");

updatePrice(btcData, "btcPrice");
updatePrice(ethData, "ethPrice");
updatePrice(cosmosData, "atomPrice");

printChart("btcChart", btcData, "#f7931a")
printChart("cosmosChart", cosmosData, "#133b90")
printChart("ethereumChart", ethData, "#141414")