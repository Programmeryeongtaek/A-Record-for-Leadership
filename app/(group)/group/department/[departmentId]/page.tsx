"use client";

import { supabase } from "@/utils/supabase";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

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

	const inputRef = useRef<HTMLInputElement>(null);
	const router = useRouter();

	useEffect(() => {
		if (inputRef.current) inputRef.current.focus();
	}, [meetingContent.member]);

	useEffect(() => {
		const fetchMeetingMinutes = async () => {
			try {
				const { data, error } = await supabase.from("MeetingMinutes").select("*");
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
			if (!meetingContent.title || !meetingContent.date || !meetingContent.content) {
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
			if (inputRef.current) inputRef.current.focus();
		}
	};

	const removeMember = (index: number) => {
		setMeetingContent((prev) => ({
			...prev,
			member: prev.member.filter((_, i) => i !== index),
		}));
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			addMember();
		}
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
					<div className="my-2 border" />
					<div className="my-2 flex justify-between">
						<h2>가족 현황 및 회의</h2>
						<button onClick={() => setMeetingModalVisible(true)}>새로 만들기</button>

						{meetingModalVisible && (
							<div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-800 bg-opacity-50">
								<button onClick={() => setMeetingModalVisible(false)} className="absolute right-[15%] top-[15%] flex rounded-full border border-black">
									<CloseIcon />
								</button>
								<div className="flex h-4/5 w-4/5 flex-col items-center gap-4 rounded-lg bg-white p-10 shadow-lg">
									<h1>회의록 작성</h1>
									<form onSubmit={createMeeting} className="flex w-11/12 flex-col px-20">
										<div className="flex flex-col">
											<h2>{departmentInfo.name} 마을</h2>
											<label htmlFor="date">
												미팅 일시
												<input
													id="date"
													name="date"
													type="date"
													value={meetingContent.date.toISOString().split("T")[0]}
													onChange={handleInputChange}
													required
												/>
											</label>
											<div className="flex justify-between gap-20">
												<div className="flex gap-4">
													<div className="flex w-1/2 flex-col">
														<label htmlFor="member">구성원 : {meetingContent.member.length}명</label>
														<input
															id="member"
															type="text"
															value={memberInput}
															onChange={handleMemberInputChange}
															onKeyDown={handleKeyDown}
															ref={inputRef}
															placeholder="이름"
															className="rounded-lg border p-2 focus:outline"
														/>
													</div>
													<ol className="flex flex-wrap gap-2">
														{meetingContent.member.map((member, index) => (
															<li key={index} className="flex items-center gap-[2px]">
																<span>{member}</span>
																<button type="button" onClick={() => removeMember(index)} className="flex">
																	<CancelIcon />
																</button>
															</li>
														))}
													</ol>
												</div>
											</div>
										</div>
										<div className="my-2 border" />
										<div className="flex justify-between">
											<div className="flex gap-2">
												<label htmlFor="title" className="flex flex-col">
													키워드
												</label>
												<input id="title" name="title" type="text" value={meetingContent.title} onChange={handleInputChange} required />
											</div>
											<div className="flex justify-end gap-2">
												<button type="button" onClick={() => setMeetingModalVisible(false)}>
													취소
												</button>
												<button type="submit">저장</button>
											</div>
										</div>
										{/* //TODO: 마크다운 형태로 변경 */}
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
									</form>
								</div>
							</div>
						)}
					</div>
					<div className="my-2 border" />
					{/* //TODO: Link로 연결 + 노션처럼 소켓을 사용하기 */}
					<ol>
						{meetingList.slice(0, meetingMinutesToShow).map((meeting, index) => (
							<li key={index}>
								<div className="flex justify-between">
									<div className="flex gap-2">
										<span>[{meeting.departmentName}]</span>
										<span>{meeting.title}</span>
									</div>
									<div className="flex gap-2">
										<span>{meeting.member.join(", ")}</span>
										<span>{new Date(meeting.date).toLocaleDateString()}</span>
									</div>
								</div>
							</li>
						))}
					</ol>
				</div>
			</main>
		</div>
	);
};

export default DepartmentDetailPage;
