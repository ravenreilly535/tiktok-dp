export default async function handler(req, res) {
  // CORS headers enable kar rahe hain taaki koi bhi app ya website isko access kar sake
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ success: false, error: "Username is required" });
  }

  const cleanUsername = username.replace('@', '').trim();

  try {
    const apiUrl = `https://tikwm.com/api/user/info?unique_id=${cleanUsername}`;
    
    const apiResponse = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    const data = await apiResponse.json();

    // Poora JSON data client ko wapas bhej dein
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to fetch data from server" });
  }
}
