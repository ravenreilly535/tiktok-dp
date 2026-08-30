export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ success: false, message: "Username is required" });
  }

  try {
    const profileUrl = `https://www.tiktok.com/@${username}`;
    const oEmbedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(profileUrl)}`;

    const apiResponse = await fetch(oEmbedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!apiResponse.ok) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const data = await apiResponse.json();

    if (data && data.thumbnail_url) {
      return res.status(200).json({
        success: true,
        avatarUrl: data.thumbnail_url
      });
    } else {
      return res.status(404).json({ success: false, message: "Avatar not found" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
