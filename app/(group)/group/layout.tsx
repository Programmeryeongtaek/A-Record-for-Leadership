import Link from "next/link";
import { PropsWithChildren } from "react";

import SideNavigation from "./SideNavigation";

interface MainLayoutProps extends PropsWithChildren {}

const MainLayout = ({ children }: MainLayoutProps) => {
	return (
		<main className="flex">
			<SideNavigation />
			<section className="w-8/12">
				<header className="border-b p-5">
					<div className="container flex justify-between">
						<nav className="flex gap-2">
							<Link href={"/study"}>공부하기</Link>
							<Link href={"/group"}>그룹관리</Link>
							<Link href={"/introduce"}>소개하기</Link>
						</nav>
						<div>로그인</div>
					</div>
				</header>
				<div className="px-5 py-2">{children}</div>
			</section>
		</main>
	);
};

export default MainLayout;
