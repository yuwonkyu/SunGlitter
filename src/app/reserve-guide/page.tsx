export default function ReserveGuidePage() {
  return (
    <div className="paper-bg min-h-screen px-5 py-8">
      <main className="mx-auto w-full max-w-md">
        <section className="fade-up rounded-2xl border border-(--line) bg-(--card) p-6 shadow-[0_8px_24px_rgba(0,0,0,0.07)]">
          <h1 className="text-2xl font-bold mb-2">예약 안내</h1>
          <p className="mb-4 text-sm text-(--muted)">
            인스타그램 DM으로 아래 양식에 맞춰 예약 신청을 해주세요.<br />
            <span className="font-semibold">@yoonseul.house</span> 계정으로 보내주시면 상담 후 예약 일정을 잡아드립니다.
          </p>
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-1">DM 예약 신청 양식</h2>
            <div className="rounded bg-zinc-50 border border-zinc-200 p-3 text-sm">
              <div className="mb-2">
                <span className="font-medium">1. 예약자</span> <span className="text-zinc-500">예시: 홍길동</span>
              </div>
              <div className="mb-2">
                <span className="font-medium">2. 예약 날짜</span> <span className="text-zinc-500">예시: 2026-04-10</span>
              </div>
              <div className="mb-2">
                <span className="font-medium">3. 예약 시간</span> <span className="text-zinc-500">예시: 14:00~16:00</span>
              </div>
              <div className="mb-2">
                <span className="font-medium">4. 촬영 인원</span> <span className="text-zinc-500">예시: 3명</span>
              </div>
              <div className="mb-2">
                <span className="font-medium">5. 촬영 목적</span> <span className="text-zinc-500">예시: 가족사진</span>
              </div>
              <div>
                <span className="font-medium">6. 요청사항</span> <span className="text-zinc-500">예시: 삼각대 및 조명을 빌릴 수 있을까요?</span>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-1">안내 및 주의사항</h2>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>예약 시간은 <b>촬영준비, 촬영, 촬영정리</b> 모든 시간을 포함한 시간입니다.</li>
              <li>스튜디오 이용 후 <b>처음과 같이 정리</b>해 주세요.</li>
              <li>양식에 맞게 DM 주시면 상담 후 예약 일정을 잡아드립니다.</li>
              <li>예약 확정 전에는 일정이 보류될 수 있습니다.</li>
              <li>예약 변경/취소는 최소 하루 전에 꼭 연락해 주세요.</li>
              <li>스튜디오 내 음식물 반입, 흡연, 반려동물 출입은 제한될 수 있습니다.</li>
              <li>기타 문의사항은 DM으로 언제든 문의해 주세요.</li>
            </ul>
          </div>
          <a href="https://www.instagram.com/yoonseul.house/" target="_blank" rel="noopener noreferrer" className="block w-full mt-4 text-center rounded-md bg-zinc-900 px-3 py-2 text-sm text-white font-semibold">인스타그램 DM 보내기</a>
        </section>
      </main>
    </div>
  );
}
