export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ success: false, error: "Username is required" });
  }

  const cleanUsername = username.replace('@', '').trim();

  try {
    // Method 1: Direct API fetch with strong mobile browser headers
    const apiUrl = `https://www.tikwm.com/api/user/info?unique_id=${cleanUsername}`;
    
    let response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
        'Accept': 'application/json',
        'Referer': 'https://www.tiktok.com/'
      }
    });

    if (response.ok) {
      let data = await response.json();
      if (data && data.code === 0) {
        return res.status(200).json(data);
      }
    }

    // Method 2: Fallback to alternative public endpoint if first fails
    const altUrl = `https://tikwm.com/api/user/info?unique_id=${cleanUsername}`;
    let altResponse = await fetch(altUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (altResponse.ok) {
      let altData = await altResponse.json();
      return res.status(200).json(altData);
    }

    throw new Error("All endpoints blocked");

  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: "Failed to fetch data from server. TikTok might be rate-limiting Vercel IPs." 
    });
  }
}
