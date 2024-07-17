"use client";

import { supabase } from "@/utils/supabase";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

interface Notice {
	id: number;
	title: string;
	content: string;
	keyword: string[];
	date: Date;
}

type NoticeCreatePayload = Omit<Notice, "id">;

interface EncouragementMessage {
	id: number;
	message: string;
}

interface DepartmentInfo {
	id: number;
	name: string;
	member: string[];
	tags: string[];
}

type DepartmentInfoCreatePayload = Omit<DepartmentInfo, "id">;

const GroupPage = () => {
	const [message, setMessage] = useState<string>("");
	const [messageList, setMessageList] = useState<EncouragementMessage[]>([]);
	const [newNotice, setNewNotice] = useState<NoticeCreatePayload>({ title: "", content: "", keyword: [], date: new Date() });
	const [noticeList, setNoticeList] = useState<Notice[]>([]);
	const [noticeModalVisible, setNoticeModalVisible] = useState(false);
	const [selectedNoticeModalVisible, setSelectedNoticeModalVisible] = useState(false);
	const [departmentModalVisible, setDepartmentModalVisible] = useState(false);
	const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
	const [itemsToShow, setItemsToShow] = useState(5);
	const [noticeListVisible, setNoticeListVisible] = useState(true);
	const [departmentList, setDepartmentList] = useState<DepartmentInfo[]>([]);
	const [departmentInfo, setDepartmentInfo] = useState<DepartmentInfoCreatePayload>({ name: "", member: [], tags: [] });
	const [messageCharCount, setMessageCharCount] = useState<number>(0);
	const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(0);
	const [keywordInput, setKeywordInput] = useState<string>("");
	const [filteredNoticeList, setFilteredNoticeList] = useState<Notice[]>([]);
	const [additionalSearchVisible, setAdditionalSearchVisible] = useState<boolean>(false);
	const [additionalKeywords, setAdditionalKeywords] = useState<string[]>(["", ""]);
	const [additionalSearchCount, setAdditionalSearchCount] = useState<number>(0);

	const router = useRouter();
	const keywordInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (keywordInputRef.current) keywordInputRef.current.focus();
	}, [newNotice.keyword, additionalKeywords, additionalSearchCount]);

	const fetchNotice = async () => {
		try {
			const { data, error } = await supabase.from("Notice").select("*");
			if (error) throw error;
			setNoticeList(data || []);
			setFilteredNoticeList(data || []);
		} catch (error) {
			console.error("공지사항을 불러오는 중 오류가 발생했습니다:", error);
		}
	};

	const addNotice = async (e: FormEvent) => {
		e.preventDefault();

		try {
			const { data, error } = await supabase.from("Notice").insert([newNotice]).select("*");
			if (error) throw error;

			setNoticeModalVisible(false);
			if (data && data.length > 0) setNoticeList((prev) => [...prev, data[0]]);
			setNewNotice({ title: "", content: "", keyword: [], date: new Date() });
		} catch (error) {
			console.error("공지사항을 등록하는 중 오류가 발생했습니다:", error);
		}
	};

	const cancelNotice = () => {
		setNoticeModalVisible(false);
		setNewNotice({ title: "", content: "", keyword: [], date: new Date() });
	};

	const handleKeywordInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setKeywordInput(value);
		filterNotices(value, additionalKeywords);
	};

	const filterNotices = (keyword: string, keywords: string[]) => {
		if (keyword.trim() === "" && keywords.every((kw) => kw.trim() === "")) {
			setFilteredNoticeList(noticeList);
		} else {
			const allKeywords = [keyword, ...keywords];
			const filteredNotices = noticeList.filter((notice) =>
				allKeywords.every((kw) => kw.trim() === "" || notice.keyword.some((noticeKw) => noticeKw.toLowerCase().includes(kw.toLowerCase()))),
			);
			setFilteredNoticeList(filteredNotices);
		}
	};

	const addKeyword = () => {
		if (keywordInput.trim() !== "") {
			setNewNotice((prev) => ({
				...prev,
				keyword: [...prev.keyword, keywordInput.trim()],
			}));
			setKeywordInput("");
			if (keywordInputRef.current) keywordInputRef.current.focus();
		}
	};

	const removeKeyword = (index: number) => {
		setNewNotice((prev) => ({
			...prev,
			keyword: prev.keyword.filter((_, i) => i !== index),
		}));
	};

	const handleKeyword = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			addKeyword();
		}
	};
	const handleAdditionalKeywordInputChange = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		const newKeywords = [...additionalKeywords];
		newKeywords[index] = value;
		setAdditionalKeywords(newKeywords);
		filterNotices(keywordInput, newKeywords);
	};

	const addAdditionalSearch = () => {
		if (additionalSearchCount < 2) {
			setAdditionalSearchCount(additionalSearchCount + 1);
		}
	};

	const fetchDepartment = async () => {
		try {
			const { data, error } = await supabase.from("Department").select("*");
			if (error) throw error;
			setDepartmentList(data || []);
		} catch (error) {
			console.error("마을 정보를 불러오는 중 오류가 발생했습니다:", error);
		}
	};

	useEffect(() => {
		fetchNotice();
		fetchDepartment();
		fetchMessage();
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		if (name === "date") {
			setNewNotice((prev) => ({
				...prev,
				[name]: new Date(value),
			}));
		} else {
			setNewNotice((prev) => ({
				...prev,
				[name]: value,
			}));
		}
	};

	const fetchMessage = async () => {
		try {
			const { data, error } = await supabase.from("EncouragementMessage").select("*").order("id", { ascending: false });
			if (error) {
				throw error;
			}
			setMessageList(data);
		} catch (error) {
			alert("데이터를 가져오는 데 실패했습니다.");
		}
	};

	const handleNoticeClick = (notice: Notice) => {
		setSelectedNotice(notice);
		setSelectedNoticeModalVisible(true);
	};

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();

		if (!message) {
			alert("메시지를 작성해주세요.");
			return;
		}

		try {
			const { data, error } = await supabase.from("EncouragementMessage").insert([{ message }]).select("*");

			if (error) {
				throw error;
			}

			setMessageList([...messageList, { id: data[0].id, message: message }]);
			setMessage("");
			setMessageCharCount(0);
		} catch (error) {
			alert("데이터를 저장하는 데 실패했습니다.");
		}
	};

	const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setMessage(e.target.value);
		setMessageCharCount(e.target.value.length);
	};

	const handleResize = () => {
		if (window.innerWidth >= 1200) {
			setItemsToShow(5);
		} else if (window.innerWidth >= 768) {
			setItemsToShow(4);
		} else {
			setItemsToShow(3);
		}
	};

	const createDepartment = async () => {
		try {
			const { data, error } = await supabase.from("Department").insert([departmentInfo]).select("*");
			if (error) throw error;
			router.push(`/group/department/${data[0].id}`);
		} catch (error) {
			console.error("마을을 생성하는 데 실패했습니다:", message);
		}
	};

	const deleteNotice = async (id: number) => {
		const confirmDelete = confirm("정말로 삭제하시겠습니까? 내용이 다시 복구되지 않습니다.");

		if (!confirmDelete) return;

		try {
			const { error } = await supabase.from("Notice").delete().eq("id", id);
			if (error) throw error;

			setNoticeList(noticeList.filter((notice) => notice.id !== id));
			setSelectedNoticeModalVisible(false);
			router.push("/group/department");
		} catch (error) {
			alert("공지사항 삭제하는 데 싪패했습니다.");
		}
	};

	const deleteDepartment = async (id: number) => {
		const confirmDelete = confirm("정말로 삭제하시겠습니까? 내용이 다시 복구되지 않습니다.");

		if (!confirmDelete) return;

		try {
			const { error } = await supabase.from("Department").delete().eq("id", id);
			if (error) throw error;
			// TODO: 콘솔로그에 406 error가 발생한다. 이를 해결해야 한다.
			setDepartmentList(departmentList.filter((department) => department.id !== id));
			router.push("/group/department");
		} catch (error) {
			alert("마을 정보를 삭제하는 데 실패했습니다.");
		}
	};

	const deleteMessage = async (id: number) => {
		const confirmDelete = confirm("정말로 삭제하시겠습니까? 내용이 다시 복구되지 않습니다.");

		if (!confirmDelete) return;

		try {
			const { error } = await supabase.from("EncouragementMessage").delete().eq("id", id);
			if (error) throw error;
			setMessageList(messageList.filter((message) => message.id !== id));
		} catch (error) {
			alert("메시지를 삭제하는 데 실패했습니다.");
		}
	};

	const previousMessage = () => {
		setCurrentMessageIndex((prevIndex) => (prevIndex === 0 ? messageList.length - 1 : prevIndex - 1));
	};

	const nextMessage = () => {
		setCurrentMessageIndex((prevIndex) => (prevIndex === messageList.length - 1 ? 0 : prevIndex + 1));
	};

	useEffect(() => {
		const interval = setInterval(() => {
			nextMessage();
		}, 5000);

		return () => clearInterval(interval);
	}, [messageList, currentMessageIndex]);

	return (
		<section className="flex flex-col gap-4">
			<header className="gpa-2 flex flex-col gap-4 p-2">
				<div className="flex justify-between">
					<h1>공지사항</h1>
					<button onClick={() => setNoticeModalVisible(true)}>등록</button>
				</div>
				<div className="flex">
					<input type="text" value={keywordInput} onChange={handleKeywordInputChange} placeholder="키워드 검색" />
					{[...Array(additionalSearchCount)].map((_, index) => (
						<div key={index}>
							<input
								type="text"
								placeholder="추가 키워드 검색"
								onChange={handleAdditionalKeywordInputChange(index)}
								ref={index === additionalSearchCount - 1 ? keywordInputRef : null}
							/>
						</div>
					))}
					<button onClick={addAdditionalSearch}>추가 검색</button>
				</div>
				<div className="flex flex-col">
					<ul className="flex max-h-[200px] flex-col gap-2 overflow-hidden transition-all hover:cursor-pointer">
						{filteredNoticeList.map((notice, index) => (
							<li key={index} onClick={() => handleNoticeClick(notice)} className="flex justify-between">
								<div className="flex">
									<p>{index + 1}。</p>
									<p>{notice.title}</p>
								</div>
								<div className="flex gap-2">
									<p>{notice.keyword.join(", ")}</p>
									<p>| {new Date(notice.date).toLocaleDateString()}</p>
								</div>
							</li>
						))}
					</ul>
					{/* // TODO: 토글 : 최대 7, 6, 5개 -- 최소 기기별 최소 갯수 */}
					{noticeList.length > itemsToShow && <button>{noticeListVisible ? "▼" : "▲"}</button>}
				</div>

				{noticeModalVisible && (
					<div className="fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-slate-400 bg-opacity-50">
						<div className="flex h-[650px] w-[1000px] flex-col gap-3 rounded-lg bg-white p-6 shadow-lg">
							<div className="flex flex-col items-center">
								<h2>공지 등록</h2>
								<div className="my-2 w-full border-b border-b-black" />
							</div>
							<form onSubmit={addNotice} className="flex w-full flex-col justify-between gap-4">
								<div className="flex justify-between">
									<div className="flex flex-col gap-4">
										<label htmlFor="title" className="flex items-center justify-between gap-3">
											제목
											<input
												id="title"
												name="title"
												type="text"
												value={newNotice.title}
												onChange={handleInputChange}
												placeholder="제목을 입력해주세요."
												className="w-[300px] rounded-2xl border p-4"
											/>
										</label>
										<label htmlFor="keyword" className="flex items-center justify-between gap-3">
											키워드
											<input
												id="keyword"
												type="text"
												value={keywordInput}
												onChange={handleKeywordInputChange}
												onKeyDown={handleKeyword}
												ref={keywordInputRef}
												placeholder="키워드"
												className="w-[300px] rounded-2xl border p-4"
											/>
										</label>
									</div>
									<div>
										<label htmlFor="date" className="flex items-center gap-4">
											모임 일시
											<input
												id="date"
												name="date"
												type="date"
												value={newNotice.date.toISOString().split("T")[0]}
												onChange={handleInputChange}
												required
												className="rounded-2xl p-4"
											/>
										</label>
									</div>
								</div>
								<ol className="flex flex-wrap gap-2">
									{newNotice.keyword.map((keyword, index) => (
										<li key={index} className="flex items-center gap-[2px]">
											<span>#{keyword}</span>
											<button type="button" onClick={() => removeKeyword(index)} className="flex rounded-full border border-black text-[14px]">
												<CloseIcon fontSize="inherit" />
											</button>
										</li>
									))}
								</ol>

								<label htmlFor="content">
									내용
									<textarea
										id="content"
										name="content"
										value={newNotice.content}
										onChange={handleInputChange}
										placeholder="내용을 입력해주세요."
										className="h-[320px] w-full rounded-2xl border p-4"
									/>
								</label>
								<div className="flex justify-end gap-4">
									<button type="reset" onClick={cancelNotice}>
										취소
									</button>
									<button type="submit" onClick={addNotice}>
										등록
									</button>
								</div>
							</form>
						</div>
					</div>
				)}

				{selectedNoticeModalVisible && (
					<div className="fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-slate-400 bg-opacity-50">
						<div className="relative flex h-[650px] w-[1000px] flex-col gap-3 rounded-lg bg-white p-6 shadow-lg">
							<div className="flex flex-col items-center">
								<h2>공지사항 상세보기</h2>
								<div className="my-2 w-full border-b border-b-black" />
								<button
									type="button"
									onClick={() => setSelectedNoticeModalVisible(false)}
									className="absolute right-[7px] top-[7px] flex rounded-full border border-black"
								>
									<CloseIcon />
								</button>
							</div>
							{selectedNotice && (
								<div className="flex w-full flex-col justify-between gap-4">
									<div className="flex flex-col gap-4">
										<div className="flex justify-between">
											<h3>제목 | {selectedNotice.title}</h3>
											<div className="flex gap-4">
												<button
													type="button"
													onClick={() => {
														setSelectedNoticeModalVisible(false);
													}}
												>
													수정하기
												</button>
												{/* // TODO: code가 지저분하므로 리팩토링 방법 찾기 */}
												<button
													type="button"
													onClick={() => {
														if (selectedNotice) {
															deleteNotice(selectedNotice.id);
														}
													}}
												>
													삭제하기
												</button>
											</div>
										</div>
										<p>키워드 | #{selectedNotice.keyword.join(" #")}</p>
										<p className="absolute right-6 top-8 flex items-center gap-2">
											{newNotice.date.toISOString().replace("T", " ").split(":").slice(0, 2).join(":")}
										</p>
									</div>

									<div className="flex flex-col gap-1">
										<p>내용</p>
										<span className="h-[450px] rounded-lg border p-2">{selectedNotice.content}</span>
									</div>
								</div>
							)}
						</div>
					</div>
				)}

				{departmentModalVisible && (
					<div className="fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-gray-800 bg-opacity-50">
						<div className="flex w-4/5 flex-col gap-3 rounded-lg bg-white p-6 shadow-lg">
							<div className="flex flex-col items-center">
								<h2>마을 생성</h2>
								<div className="my-2 w-full border-b border-b-black" />
							</div>
							<label htmlFor="name">
								마을 이름
								<input
									id="name"
									name="name"
									type="text"
									value={departmentInfo.name}
									onChange={(e) => setDepartmentInfo({ ...departmentInfo, name: e.target.value })}
									placeholder="마을 이름을 입력해주세요."
									className="w-full rounded-2xl border p-4"
								/>
							</label>
							<label htmlFor="member">
								마을 멤버
								<input
									id="member"
									name="member"
									type="text"
									value={departmentInfo.member}
									onChange={(e) => setDepartmentInfo((prev) => ({ ...departmentInfo, member: [...prev.member, e.target.value] }))}
									placeholder="마을 인원 수를 입력해주세요."
									className="w-full rounded-2xl border p-4"
								/>
							</label>
							<label htmlFor="tags">
								태그
								<input
									id="tags"
									name="tags"
									type="text"
									value={departmentInfo.tags}
									onChange={(e) => setDepartmentInfo((prev) => ({ ...departmentInfo, tags: [...prev.tags, e.target.value] }))}
									placeholder="태그를 입력해주세요."
									className="w-full rounded-2xl border p-4"
								/>
							</label>
							<div className="flex justify-end gap-4">
								<button onClick={createDepartment}>생성</button>
								<button onClick={() => setDepartmentModalVisible(false)}>취소</button>
							</div>
						</div>
					</div>
				)}
			</header>
			<main className="flex flex-col gap-2">
				<div className="flex justify-end">
					<button onClick={() => setDepartmentModalVisible(true)}>마을 생성</button>
				</div>
				{/* TODO: map으로 생성 */}
				<div className="flex flex-wrap gap-4">
					{departmentList.map((department) => (
						<Link href={`/group/department/${department.id}`} key={department.id} className="h-[250px] w-[250px] flex-col rounded-lg border shadow-lg">
							<div className="relative flex h-[150px] w-[250px]">
								썸네일
								<button
									onClick={(e) => {
										e.preventDefault();
										deleteDepartment(department.id);
									}}
									className="absolute right-[1%] top-[1%] z-0"
								>
									<DeleteForeverIcon />
								</button>
							</div>
							<h2>{department.name}</h2>
							<p>{department.member}</p>
							<span>{department.tags}</span>
						</Link>
					))}
				</div>
			</main>
			<footer className="flex flex-col gap-2">
				<form className="flex flex-col" onSubmit={onSubmit}>
					{/* // TODO: 응원 {messageList.length}개를 하면 에러가 발생함 */}
					<label htmlFor="encouragement">응원</label>
					<textarea
						id="encouragement"
						name="encouragement"
						placeholder="응원 메시지를 남겨주세요~"
						value={message}
						onChange={handleMessageChange}
						className="p-4"
						maxLength={100}
					/>
					<div className="mt-2 flex justify-between">
						<span>{messageCharCount} / 100</span>
						<button type="submit">작성</button>
					</div>
				</form>
				<div>
					{/* // TODO: swiper 또는 pagination */}
					{messageList.length > 0 && (
						<div>
							<button onClick={previousMessage}>이전</button>
							<div className="overflow relative h-[250px] w-[250px] overflow-hidden border p-6 leading-6">
								{messageList.length > 0 && <p key={messageList[currentMessageIndex].id}>{messageList[currentMessageIndex].message}</p>}
								<button onClick={() => deleteMessage(messageList[currentMessageIndex].id)} className="absolute right-[1%] top-[1%]">
									<DeleteForeverIcon />
								</button>
							</div>
							<button onClick={nextMessage}>다음</button>
						</div>
					)}
				</div>
			</footer>
		</section>
	);
};

export default GroupPage;
