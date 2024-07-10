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

	const fetchNotice = async () => {
		try {
			const { data, error } = await supabase.from("Notice").select("*");
			if (error) throw error;
			setNotices(data || []);
		} catch (error) {
			console.error("공지사항을 불러오는 중 오류가 발생했습니다:", message);
		}
	};

	useEffect(() => {
		fetchNotice();
	}, []);

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
		fetchMessage();
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

	return (
		<section className="flex flex-col gap-4">
			<header className="gpa-2 flex h-[100px] flex-col border">
				<div className="flex justify-between">
					<h1>공지사항</h1>
					<button onClick={() => setModalVisible(true)}>등록</button>
				</div>
				<div>
					<ul>
						{notices.map((notice) => (
							<li key={notice.id} onClick={() => handleNoticeClick(notice)}>
								{notice.title}
							</li>
						))}
					</ul>
				</div>

				{modalVisible && selectedNotice && (
					<div>
						<h2>{selectedNotice.title}</h2>
						<p>{selectedNotice.content}</p>
						<button onClick={() => setModalVisible(false)}>X</button>
					</div>
				)}

				{modalVisible && (
					<div className="z-10 h-[50px] w-[50px]">
						<h2>공지 등록</h2>
						<label htmlFor="title">제목:</label>
						<input id="title" name="title" type="text" value={newNotice.title} onChange={handleChange} placeholder="제목을 입력해주세요." />
						<label htmlFor="content">내용:</label>
						<textarea id="content" name="content" value={newNotice.content} onChange={handleChange} placeholder="내용을 입력해주세요." />
						<button onClick={addNotice}>등록</button>
						<button onClick={() => setModalVisible(false)}>취소</button>
					</div>
				)}
			</header>
			<main className="flex gap-2">
				{/* TODO: map으로 생성 */}
				<Link href="/">
					<div className="flex h-[300px] w-[300px] flex-col gap-2 rounded-[10px] border">
						<Image src="" width={300} height={250} alt="썸네일" />
						<hr />
						<div className="bottom-0 flex flex-col gap-1 p-1">
							<h3>부서명</h3>
							<span>소속멤버 이름 열거</span>
							<span>#특징</span>
						</div>
					</div>
				</Link>
				<Link href="/">
					<div className="h-[300px] w-[300px] rounded-[10px] border">부서명</div>
				</Link>
				<Link href="/">
					{" "}
					<div className="h-[300px] w-[300px] rounded-[10px] border">부서명</div>
				</Link>
				<Link href="/">
					{" "}
					<div className="h-[300px] w-[300px] rounded-[10px] border">부서명</div>
				</Link>
			</main>
			<footer className="flex flex-col gap-2">
				<h3>응원</h3>
				<form className="flex" onSubmit={onSubmit}>
					<textarea id="comment" name="comment" placeholder="응원 메시지를 남겨주세요~" value={message} onChange={(e) => setMessage(e.target.value)} />
					<button type="submit">작성</button>
				</form>
				<div>
					<ol className="flex gap-4">
						{messageList.map((message, i) => (
							<li key={i}>{message.message}</li>
						))}
					</ol>
				</div>
			</footer>
		</section>
	);
};

export default GroupPage;
