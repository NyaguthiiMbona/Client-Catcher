// /api/generate-proposal.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { job, skills } = req.body;

  if (!job || !skills) {
    return res.status(400).json({ message: 'Missing job title or skills' });
  }

  try {
    const prompt = `Write a short, compelling freelance proposal for a ${job}. Highlight the following skills: ${skills}. Include a client pain point and how you solve it.`;

    const apiRes = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt,
        max_tokens: 200,
        temperature: 0.7,
      })
    });

    const data = await apiRes.json();
    const text = data.choices?.[0]?.text?.trim();

    res.status(200).json({ proposal: text });
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ message: 'Failed to generate proposal.' });
  }
}
