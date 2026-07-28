import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  // POST 요청만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { word } = req.body;

  if (!word || typeof word !== 'string') {
    return res.status(400).json({ error: '단어를 입력해주세요.' });
  }

  try {
    // 환경변수에서 API 키 자동 로드
    const ai = new GoogleGenAI();

    const prompt = `
사용자가 입력한 영어 단어/숙어: "${word}"

이 단어를 사용자가 아주 간편하고 재미있게 암기할 수 있도록 아래 JSON 형식으로 응답해줘. 다른 말은 붙이지 말고 오직 Valid한 JSON만 출력해야 해.

{
  "word": "입력한 단어",
  "meaning": "한글 뜻 (대표적인 뜻 1~2개)",
  "mnemonic": "기억에 오래 남는 연상 암기 팁 (어원, 스토리, 또는 말장난 등 흥미로운 암기법)",
  "exampleEn": "쉬운 실생활 영어 예문 1개",
  "exampleKr": "예문의 한글 번역",
  "visualPrompt": "이 단어를 이미지로 상상할 수 있도록 도와주는 직관적인 한 줄 장면 묘사"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const resultText = response.text;
    const parsedData = JSON.parse(resultText);

    return res.status(200).json(parsedData);
  } catch (error) {
    console.error('API Call Error:', error);
    return res.status(500).json({ error: 'AI 암기 카드를 생성하는 중 오류가 발생했습니다.' });
  }
}
