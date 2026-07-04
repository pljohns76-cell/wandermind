import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are WanderMind, a luxury travel intelligence that discovers surprising, lesser-known destinations. Avoid obvious tourist destinations. Return ONLY a valid JSON object with no markdown, no backticks, no explanation before or after.

{
  "destination": "City or Region",
  "country": "Country",
  "tagline": "One evocative line",
  "archetypeLabel": "TRAVELLER ARCHETYPE",
  "profileTitle": "The [Name]",
  "profileDesc": "2 sentences about this person",
  "traits": ["Trait One", "Trait Two", "Trait Three"],
  "storyKicker": "3-5 word kicker",
  "storyHeadline": "7-10 word headline",
  "storyParagraphs": ["2-3 sentences setting the scene", "2-3 sentences on why this matches them"],
  "days": [
    { "dayLabel": "Day One", "title": "Title", "body": "2 sentences", "highlight": "Real place" },
    { "dayLabel": "Day Two", "title": "Title", "body": "2 sentences", "highlight": "Real place" },
    { "dayLabel": "Day Three", "title": "Title", "body": "2 sentences", "highlight": "Real place" }
  ],
  "moods": [
    { "label": "Light & Time", "title": "Title", "detail": "1 sentence", "emoji": "🌅", "accent": true },
    { "label": "Sound & Texture", "title": "Title", "detail": "1 sentence", "emoji": "🎵", "accent": false },
    { "label": "Taste & Ritual", "title": "Title", "detail": "1 sentence", "emoji": "☕", "accent": false }
  ],
  "insight": "2 sentences referencing their words",
  "unsplashQuery": "3-4 word photo search query"
}`;
export async function POST(request) {
  try {
    const { input } = await request.json();
    if (!input || input.trim().length === 0) {
      return Response.json({ error: 'No input provided' }, { status: 400 });
    }

    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: input }],
    });

    const raw = message.content[0].text.trim();
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start === -1 || end === -1) {
      throw new Error('No JSON found in response');
    }
    const jsonStr = raw.slice(start, end + 1);
    const journey = JSON.parse(jsonStr);

    // Fetch a photo from Unsplash using the query Claude generated
    let heroImage = null;
    let gridImages = [];
    try {
      const searchUnsplash = async (q, count) => {
        const res = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=${count}&orientation=landscape`,
          { headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` } }
        );
        const data = await res.json();
        if (!res.ok) console.error('Unsplash says:', res.status, JSON.stringify(data));
        return (data.results || []).map(p => p.urls.regular);
      };

      let urls = await searchUnsplash(journey.unsplashQuery || journey.destination, 10);

      // If too few results, top up with a broader search
      if (urls.length < 4) {
        const backup = await searchUnsplash(`${journey.destination} ${journey.country}`, 10);
        urls = [...urls, ...backup.filter(u => !urls.includes(u))];
      }
      if (urls.length < 4) {
        const backup2 = await searchUnsplash(`${journey.country} travel`, 10);
        urls = [...urls, ...backup2.filter(u => !urls.includes(u))];
      }

      heroImage = urls[0] ?? null;
      gridImages = urls.slice(1, 4);
    } catch (e) {
      console.error('Unsplash error:', e);
    }

    journey.heroImage = heroImage;
    journey.gridImages = gridImages;
    return Response.json({ journey });
  } catch (error) {
    console.error('Journey API error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}