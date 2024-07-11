"use client";

import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

interface Props {
	params: {
		departmentId: number;
	};
}

interface DepartmentInfo {
	id: number;
	name: string;
	member: string[];
	tags: string[];
}

interface MettingMinutes {
	departmentName: string;
	title: string;
	member: string[];
	content: string;
	date: Date;
}

const DepartmentDetailPage = ({ params }: Props) => {
	const { departmentId } = params;
	const [departmentInfo, setDepartmentInfo] = useState<DepartmentInfo | null>(null);
	const [meetingModalVisible, setMeetingModalVisible] = useState(false);
	const [meetingContent, setMeetingContent] = useState<MettingMinutes>({
		departmentName: "",
		title: "",
		member: [],
		content: "",
		date: new Date(),
	});
	const [meetingList, setMeetingList] = useState<MettingMinutes[]>([]);
	const [meetingListVisible, setMeetingListVisible] = useState(true);
	const [memberInput, setMemberInput] = useState<string>("");
	const [meetingMinutesToShow, setMeetingMinutesToShow] = useState<number>(10);

	const router = useRouter();

	useEffect(() => {
		const fetchMeetingMinutes = async () => {
			try {
				const { data, error } = await supabase.from("MettingMinutes").select("*");
				if (error) throw error;
				setMeetingList(data || []);
			} catch (error) {
				console.error("회의 정보를 불러오는 데 실패했습니다.:");
			}
		};
		fetchMeetingMinutes();
	}, []);

	const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		if (name === "date") {
			setMeetingContent((prev) => ({
				...prev,
				[name]: new Date(value),
			}));
		} else {
			setMeetingContent((prev) => ({
				...prev,
				[name]: value,
			}));
		}
	};

	const createMeeting = async (e: FormEvent) => {
		e.preventDefault();

		try {
			if (!meetingContent.title || !meetingContent.date || !meetingContent.content || !meetingContent.departmentName) {
				throw new Error("모든 필드를 입력해야 합니다.");
			}
			const { error } = await supabase.from("MeetingMinutes").insert([meetingContent]);
			if (error) throw error;

			setMeetingModalVisible(false);
			setMeetingList((prev) => [...prev, meetingContent]);
			setMeetingContent({
				departmentName: "",
				title: "",
				member: [],
				content: "",
				date: new Date(),
			});
		} catch (error) {
			console.error("회의록을 작성하는 데, 실패했습니다.");
		}
	};

	useEffect(() => {
		const fetchDepartment = async () => {
			try {
				if (departmentId) {
					const { data, error } = await supabase.from("Department").select("*").eq("id", departmentId).single();
					if (error) throw error;
					setDepartmentInfo(data || null);
				}
			} catch (error) {
				console.error("마을 정보를 불러오는 데 실패했습니다:");
			}
		};

		fetchDepartment();
	}, [departmentId]);

	const handleMemberInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setMemberInput(e.target.value);
	};

	const addMember = () => {
		if (memberInput.trim() !== "") {
			setMeetingContent((prev) => ({
				...prev,
				member: [...prev.member, memberInput.trim()],
			}));
			setMemberInput("");
		}
	};

	const removeMember = (index: number) => {
		setMeetingContent((prev) => ({
			...prev,
			member: prev.member.filter((_, i) => i !== index),
		}));
	};

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 1200) {
				setMeetingMinutesToShow(10);
			} else if (window.innerWidth > 768) {
				setMeetingMinutesToShow(8);
			} else {
				setMeetingMinutesToShow(5);
			}
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

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
						<button onClick={() => setMeetingModalVisible(true)}>생성</button>

						{meetingModalVisible && (
							<div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-800 bg-opacity-50">
								<div className="w-full rounded-lg bg-white p-4 shadow-lg">
									<h2>회의록 작성</h2>
									<form onSubmit={createMeeting}>
										<div>
											<label htmlFor="title">
												제목
												<input id="title" name="title" type="text" value={meetingContent.title} onChange={handleInputChange} required />
											</label>
											<label htmlFor="date">
												날짜
												<input
													id="date"
													name="date"
													type="date"
													value={meetingContent.date.toISOString().split("T")[0]}
													onChange={handleInputChange}
													required
												/>
											</label>
											<label htmlFor="content">
												내용
												<textarea
													id="content"
													name="content"
													value={meetingContent.content}
													onChange={handleInputChange}
													required
													className="w-full resize-none"
												/>
											</label>
											<label htmlFor="departmentName">
												부서명
												<input
													id="departmentName"
													name="departmentName"
													type="text"
													value={meetingContent.departmentName}
													onChange={handleInputChange}
													required
												/>
											</label>
											<div>
												<label htmlFor="member">구성원 추가</label>
												<div className="flex items-center">
													<input id="member" type="text" value={memberInput} onChange={handleMemberInputChange} />
													<button type="button" onClick={addMember}>
														추가
													</button>
												</div>
												<ul>
													{meetingContent.member.map((member, index) => (
														<li key={index} className="flex items-center">
															{member}
															<button type="button" onClick={() => removeMember(index)}>
																삭제
															</button>
														</li>
													))}
												</ul>
											</div>
											<button type="button" onClick={() => setMeetingModalVisible(false)}>
												취소
											</button>
											<button type="submit">저장</button>
										</div>
									</form>
								</div>
							</div>
						)}
					</div>
					{/* //TODO: Link로 연결 + 노션처럼 소켓을 사용하기 */}
					<ol>
						{meetingList.slice(0, meetingMinutesToShow).map((meeting, index) => (
							<li key={index}>
								<div>
									<h1>{meeting.title}</h1>
									<h2>{meeting.date.toLocaleDateString()}</h2>
								</div>
								<p>{meeting.departmentName}</p>
								<p>{meeting.content}</p>
								<p>{meeting.member.join(", ")}</p>
							</li>
						))}
					</ol>
				</div>
			</main>
		</div>
	);
};

export default DepartmentDetailPage;
