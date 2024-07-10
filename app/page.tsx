import { useRouter } from "next/navigation";

export default function Home() {
	const router = useRouter();

	const handleSignUpClick = () => {
		router.push("/signup");
	};

	const handleLoginClick = () => {
		router.push("/login");
	};

	return (
		<div className="page center">
			<h1>메인 페이지</h1>
			<button onClick={handleSignUpClick}>회원가입</button>
			<button onClick={handleLoginClick}>로그인</button>
		</div>
	);
}
