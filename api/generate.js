JavaScript
async function askAI(userInputText) {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // 👈 필수!
      },
      // 👈 Key 이름을 'prompt'로 명확히 지정해줘야 합니다.
      body: JSON.stringify({ prompt: userInputText }), 
    });

    const data = await response.json();

    if (!response.ok) {
      alert(`오류 발생: ${data.error}`);
      return;
    }

    console.log("AI 응답:", data.result);
    // 화면에 결과 표시 로직...

  } catch (error) {
    console.error("요청 실패:", error);
  }
}
