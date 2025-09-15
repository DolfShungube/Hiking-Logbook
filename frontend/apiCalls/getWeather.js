
///local testing use render when we deploy
export async function getWeather(lat, lon) {
  try {
    const res = await fetch(`https://hiking-logbook-api.onrender.com/api/weather/forecast?lat=${lat}&lon=${lon}`);
    if (!res.ok) throw new Error("Failed to fetch weather data");
    const data = await res.json();
    return{
       current: {
        temp: data.current.temp,
        description: data.current.weather[0].description
      },
      daily: data.daily.map(day => ({
        date: new Date(day.dt * 1000).toISOString().split('T')[0], // convert unix timestamp to YYYY-MM-DD
        summary: day.summary,
        minTemp: day.temp.min,
        maxTemp: day.temp.max
      }))
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
}
