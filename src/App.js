import { useState } from "react";
import { useLocation } from "./useLocation";
import ReactCountryFlag from "react-country-flag";

function getWeatherIcon(wmoCode) {
  const icons = new Map([
    [[0], "☀️"],
    [[1], "🌤"],
    [[2], "⛅️"],
    [[3], "☁️"],
    [[45, 48], "🌫"],
    [[51, 56, 61, 66, 80], "🌦"],
    [[53, 55, 63, 65, 57, 67, 81, 82], "🌧"],
    [[71, 73, 75, 77, 85, 86], "🌨"],
    [[95], "🌩"],
    [[96, 99], "⛈"],
  ]);
  const arr = [...icons.keys()].find((key) => key.includes(wmoCode));
  if (!arr) return "NOT FOUND";
  return icons.get(arr);
}

function formatDay(dateStr) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
  }).format(new Date(dateStr));
}

export default function App() {
  const [query, setQuery] = useState("");
  const { locationName, countryCode, weather, isLoading } = useLocation(query);

  return (
    <div className={`main-container ${query && "border"}`}>
      <Heater query={query} setQuery={setQuery} />
      {isLoading && <Loader />}
      {query && !isLoading && (
        <Weather
          locationName={locationName}
          countryCode={countryCode}
          weather={weather}
        />
      )}
    </div>
  );
}

function Heater({ query, setQuery }) {
  return (
    <header className={`header-container container ${query && "no-border"}`}>
      <h1>Classy Weather</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery((query = e.target.value))}
        placeholder="Enter a Place"
      />
    </header>
  );
}

function Weather({ locationName, countryCode, weather }) {
  const {
    temperature_2m_max: max,
    temperature_2m_min: min,
    time: dates,
    weathercode: codes,
  } = weather;

  if (!dates) return;

  return (
    <div className="weather-container container">
      <h2>
        Weather for {locationName}{" "}
        <ReactCountryFlag countryCode={countryCode} svg />
      </h2>

      <ul className="weather-list">
        {dates.map((date, i) => (
          <Day
            date={date}
            max={max.at(i)}
            min={min.at(i)}
            code={codes.at(i)}
            key={date}
            isToday={i === 0}
          />
        ))}
      </ul>
    </div>
  );
}

function Day({ date, max, min, code, isToday }) {
  return (
    <li className="day-container">
      <span>{getWeatherIcon(code)}</span>
      <p>{isToday ? "Today" : formatDay(date)}</p>
      <p>
        {Math.floor(min)}&deg; &mdash; <strong>{Math.ceil(max)}&deg;</strong>
      </p>
    </li>
  );
}

function Loader() {
  return (
    <div className="weather-container">
      <p className="loader">Loading...</p>;
    </div>
  );
}
