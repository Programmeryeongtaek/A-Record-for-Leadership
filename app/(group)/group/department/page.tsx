import Image from "next/image";
import Link from "next/link";

const GroupPage = () => {
	return (
		<section className="flex flex-col gap-4">
			<header className="gpa-2 flex h-[100px] flex-col border">
				<h1>공지사항</h1>
			</header>
			<main className="flex gap-2">
				{/* TODO: map으로 생성 */}
				<Link href="/">
					<div className="flex h-[300px] w-[300px] flex-col gap-2 rounded-[10px] border">
						<Image src="" width={300} height={250} alt="썸네일" />
						<hr />
						<div className="bottom-0 flex flex-col gap-1 p-1">
							<h3>부서명</h3>
							<span>소속멤버 이름 열거</span>
							<span>#특징</span>
						</div>
					</div>
				</Link>
				<Link href="/">
					<div className="h-[300px] w-[300px] rounded-[10px] border">부서명</div>
				</Link>
				<Link href="/">
					{" "}
					<div className="h-[300px] w-[300px] rounded-[10px] border">부서명</div>
				</Link>
				<Link href="/">
					{" "}
					<div className="h-[300px] w-[300px] rounded-[10px] border">부서명</div>
				</Link>
			</main>
			<footer className="flex flex-col gap-2">
				<h3>응원</h3>
				<form className="flex">
					<textarea id="comment" name="comment" placeholder="응원 메시지를 남겨주세요~" />
					<button type="submit">작성</button>
				</form>
				<div>
					<ol className="flex gap-4">
						<li className="h-[200px] w-[200px] border">댓글1</li>
						<li className="h-[200px] w-[200px] border">댓글2</li>
						<li className="h-[200px] w-[200px] border">댓글3</li>
						<li className="h-[200px] w-[200px] border">댓글4</li>
						<li className="h-[200px] w-[200px] border">댓글5</li>
					</ol>
				</div>
			</footer>
		</section>
	);
};

export default GroupPage;
