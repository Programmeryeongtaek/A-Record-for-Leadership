import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="flex justify-between">
      <div className="flex gap-4">
        <Link href="/" className="flex">
          <Image src="" alt="로고" />
          <span>리더십을 위한 기록공간</span>
        </Link>
        <div className="flex gap-2">
          {/* TODO: 추가 링크 작성 */}
          <Link href="/">이동 주소</Link>
          <Link href="/">이동 주소</Link>
        </div>
      </div>
      <div className="flex">
        <Link href="/login">로그인</Link>
      </div>
    </header>
  );
};

export default Header;
