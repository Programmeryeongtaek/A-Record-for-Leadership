const GatheringPage = () => {
	return (
		<div>
			{/* // TODO: dropdown 진행중 / 완료 / 예정 */}
			<div className="flex flex-col gap-4">
				모임 규칙
				<div className="flex gap-4">
					<h1>모임</h1>
					<button>모임 생성</button>
				</div>
				<div className="flex gap-4">
					{/* // TODO: 라디오로 카테고리화 */}
					모집중 | 진행중 | 완료
				</div>
			</div>
			<div>test</div>
		</div>
	);
};

export default GatheringPage;
