// File: api/generate-proposal.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { job, skills } = req.body;

  if (!job || !skills) {
    return res.status(400).json({ error: 'Missing job or skills' });
  }

  const prompt = `Write a short, persuasive freelance proposal for the following job:\n\nJob Title: ${job}\nSkills: ${skills}\n\nFocus on pain points and how the freelancer can deliver value.`;

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    const data = await openaiRes.json();

    if (data.choices?.[0]?.message?.content) {
      res.status(200).json({ proposal: data.choices[0].message.content.trim() });
    } else {
      res.status(500).json({ error: 'OpenAI failed to return a proposal.' });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
}
