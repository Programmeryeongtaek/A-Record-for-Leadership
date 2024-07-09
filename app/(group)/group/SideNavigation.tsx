import Link from "next/link";

const SideNavigation = () => {
	return (
		<aside className="h-screen w-4/12 border-r border-gray-300 p-5">
			<h1 className="text-lg font-bold">목록</h1>
			<div className="mt-4 border"></div>
			<div className="mt-4">
				<ul>
					<li>
						<Link
							href={"/group/department"}
							className="flex items-center gap-2 rounded px-3 py-2 text-gray-600 hover:bg-gray-100 hover:font-bold hover:text-gray-800"
						>
							마을
						</Link>
						<Link
							href={"/group/administration"}
							className="flex items-center gap-2 rounded px-3 py-2 text-gray-600 hover:bg-gray-100 hover:font-bold hover:text-gray-800"
						>
							행정
						</Link>
						<Link
							href={"/group/education"}
							className="flex items-center gap-2 rounded px-3 py-2 text-gray-600 hover:bg-gray-100 hover:font-bold hover:text-gray-800"
						>
							교육
						</Link>
						<Link
							href={"/group/gathering"}
							className="flex items-center gap-2 rounded px-3 py-2 text-gray-600 hover:bg-gray-100 hover:font-bold hover:text-gray-800"
						>
							소그룹
						</Link>
					</li>
				</ul>
			</div>
		</aside>
	);
};

export default SideNavigation;
