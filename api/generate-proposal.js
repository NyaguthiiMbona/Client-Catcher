export default async function handler(req, res) {
  const { job, skills } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Missing OpenAI API key.' });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that writes personalized freelance proposals."
          },
          {
            role: "user",
            content: `Write a freelance proposal for a ${job}. My skills include: ${skills}.`
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    console.log("OpenAI response:", data);

    if (!data.choices || !data.choices.length) {
      return res.status(500).json({ error: 'OpenAI did not return choices.', raw: data });
    }

    const proposal = data.choices[0].message.content;
    res.status(200).json({ proposal });

  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: 'Failed to generate proposal.', details: error.message });
  }
}
