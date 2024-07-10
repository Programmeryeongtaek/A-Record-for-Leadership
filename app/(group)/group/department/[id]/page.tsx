"use client";

import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";

interface Props {
	params: {
		id: number;
	};
}

interface DepartmentInfo {
	id: number;
	name: string;
	member: string[];
	tags: string[];
}

const DepartmentDetailPage = ({ params }: Props) => {
	const { id } = params;
	const [departmentInfo, setDepartmentInfo] = useState<DepartmentInfo | null>(null);

	useEffect(() => {
		const fetchDepartment = async () => {
			try {
				if (id) {
					const { data, error } = await supabase.from("Department").select("*").eq("id", id).single();
					if (error) throw error;
					setDepartmentInfo(data || null);
				}
			} catch (error) {
				console.error("마을 정보를 불러오는 데 실패했습니다:");
			}
		};

		fetchDepartment();
	}, [id]);

	if (!departmentInfo) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<header>
				<h1>{departmentInfo.name} 마을에 오신 것을 환영합니다!!</h1>
				<p>구성원 : {departmentInfo.member}</p>
				<span>태그 : {departmentInfo.tags}</span>
			</header>
			<main className="flex flex-col">
				<div>
					<div className="flex justify-between">
						<h2>가족 현황 및 회의</h2>
						<button>생성</button>
					</div>
					{/* //TODO: Link로 연결 + 노션처럼 소켓을 사용하기 */}
					<ol>
						<li>00월 00일 회의</li>
					</ol>
				</div>
			</main>
		</div>
	);
};

export default DepartmentDetailPage;
