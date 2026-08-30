export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ success: false, error: "Username is required" });
  }

  const cleanUsername = username.replace('@', '').trim();

  try {
    // Yeh aik aur free aur working endpoint hai jo profile data deti hai
    const apiUrl = `https://www.tikwm.com/api/user/info?unique_id=${cleanUsername}`;
    
    // Agar tikwm direct block kare, toh hum free public proxy ko server-side se route kar dete hain
    const proxyApiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;

    const apiResponse = await fetch(proxyApiUrl);
    const json = await apiResponse.json();
    const data = JSON.parse(json.contents);

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to fetch data from server" });
  }
}
