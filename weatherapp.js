const moduleDOM = () => {
  const cacheDOM = () => {
    const form = () => document.querySelector("#myform");
    const submit_btn = () => document.querySelector("#request");
    const input_country = () => document.querySelector("#country");
    const input_city = () => document.querySelector("#city");
    const weatherdiv = () => document.querySelector("#weatherbox");
    const error = () => document.querySelector("#error");
    return { submit_btn, input_country, input_city, weatherdiv, form, error };
  };
  const bind_events = () => {
    cacheDOM()
      .submit_btn()
      .addEventListener("click", processmodule().getweather);
  };

  const render_weather = (newData) => {
    cacheDOM().weatherdiv().innerHTML = "";
    cacheDOM().form().reset();
    let newElement = document.createElement("div");
    newElement.id = "weatherinfo";
    console.log(newData.temp.temp_min);
    newElement.innerHTML = template(newData);
    cacheDOM().weatherdiv().appendChild(newElement);
  };

  const template = (newData) => {
    return `
        <h1 id="header">${newData.city}</h1>
          <img id="flag" src="https://www.countryflags.io/${newData.country}/flat/64.png" />
          <h3 id="weather">${newData.description}</h3>
          <h1 id="temp">${newData.temp.maintemp}&#176;C</h1>
          <h3 id="feels">Feels like ${newData.temp.feelslike}&#176;C</h3>
          <h3 id="max">Max ${newData.temp.temp_max}&#176;C</h3>
          <h3 id="min">Min ${newData.temp.temp_min}&#176;C</h3>
          <h3 id="wind-speed">Wind ${newData.wind.wind_speed}km/h</h3>
          <img id="icon" src="http://openweathermap.org/img/wn/${newData.icon}@2x.png" />
  `;
  };

  const rendererror = () => {
    cacheDOM().form().reset();
    cacheDOM().error().style.display = "block";
    console.log(cacheDOM().error());
  };

  const removeerror = () => {
    console.log("remove error");
    cacheDOM().error().style.display = "none";
  };
  return { bind_events, cacheDOM, render_weather, rendererror, removeerror };
};

const processmodule = () => {
  async function getweather(event) {
    event.preventDefault();
    let city = moduleDOM().cacheDOM().input_city().value;
    let country = moduleDOM().cacheDOM().input_country().value;
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&APPID=8299369b491b9574ed6964bc04b82a64&lang={lang}&units=metric`,
        { mode: "cors" }
      );
      console.log(response);
      if (response.ok == true) {
        moduleDOM().removeerror();
        const weatherData = await response.json();
        processweather(weatherData);
      } else {
        throw new error("Not found");
      }
    } catch (err) {
      moduleDOM().rendererror();
    }
  }
  const processweather = (weatherData) => {
    newData = {
      icon: weatherData.weather[0].icon,
      country: weatherData.sys.country,
      city: weatherData.name,
      description: weatherData.weather[0].description,
      wind: {
        wind_speed: weatherData.wind.speed,
        wind_deg: weatherData.wind.deg,
      },
      clouds: { clouds_coverage: weatherData.clouds.all },
      temp: {
        maintemp: Math.round(weatherData.main.temp),
        feelslike: Math.round(weatherData.main.feels_like),
        temp_min: Math.round(weatherData.main.temp_min),
        temp_max: Math.round(weatherData.main.temp_max),
      },
    };
    moduleDOM().render_weather(newData);
  };
  return { getweather };
};
processmodule();
moduleDOM().bind_events();
