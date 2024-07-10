"use client";

import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";

const LoginPage = () => {
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = (e: FormEvent) => {
		e.preventDefault();
		router.push("/");
	};
	return (
		<main>
			<h2>로그인</h2>
			<form onSubmit={handleLogin}>
				<label htmlFor="username">
					아이디
					<input id="username" name="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
				</label>
				<label htmlFor="password">
					<input id="passoword" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
					비밀번호
				</label>
				<button type="submit">로그인</button>
			</form>
		</main>
	);
};

export default LoginPage;
