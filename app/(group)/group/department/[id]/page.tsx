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
			<h1>{departmentInfo.name}</h1>
			<p>구성원 : {departmentInfo.member}</p>
			<span>태그 : {departmentInfo.tags}</span>
		</div>
	);
};

export default DepartmentDetailPage;
