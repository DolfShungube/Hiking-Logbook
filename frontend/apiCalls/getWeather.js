
///local testing use render when we deploy
export async function getWeather(lat, lon) {
  try {
    const res = await fetch("https://hiking-logbook-api.onrender.com/api/weather/forecast?lat=${lat}&lon=${lon}");
    if (!res.ok) throw new Error("Failed to fetch weather data");
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}
