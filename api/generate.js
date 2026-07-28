const { GoogleGenAI } = require('@google/genai');

module.exports = async function handler(req, res) {
  // CORS 헤더 설정 (필요 시)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST 요청만 가능합니다.' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY 환경변수가 없습니다.' });
    }

    // req.body 파싱 안전 처리
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const prompt = body?.prompt;

    if (!prompt) {
      return res.status(400).json({ error: 'prompt 값이 누락되었습니다.' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return res.status(200).json({ result: response.text });

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: error.message || '서버 오류 발생' });
  }
};
