import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  // 1. POST 요청만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed', message: 'POST 요청만 지원합니다.' });
  }

  try {
    // 2. Vercel 환경 변수 검증
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("서버에 GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.");
    }

    // 3. 클라이언트 요청 데이터 확인
    const { prompt } = req.body || {};
    if (!prompt) {
      return res.status(400).json({ error: 'Bad Request', message: 'prompt 내용이 비어있습니다.' });
    }

    // 4. Gemini SDK 초기화 및 답변 생성
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    // 5. 정상 JSON 응답
    return res.status(200).json({ 
      success: true, 
      result: response.text 
    });

  } catch (error) {
    console.error("Vercel Function Error:", error);

    // 6. 에러가 나도 HTML/텍스트가 아닌 JSON으로 예쁘게 반환
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message || "서버 내부 오류가 발생했습니다."
    });
  }
}
