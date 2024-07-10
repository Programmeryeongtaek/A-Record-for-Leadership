"use client";

import { supabase } from "@/utils/supabase";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

interface Notice {
	id: number;
	title: string;
	content: string;
}

interface EncouragementMessage {
	id: number;
	message: string;
}

const GroupPage = () => {
	const [message, setMessage] = useState<string>("");
	const [messageList, setMessageList] = useState<EncouragementMessage[]>([]);
	const [newNotice, setNewNotice] = useState({ title: "", content: "" });
	const [notices, setNotices] = useState<Notice[]>([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
	const [itemsToShow, setItemsToShow] = useState(5);
	const [listVisible, setListVisible] = useState(true);

	const fetchNotice = async () => {
		try {
			const { data, error } = await supabase.from("Notice").select("*");
			if (error) throw error;
			setNotices(data || []);
		} catch (error) {
			console.error("공지사항을 불러오는 중 오류가 발생했습니다:", message);
		}
	};

	const addNotice = async () => {
		try {
			const { data, error } = await supabase.from("Notice").insert([newNotice]).select("*");
			if (error) throw error;
			setNotices([...notices, data[0]]);
			setNewNotice({ title: "", content: "" });
			setModalVisible(false);
		} catch (error) {
			console.error("공지사항을 등록하는 중 오류가 발생했습니다:", message);
		}
	};

	useEffect(() => {
		fetchNotice();
		fetchMessage();
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setNewNotice({ ...newNotice, [e.target.name]: e.target.value });
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
		setModalVisible(true);
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
		} catch (error) {
			alert("데이터를 저장하는 데 실패했습니다.");
		}
	};

	const handleResize = () => {
		if (window.innerWidth >= 1200) {
			setItemsToShow(5);
		} else if (window.innerWidth > 768) {
			setItemsToShow(4);
		} else {
			setItemsToShow(3);
		}
	};

	return (
		<section className="flex flex-col gap-4">
			<header className="gpa-2 flex flex-col gap-4 border p-2">
				<div className="flex justify-between">
					<h1>공지사항</h1>
					<button onClick={() => setModalVisible(true)}>등록</button>
				</div>
				<div className="flex flex-col">
					<ul className={`overflow-hidden transition-all ${listVisible ? "max-h-[200px]" : "max-h-0"} flex flex-col gap-2 hover:cursor-pointer`}>
						{notices.slice(0, itemsToShow).map((notice) => (
							<li key={notice.id} onClick={() => handleNoticeClick(notice)}>
								{notice.title}
							</li>
						))}
					</ul>
					{/* // TODO: 토글 : 최대 7, 6, 5개 -- 최소 기기별 최소 갯수 */}
					{notices.length > itemsToShow && <button>{listVisible ? "▼" : "▲"}</button>}
				</div>

				{modalVisible && (
					<div className="fixed left-0 top-0 flex h-full w-full items-center justify-center">
						<div className="flex w-4/5 flex-col gap-3 rounded-lg bg-white p-6 shadow-lg">
							<div className="flex flex-col items-center">
								<h2>공지 등록</h2>
								<div className="my-2 w-full border-b border-b-black" />
							</div>
							<label htmlFor="title">
								제목
								<input
									id="title"
									name="title"
									type="text"
									value={newNotice.title}
									onChange={handleChange}
									placeholder="제목을 입력해주세요."
									className="w-full rounded-2xl border p-4"
								/>
							</label>
							<label htmlFor="content">
								내용
								<textarea
									id="content"
									name="content"
									value={newNotice.content}
									onChange={handleChange}
									placeholder="내용을 입력해주세요."
									className="h-[300px] w-full rounded-2xl border p-4"
								/>
							</label>
							<div className="flex justify-end gap-4">
								<button onClick={addNotice}>등록</button>
								<button onClick={() => setModalVisible(false)}>취소</button>
							</div>
						</div>
					</div>
				)}
			</header>
			<main className="flex flex-col gap-2">
				<button onClick={() => console.log("마을 생성")}>생성하기</button>
				{/* TODO: map으로 생성 */}
				<div></div>
			</main>
			<footer className="flex flex-col gap-2">
				<form className="flex flex-col" onSubmit={onSubmit}>
					<label htmlFor="encouragement">응원</label>
					<textarea
						id="encouragement"
						name="encouragement"
						placeholder="응원 메시지를 남겨주세요~"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						className="p-4"
					/>
					<div className="flex justify-end">
						<button type="submit">작성</button>
					</div>
				</form>
				<div>
					{/* // TODO: swiper 또는 pagination */}
					<ol className="flex flex-wrap gap-4">
						{messageList.map((message, i) => (
							<li key={i} className="h-[250px] w-[250px] border">
								{message.message}
							</li>
						))}
					</ol>
				</div>
			</footer>
		</section>
	);
};

export default GroupPage;
