const apiKey = "";//"da9d8380e36af30bb06d3467354651a0f3e850a6569e9baf452aeda5431894a6"

async function returnApiData(currency){
  const response = await fetch(`https://min-api.cryptocompare.com/data/v2/histohour?fsym=${currency}&tsym=USD&limit=96`);
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

  document.getElementById(element).innerHTML = "$ " + currentPrice;
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

  let gradient = btcChart.createLinearGradient(0, 0, 0, 1000);

  gradient.addColorStop(0, hexColor);
  gradient.addColorStop(1, "#fff");

  Chart.defaults.global.defaultFontFamily = 'Montserrat, sans-serif';
  Chart.defaults.global.defaultFontSize = 12;
  Chart.defaults.global.defaultFontColor = "#303030";
  Chart.defaults.global.elements.point.borderColor = "#303030";

  createBtcChart = new Chart(btcChart, {
    type: 'line',
    data: {
      labels: times,
      datasets: [{
        label: '$',
        data: prices,
        backgroundColor: gradient,
        pointRadius: 0,
        pointHitRadius: 5,
        borderColor: "#303030",
        borderWidth: 2
      }]
    },

    options: {
      responsive: true,
      scales: {
        xAxes: [{
          ticks: {
            fontStyle: "bold",
            maxTicksLimit	:10,
            
            callback: function(tick, index, array) {
              if(window.innerWidth < 400)
                return (index % 3) ? "" : tick;
              
              if(window.innerWidth < 900)
                return (index % 2) ? "" : tick;
                
              return tick;
            }
          }
        }],
        yAxes: [{
          ticks: {
            fontStyle: "bold",
            maxTicksLimit	:10,
            callback: function(tick, index, array) {
              if(window.innerWidth < 900)
                  return (index % 2) ? "" : tick;
                
                return tick;
            }
          }
        }]
      
      },

      legend: {
        display: false
      },

      layout: {
        padding: {
          left: 15,
          right: 15
        }
      },


      tooltips: {
        callbacks: {
          title: function() {}
        },
        displayColors: false,
        mode: "nearest",
        yPadding: 10,
        xPadding: 10,
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

// window.addEventListener("resize", () => {
//   printChart("btcChart", btcData, "#f7931a")
//   printChart("cosmosChart", cosmosData, "#133b90")
//   printChart("ethereumChart", ethData, "#141414")
// })