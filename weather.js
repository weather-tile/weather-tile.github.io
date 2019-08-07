// Regular comments
// * Important comment
// ? Question
// ! Alert
// TODO: Whatever

// ======== HELPER FUNCTIONS ========

// A function named $ that takes a CSS selector and returns the first Element it finds from the document
const $ = selector => {
  return document.querySelector(selector);
};

// ======== WEATHER FUNCTIONS ========

// Search for weather by city name
const goGetWeather = (lat, lon) => {
  // Put up a loading screen before we go get the data
  $(`#loading`).classList.add(`show`);

  const key = `6dec5fb891e6e243c9d8c20351998e67`;
  const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${key}&lat=${lat}&lon=${lon}`;

  fetch(url).then(response => {
    // TODO: If the response fails, do something!

    response.json().then(data => {
      console.log(data); // Dump the results

      // Remove the "loading..." screen
      $(`#loading`).classList.remove(`show`);

      // Destructure (store as const variables) some useful variables:
      //    sunrise, sunset, temp, weather, name, dt ("datetime" it was last updated)
      const {
        sys: { sunrise, sunset },
        main: { temp },
        weather,
        name,
        dt
      } = data;
      //    width, height (of the browser's viewport)
      const { width, height } = window;

      $(`#temp`).innerHTML = `${temp}&deg;C`;

      const iconImg = `http://openweathermap.org/img/wn/${
        weather[0].icon
      }@2x.png`;
      $(`#icon`).innerHTML = `<img src="${iconImg}" alt="${weather[0].main}">`;

      // $(`body`).style.backgroundImage = `url("https://source.unsplash.com/random/${width}×${height}/?${name},${weather[0].main},skyline")`
      $(
        `.panel-header`
      ).style.backgroundImage = `url("https://source.unsplash.com/random/600×400/?${name},${
        weather[0].main
      },skyline")`;

      // This assumes local time!
      const sunriseTime = new Date(sunrise * 1000);
      const sunsetTime = new Date(sunset * 1000);
      console.log(
        sunriseTime.toLocaleTimeString(`en-CA`),
        sunsetTime.toLocaleTimeString(`en-CA`)
      );

      // Calculate daylight measurements in milliseconds, seconds, minutes, hours
      const sunlightMs = sunsetTime - sunriseTime;
      const sunlightS = sunlightMs / 1000;
      const sunlightM = sunlightS / 60;
      const sunlightH = sunlightM / 60;

      //if (dt < sunset) tense = `will be`
      //else tense = `was`

      $(`#sun`).innerHTML = `There ${
        dt < sunset ? `will be` : `was`
      } <strong>${sunlightH.toFixed(2)} hours</strong> of sunlight today.`;

      // TODO: Take the number of ms and compare it to things
      // TODO: If dt is less/greater than sunrise/sunset, then...
      // TODO: Could be represented as a line split into three (night/day/night), with our position as a pointer (visualize the day)

      const shortestDay = new Date(`December 21, 2019`).getTime();
      const longestDay = new Date(`June 21, 2019`).getTime();
      const shortLongDiff = longestDay - shortestDay;
      console.log(shortLongDiff);
      // This is just the amount of time between solstices (184 days in this case)
      // What we need is amount of sunlight on those days.
      // TODO: if todays date is less than this years summer solstice, between, or after winter, then...

      // ? Can we visualize pressure? Perhaps thinking about it as a weight? Maybe wind is some kind of breeze pushing content. Maybe affecting the speed of the elements movement on hover?
    });
  });
};

// ======== GEOLOCATE FUNCTIONS ========

window.onload = () => {
  navigator.geolocation.getCurrentPosition(
    ({ coords: { latitude, longitude } }) => {
      // good
      goGetWeather(latitude, longitude); // Go!
    },
    ({ code, message }) => {
      // bad
      console.warn(`Woops! Error ${code}: ${message}`);
    }
  );
};
