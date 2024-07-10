"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const SignupPage = () => {
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleSignUp = (e: FormEvent) => {
		e.preventDefault();
		router.push("/");
	};

	return (
		<main className="page right-slide">
			<h2>회원 가입</h2>
			<form onSubmit={handleSignUp}>
				<label htmlFor="usename">
					<input id="username" name="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
					아이디
				</label>
				<label htmlFor="password">
					<input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
					비밀번호
				</label>
				<button type="submit">회원가입</button>
			</form>
		</main>
	);
};

export default SignupPage;
