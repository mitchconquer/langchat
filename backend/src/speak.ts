import type { Request, Response } from 'express';

// Imports the Google Cloud client library
import textToSpeech from '@google-cloud/text-to-speech';

export default async function speak(req: Request, res: Response) {
  // The text to synthesize
  const text = req.body?.text;

  if (!text) {
    return res.status(400).json({ error: 'No text provided' });
  }

  try {
    const client = new textToSpeech.TextToSpeechClient();

    const request = {
      input: { text: text },
      voice: {
        languageCode: 'es-US',
        name: 'es-US-Studio-B',
        ssmlGender: 'MALE',
      },
      audioConfig: { audioEncoding: 'MP3' },
    };

    // Performs the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);

    if (!response.audioContent) {
      return res.status(500).json({ error: 'No audio content' });
    }

    return res.send(response.audioContent as Buffer);
  } catch (error) {
    console.log('Error generating text-to-speech', error, text);
    return res.status(500).json({ error: error.message });
  }
}
