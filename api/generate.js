const { GoogleGenAI } = require('@google/genai');

module.exports = async function handler(req, res) {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST 요청만 지원합니다.' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Vercel 환경변수(GEMINI_API_KEY)가 설정되지 않았습니다.' });
    }

    // 1. 요청 데이터(req.body)를 100% 안전하게 파싱
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = { prompt: body }; // 파싱 실패 시 문자열 자체를 prompt로 사용
      }
    }
    body = body || {};

    // 2. 단어/문장 추출 (여러 가능성 모두 지원)
    const prompt = body.prompt || body.text || body.message || body.word || (typeof body === 'string' ? body : '');

    // 3. 진성 빈 값 검사
    if (!prompt || String(prompt).trim() === '' || prompt === '{}') {
      return res.status(400).json({ error: '입력된 단어나 문장이 없습니다. 값을 입력해 주세요.' });
    }

    // 4. Gemini API 호출
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: String(prompt).trim(),
    });

    return res.status(200).json({ result: response.text });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ 
      error: '서버 에러가 발생했습니다.', 
      message: error.message || '알 수 없는 오류' 
    });
  }
};
