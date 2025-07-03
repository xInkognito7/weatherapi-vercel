export default async function handler(req, res) {
  const city = 'Brasilia';
  const apiKey = process.env.WEATHER_API_KEY;
  console.log("DEBUG API KEY:", apiKey);

  // ✅ DEBUG: Überprüfe, ob die Umgebungsvariable gesetzt ist
  if (!apiKey) {
    return res.status(500).send("FEHLER: API-Key nicht gesetzt");
  }

  try {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&lang=de`);
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    const condition = data.current.condition.text;
    const temp = data.current.temp_c;

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

    const emoji = emojiMap[condition] || '';
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(`${condition}, ${temp}°C ${emoji}`);
  } catch (error) {
    res.status(500).send(`Fehler: ${error.message}`);
  }
}
