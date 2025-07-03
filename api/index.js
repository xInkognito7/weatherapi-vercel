export default async function handler(req, res) {
  const city = 'Brasília';
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    return res.status(500).send("FEHLER: API-Key nicht gesetzt");
  }

  try {
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&lang=de&days=1`);
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    const condition = data.current.condition.text;
    const temp = data.current.temp_c;
    const tempMax = data.forecast.forecastday[0].day.maxtemp_c;
    const tempMin = data.forecast.forecastday[0].day.mintemp_c;

    const emojiMap = {
      'Sonnig': '☀️',
      'Heiter': '🌤️',
      'Klar': '🌕',
      'Teilweise bewölkt': '⛅',
      'Bewölkt': '☁️',
      'Stark bewölkt': '☁️',
      'Bedeckt': '☁️',
      'Leichter Regen': '🌦️',
      'Mäßiger Regen': '🌧️',
      'Starker Regen': '🌧️',
      'Regenschauer': '🌦️',
      'Stellenweise Regen': '🌦️',
      'Gewitter': '⛈️',
      'Leichter Schneefall': '🌨️',
      'Mäßiger Schneefall': '🌨️',
      'Starker Schneefall': '❄️',
      'Schneeregen': '🌨️',
      'Schnee': '❄️',
      'Nebel': '🌫️',
      'Gefrierender Nebel': '🌫️',
      'Stellenweise Nieselregen': '🌧️',
      'Stellenweise Schnee': '🌨️',
      'Unwetter': '🌪️',
      'Gefrierender Regen': '🌧️❄️',
      'Eisregen': '🌧️❄️',
      'Keine Angabe': '❓'
    };

    // 🔍 Intelligenter Emoji-Match (Teilstring-Vergleich)
    let emoji = '';
    for (const [key, symbol] of Object.entries(emojiMap)) {
      if (condition.toLowerCase().includes(key.toLowerCase())) {
        emoji = symbol;
        break;
      }
    }

    // Fallback, falls nichts passt
    if (!emoji) emoji = '🌡️';

    const output = `🌍  ${city}: ${condition} ${emoji} | Temperatur: ${temp}°C | Max: ${tempMax}°C / Min: ${tempMin}°C`;

    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(output);
  } catch (error) {
    res.status(500).send(`Fehler: ${error.message}`);
  }
}
