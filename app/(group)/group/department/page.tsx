"use client";

import { supabase } from "@/utils/supabase";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

interface EncouragementMessage {
	id: number;
	message: string;
}

const GroupPage = () => {
	const [message, setMessage] = useState<string>("");
	const [messageList, setMessageList] = useState<EncouragementMessage[]>([]);

	useEffect(() => {
		fetchMessage();
	}, []);

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
				<h1>공지사항</h1>
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
