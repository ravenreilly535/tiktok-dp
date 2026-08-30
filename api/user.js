export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ success: false, error: "Username is required" });
  }

  const cleanUsername = username.replace('@', '').trim();

  try {
    const apiUrl = `https://tikwm.com/api/user/info?unique_id=${cleanUsername}`;
    
    // Real browser headers add kiye hain taaki request block na ho
    const apiResponse = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://tikwm.com/'
      }
    });

    if (!apiResponse.ok) {
      throw new Error(`HTTP error! status: ${apiResponse.status}`);
    }

    const data = await apiResponse.json();

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "Failed to fetch data from server" });
  }
}
