export default async function handler(req, res) {
  // CORS headers enable kar rahe hain taaki Vercel par koi block na aaye
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ success: false, message: "Username is required" });
  }

  try {
    // TikWM public API ko Vercel ke backend se call kar rahe hain (CORS bypass)
    const apiUrl = `https://www.tikwm.com/api/user/info?unique_id=${username}`;
    
    const apiResponse = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    const data = await apiResponse.json();

    if (data && data.code === 0 && data.data) {
      const avatarUrl = data.data.user.avatar;
      return res.status(200).json({
        success: true,
        avatarUrl: avatarUrl
      });
    } else {
      return res.status(404).json({ success: false, message: "User not found or private!" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error occurred" });
  }
}
