//#region Charts

const apiKey = "";//"da9d8380e36af30bb06d3467354651a0f3e850a6569e9baf452aeda5431894a6"

async function returnApiData(currency){
  const response = await fetch(`https://min-api.cryptocompare.com/data/v2/histohour?fsym=${currency}&tsym=USD&limit=2000`);
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



async function printChart(chart, data, hexColor) {
  let { times, prices } = await data;

  let ctx = document.getElementById(chart).getContext('2d');

  let gradient = ctx.createLinearGradient(0, 0, 0, 1000);

  gradient.addColorStop(0, hexColor);
  gradient.addColorStop(1, "#fff");

  Chart.defaults.global.defaultFontFamily = 'Montserrat, sans-serif';
  Chart.defaults.global.defaultFontSize = 12;
  Chart.defaults.global.defaultFontColor = "#303030";
  Chart.defaults.global.elements.point.borderColor = "#303030";

  let newChart = new Chart(ctx, {
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
        borderWidth: 1
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
//#endregion


//#region Events
document.getElementById("cryptoSelect").addEventListener("click", (e) =>{
  e.stopPropagation();  
  showCheckboxes(false);
});

document.getElementById("checkboxes").addEventListener("click", (e) =>{
  e.stopPropagation();
});

window.addEventListener("click", (e) => {
  showCheckboxes(true);
});

//#endregion


//#region Crypto select


function setClickEventForLabels(){
  document.querySelectorAll("label").forEach(l => {
    l.addEventListener("click", (e) => {
      
      e.preventDefault();
      const key = l.getAttribute("for");
      const checkbox = l.querySelector("input"); 
      const chart = document.querySelector(`[data-chart=${key}]`);

      checkbox.checked = !checkbox.checked;

      if(checkbox.checked){
        chart.style.display = "";
      } else {
        chart.style.display = "none";
      }
    })
  });
}

function initilizeOptions(){
  const currencies = ["BTC", "Cosmos", "ETH", "XRP", "ADA"];
  const select = document.getElementById("checkboxes");

   currencies.forEach(c => {
    const label = document.createElement("label");
    label.setAttribute("for",c);
    label.innerHTML = c;
    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = c;
    input.checked = true;

    label.appendChild(input);

    select.appendChild(label);
  });

  setClickEventForLabels()
}

function showCheckboxes(forceHide) {
  let checkboxes = document.getElementById("checkboxes");
  const i = document.getElementById("cryptoSelect").querySelector("i");
  const display = checkboxes.style.display;

  if(display == "block" || forceHide){
    checkboxes.style.display = "none";
    i.classList.remove("fa-chevron-up");
    i.classList.add("fa-chevron-down");
  }
  else{
    checkboxes.style.display = "block";
    i.classList.remove("fa-chevron-down");
    i.classList.add("fa-chevron-up");
  }
}
//#endregion

(function() {
  let btcData = returnApiData("BTC");  
  let cosmosData = returnApiData("ATOM");
  let ethData = returnApiData("ETH");
  let xrpData = returnApiData("XRP");
  let adaData = returnApiData("ADA");
  
  updatePrice(btcData, "btcPrice");
  updatePrice(ethData, "ethPrice");
  updatePrice(cosmosData, "atomPrice");
  updatePrice(cosmosData, "xrpPrice");
  updatePrice(cosmosData, "adaPrice");
  
  printChart("btcChart", btcData, "#f7931a");
  printChart("cosmosChart", cosmosData, "#133b90");
  printChart("ethereumChart", ethData, "#141414");
  printChart("xrpChart", xrpData, "#5a6282");
  printChart("adaChart", adaData, "#3468d1");

  initilizeOptions();
})();


