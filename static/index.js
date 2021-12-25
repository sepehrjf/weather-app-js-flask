function validate() {
  if (document.getElementById("auto-detect").checked) {
    ipinfo();
  } else {
    geocode();
  }
}

function errorOutput() {
  document.getElementById("error-output").classList.remove("display-none");
  document.getElementById("error-output").innerHTML =
    "No records have been found";
}

let formatted_address = "";

function geocode() {
  const street = document.getElementById("street").value;
  const city = document.getElementById("city").value;
  const state = document.getElementById("state").value;
  const location = street + " " + city + " " + state;

  axios
    .get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: {
        address: location,
        key: "AIzaSyA5pp2iqK_3WXxINlwCyErdTNwxHXTkXcM",
      },
    })
    .then(function (response) {
      //log full response
      formatted_address = "";
      formatted_address = response.data.results[0].formatted_address;

      //latlong
      console.log(response);
      lat = response.data.results[0].geometry.location.lat;
      lng = response.data.results[0].geometry.location.lng;
      loc = lat + "," + lng;
      lat = `${lat}`;
      lng = `${lng}`;
      console.log(loc.split(","));
      axios
        .get(`https://csci571-homework-6-326316.wl.r.appspot.com/${lat}/${lng}`)
        .then((res) => {
          if (res.data.data) {
            results = res.data.data;
            output(results);
          } else {
            errorOutput();
          }
        })
        .catch((err) => console.log(err.message));
    })
    .catch(function (error) {
      console.log(error);
    });
}

function ipinfo() {
  axios
    .get("https://ipinfo.io/", {
      params: {
        token: "29655b12b54a7f",
      },
    })
    .then(function (response) {
      formatted_address = "";
      formatted_address =
        response.data.city +
        ", " +
        response.data.region +
        " " +
        response.data.postal +
        ", " +
        response.data.country;
      console.log(response.data.loc.split(","));
      lat = response.data.loc.split(",")[0];
      lng = response.data.loc.split(",")[1];
      axios
        .get(`https://csci571-homework-6-326316.wl.r.appspot.com/${lat}/${lng}`)
        .then((res) => {
          if (res.data.data) {
            results = res.data.data;
            output(results);
          } else {
            errorOutput();
          }
        })
        .catch((err) => console.log(err.message));
    })
    .catch(function (error) {
      console.log(error);
    });
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const codes = {
  "0": "Unknown",
  "1000": "Clear",
  "1100": "Mostly Clear",
  "1101": "Partly Cloudy",
  "1102": "Mostly Cloudy",
  "1001": "Cloudy",
  "2000": "Fog",
  "2100": "Light Fog",
  "8000": "Thunderstorm",
  "5001": "Flurries",
  "5100": "Light Snow",
  "5000": "Snow",
  "5101": "Heavy Snow",
  "7102": "Light Ice Pellets",
  "7000": "Ice Pellets",
  "7101": "Heavy Ice Pellets",
  "4000": "Drizzle",
  "6000": "Freezing Drizzle",
  "6200": "Light Freezing Rain",
  "6001": "Freezing Rain",
  "6201": "Heavy Freezing Rain",
  "4200": "Light Rain",
  "4001": "Rain",
  "4201": "Heavy Rain",
  "3000": "Light Wind",
  "3001": "Wind",
  "3002": "Strong Wind",
};

const imageCodes = {
  "1000": "clear_day.svg",
  "1100": "mostly_clear_day.svg",
  "1101": "partly_cloudy_day.svg",
  "1102": "mostly_cloudy.svg",
  "1001": "cloudy.svg",
  "2000": "fog.svg",
  "2100": "fog_light.svg",
  "8000": "tstorm.svg",
  "5001": "flurries.svg",
  "5100": "snow_light.svg",
  "5000": "snow.svg",
  "5101": "snow_heavy.svg",
  "7102": "ice_pellets_light.svg",
  "7000": "ice_pellets.svg",
  "7101": "ice_pellets_heavy.svg",
  "4000": "drizzle.svg",
  "6000": "freezing_drizzle.svg",
  "6200": "freezing_rain_light.svg",
  "6001": "freezing_rain.svg",
  "6201": "freezing_rain_heavy.svg",
  "4200": "rain_light.svg",
  "4001": "rain.svg",
  "4201": "rain_heavy.svg",
};

const precipType = {
  "0": "N/A",
  "1": "Rain",
  "2": "Snow",
  "3": "Freezing Rain",
  "4": "Ice Pellets",
};

function output(res) {
  // document.getElementById("today-card").innerHTML = JSON.stringify(res);
  document.getElementById("first-result").classList.remove("display-none");

  const [, dailyWeather] = res.timelines;

  const tableBody = document.getElementById("table-body");
  const todayCardLocation = document.getElementById("today-card-location");
  const todayCardCodeImage = document.getElementById("today-card-code-image");
  const todayCardCode = document.getElementById("today-card-code");
  const todayCardTemp = document.getElementById("today-card-temp");
  const todayCardHumidity = document.getElementById("today-card-humidity");
  const todayCardPressure = document.getElementById("today-card-pressure");
  const todayCardWindSpeed = document.getElementById("today-card-wind-speed");
  const todayCardVisibility = document.getElementById("today-card-visibility");
  const todayCardCloudCover = document.getElementById("today-card-cloud-cover");
  const todayCardUvIndex = document.getElementById("today-card-uv-index");

  //call todayInfo
  todayInfo();

  function todayInfo() {
    const weatherCode = res.timelines[2].intervals[0].values.weatherCode;
    const status = codes[weatherCode];
    const statusImage = imageCodes[weatherCode];
    const temperature = res.timelines[2].intervals[0].values.temperature;
    const humidity = res.timelines[2].intervals[0].values.humidity;
    const pressureSeaLevel =
      res.timelines[2].intervals[0].values.pressureSeaLevel;
    const windSpeed = res.timelines[2].intervals[0].values.windSpeed;
    const visibility = res.timelines[2].intervals[0].values.visibility;
    const cloudCover = res.timelines[2].intervals[0].values.cloudCover;
    const uvIndex = res.timelines[2].intervals[0].values.uvIndex;

    todayCardCodeImage.innerHTML += `<img id="today-card-code-image-img" src="${statusImage}"/>`;
    todayCardCode.innerHTML += `${status}`;
    todayCardTemp.innerHTML += `${temperature}°`;
    todayCardHumidity.innerHTML += `${humidity}%`;
    todayCardPressure.innerHTML += `${pressureSeaLevel}inHg`;
    todayCardWindSpeed.innerHTML += `${windSpeed}mph`;
    todayCardVisibility.innerHTML += `${visibility}mi`;
    todayCardCloudCover.innerHTML += `${cloudCover}%`;
    todayCardUvIndex.innerHTML += `${uvIndex}`;
    todayCardLocation.innerHTML += `${formatted_address}`;
  }

  dailyWeather.intervals.forEach((interval, i) => {
    const day = new Date(interval.startTime).getDay();
    const date = new Date(interval.startTime).getDate();
    const month = new Date(interval.startTime).getMonth();
    const year = new Date(interval.startTime).getFullYear();
    const formattedDate = `${days[day]}, ${date} ${months[month]} ${year}`;

    const { values } = interval;
    const weatherCode = values.weatherCode;
    // const status = patterns[weatherCode][0]
    const status = codes[weatherCode];
    const statusImage = imageCodes[weatherCode];
    // const url = patterns[weatherCode][1]

    tableBody.innerHTML += `<tr data-index='${i}' id='table-row' >
                           <td>${formattedDate}</td> 
                           <td><img id="td-img" src="${statusImage}"/>${status}</td> 
                           <td>${values["temperatureMax"]}</td> 
                           <td>${values["temperatureMin"]}</td> 
                           <td>${values["windSpeed"]}</td> 
                          </tr>`;
  });

  document.getElementById("clear").addEventListener("click", () => {
    document.getElementById("street").disabled = false;
    document.getElementById("city").disabled = false;
    document.getElementById("state").disabled = false;
    document.getElementById("first-result").classList.add("display-none");
    document.getElementById("table-body").innerHTML = "";
    document.getElementById("charts-content").classList.add("display-none");
    document.getElementById("container").innerHTML = "";
    document.getElementById("today-card-location").innerHTML = "";
    document.getElementById("today-card-code-image").innerHTML = "";
    document.getElementById("today-card-code").innerHTML = "";
    document.getElementById("today-card-temp").innerHTML = "";
    document.getElementById("today-card-humidity").innerHTML = "";
    document.getElementById("today-card-pressure").innerHTML = "";
    document.getElementById("today-card-wind-speed").innerHTML = "";
    document.getElementById("today-card-visibility").innerHTML = "";
    document.getElementById("today-card-cloud-cover").innerHTML = "";
    document.getElementById("today-card-uv-index").innerHTML = "";
    document.getElementById("detailed-card-header-left").innerHTML = "";
    document.getElementById("detailed-card-header-right").innerHTML = "";
    document.getElementById("detailed-card-content-values").innerHTML = "";
  });
}

$(() => {
  $(document).on("click", "#table-row", (e) => {
    const table_row = e.target.parentElement;
    const index = $(table_row).data("index");
    const [, dailyWeather] = results.timelines;
    // let { values } = dailyWeather.intervals

    const card = document.getElementById("chart-card");
    const detailedCard = document.getElementById("detailed-card");
    const detailedCardHeaderLeft = document.getElementById(
      "detailed-card-header-left"
    );
    const detailedCardHeaderRight = document.getElementById(
      "detailed-card-header-right"
    );
    const detailedCardContentValues = document.getElementById(
      "detailed-card-content-values"
    );

    const dDay = new Date(dailyWeather.intervals[index]["startTime"]).getDay();
    const dDate = new Date(
      dailyWeather.intervals[index]["startTime"]
    ).getDate();
    const dMonth = new Date(
      dailyWeather.intervals[index]["startTime"]
    ).getMonth();
    const dYear = new Date(
      dailyWeather.intervals[index]["startTime"]
    ).getFullYear();
    const formattedDate = `${days[dDay]}, ${dDate} ${months[dMonth]} ${dYear}`;

    const { values } = dailyWeather.intervals[index];
    const sunriseTimeHour = new Date(values["sunriseTime"])
      .toLocaleTimeString()
      .charAt(0);
    const sunsetTimeHour = new Date(values["sunsetTime"])
      .toLocaleTimeString()
      .charAt(0);
    const weatherCode = values["weatherCode"];
    const status = codes[weatherCode];
    const statusImage = imageCodes[weatherCode];
    const precipitationType = values["precipitationType"];
    const statusPrecip = precipType[precipitationType];

    detailedCardHeaderLeft.innerHTML += `<div class="detailed-card-header-left-content">${formattedDate}</div>
    <div class="detailed-card-header-left-content">${status}</div>
    <div id="detailed-card-temps">${values["temperatureMax"]}°F/${values["temperatureMin"]}°F</div>`;

    detailedCardHeaderRight.innerHTML += `<img id="detailed-card-image" src="${statusImage}"/>`;

    detailedCardContentValues.innerHTML += `
    <div class="detailed-card-content-value"><strong>${statusPrecip}</strong></div>
    <div class="detailed-card-content-value"><strong>${values["precipitationProbability"]}%</strong></div>
    <div class="detailed-card-content-value"><strong>${values["windSpeed"]} mph</strong></div>
    <div class="detailed-card-content-value"><strong>${values["humidity"]}%</strong></div>
    <div class="detailed-card-content-value"><strong>${values["visibility"]} mi</strong></div>
    <div class="detailed-card-content-value"><strong>${sunriseTimeHour}AM/${sunsetTimeHour}PM</strong></div>`;

    // let index = this.dataset.index
    // console.log(index)
    document.getElementById("first-result").classList.add("display-none");
    document.getElementById("charts-content").classList.remove("display-none");

    const temperatureArray = dailyWeather.intervals.map((interval) => {
      const { values } = interval;
      return [values["temperatureMin"], values["temperatureMax"]];
    });

    let maxTemp = temperatureArray[0][1];
    let minTemp = temperatureArray[0][0];

    temperatureArray.forEach((element) => {
      maxTemp = element[1] > maxTemp ? element[1] : maxTemp;
      minTemp = element[0] > minTemp ? element[0] : minTemp;
    });

    maxTemp = Math.round(maxTemp);
    minTemp = Math.round(minTemp);
    maxTemp5 = maxTemp + 5;
    minTemp5 = minTemp + 5;
    let yAxisValues = [minTemp5];
    for (let i = 1; i < 9; i++) {
      minTemp5 += 5;
      yAxisValues.push(minTemp5);
    }
    yAxisValues.push(maxTemp5);

    const datesArray = [];
    let date = new Date(dailyWeather.intervals[0].startTime).getDate();
    let month = new Date(dailyWeather.intervals[0].startTime).getMonth();
    datesArray.push(`${months[month]} ${date}`);
    for (let i = 1; i < temperatureArray.length; i++) {
      let chartDate = new Date(
        new Date().getTime() + i * 24 * 60 * 60 * 1000
      ).getDate();
      let chartMonth = new Date(
        new Date().getTime() + i * 24 * 60 * 60 * 1000
      ).getMonth();
      datesArray.push(`${months[chartMonth]} ${chartDate}`);
    }

    Highcharts.chart("container", {
      chart: {
        type: "arearange",
        zoomType: "x",
        scrollablePlotArea: {
          minWidth: 600,
          scrollPositionX: 1,
        },
      },

      title: {
        text: "Temperature Ranges (Min, Max)",
      },

      xAxis: {
        categories: datesArray,
      },

      yAxis: {
        title: {
          text: "Values",
        },
      },

      tooltip: {
        crosshairs: true,
        shared: true,
        valueSuffix: "°C",
        xDateFormat: "%A, %b %e",
      },

      legend: {
        enabled: false,
      },

      series: [
        {
          name: "Temperatures",
          data: temperatureArray,
          fillColor: {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
              [0, "#f9a927"],
              [1, "#94c3ef"],
            ],
          },
        },
      ],
    });
  });
});

$(() => {
  let count = 0;
  $(document).on("click", "#arrown-down-img", () => {
    if (count == 0) {
      document.getElementById("arrown-down-img").classList.add("rotate");
      document.getElementById("figure1").classList.remove("display-none");
      count = 1;
    } else {
      document.getElementById("arrown-down-img").classList.remove("rotate");
      document.getElementById("figure1").classList.add("display-none");
      count = 0;
    }
  });
});
