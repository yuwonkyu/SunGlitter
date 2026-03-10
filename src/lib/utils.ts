/**
 * 이름의 2번째 글자를 `*`로 마스킹합니다 (개인정보 보호).
 * 예: "김철수" → "김*수", "홍길동" → "홍*동", "이" → "이"
 */
export const maskName = (name: string): string => {
  if (name.length < 2) return name;
  return name[0] + "*" + name.slice(2);
};
