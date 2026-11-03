// 응답이 실패(4xx, 5xx)면 서버가 준 메시지로 예외를 던진다
export const checkResponse = async (response) => {
  if (response.ok) return response;
  const err = await response.json().catch(() => null);
  const detail = err?.errors ? Object.values(err.errors).join("\n") : "";
  throw new Error(detail || err?.message || "요청에 실패했습니다.");
};