export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ success: false, message: "Username is required" });
  }

  try {
    const profileUrl = `https://www.tiktok.com/@${username}`;
    
    // TikTok par request bhej rahe hain proper mobile user-agent ke sath
    const response = await fetch(profileUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    });

    if (!response.ok) {
      return res.status(404).json({ success: false, message: "Profile not found on TikTok" });
    }

    const html = await response.text();
    let avatarUrl = "";

    // Method 1: OpenGraph meta tag se image nikalna
    const ogMatch = html.match(/<meta property="og:image" content="([^"]+)"/i);
    if (ogMatch && ogMatch[1]) {
      avatarUrl = ogMatch[1].replace(/&amp;/g, '&');
    }

    // Method 2: Agar og:image na mile toh fallback JSON data se nikalna
    if (!avatarUrl) {
      const jsonMatch = html.match(/"avatarLarger":"([^"]+)"/i);
      if (jsonMatch && jsonMatch[1]) {
        avatarUrl = jsonMatch[1].replace(/\\u002F/g, '/').replace(/&amp;/g, '&');
      }
    }

    if (avatarUrl) {
      return res.status(200).json({
        success: true,
        avatarUrl: avatarUrl
      });
    } else {
      return res.status(404).json({ success: false, message: "Avatar could not be extracted!" });
    }

  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error: " + error.message });
  }
}
