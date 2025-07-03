import fetch from 'node-fetch';

export default async function handler(req, res) {
  const apiKey = process.env.WEATHER_KEY;
  const city = 'Brasilia';

  try {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}&lang=de`);
    const data = await response.json();

    if (data.error) {
      return res.status(500).send('Fehler bei Wetterdaten');
    }

    const temp = data.current.temp_c;
    const condition = data.current.condition.text;
    
    res.setHeader('Cache-Control', 's-maxage=60');
    res.send(`${condition}, ${Math.round(temp)}°C`);
  } catch (err) {
    res.status(500).send('Fehler im Proxy');
  }
}
