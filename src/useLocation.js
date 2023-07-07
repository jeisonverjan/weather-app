import { useEffect, useState } from "react";

export function useLocation(query) {
  const [weather, setWeather] = useState({});
  const [locationName, setLocationName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const controller = new AbortController();

    async function fetchLocation() {
      try {
        setIsLoading(true)
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${query}`,
          { signal: controller.signal }
        );

        const geoData = await res.json();

        if (!geoData.results) throw new Error("Location not found");

        const { latitude, longitude, timezone, name, country_code } =
          geoData.results.at(0);

        setLocationName(name);
        setCountryCode(country_code);

        const resWeather = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
        );

        const weatherData = await resWeather.json();
        setWeather(weatherData.daily);
      } catch (error) {
        if (error.name !== "AbortError") console.log(error);
      } finally {
        setIsLoading(false)
      }
    }
    if (query.length > 2) fetchLocation();

    return function () {
      controller.abort();
    };
  }, [query]);
  return { locationName, countryCode, weather, isLoading };
}
