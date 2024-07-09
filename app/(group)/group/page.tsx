import Link from "next/link";

const GroupListPage = () => {
	return (
		<div>
			<header>
				<h1>전체 공지</h1>
				{/* TODO: 공지 최신순 5개만 - 모바일 때는 3개만 dropdown 형식으로 펼치기*/}
				<ol>
					<li>공지1</li>
					<li>공지2</li>
					<li>공지3</li>
					<li>공지4</li>
					<li>공지5</li>
				</ol>
			</header>
			<main>
				<div className="flex">
					<input type="text" />
					<button>검색</button>
					<div>드랍다운</div>
				</div>
				<section></section>
			</main>
		</div>
	);
};

export default GroupListPage;
