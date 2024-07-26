"use client";

import { supabase } from "@/utils/supabase";
import { ChangeEvent, useState } from "react";

const GatheringPage = () => {
	const [file, setFile] = useState<File | null>(null);
	const [imageUrl, setImageUrl] = useState<string | null>(null);

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0]);
		}
	};

	const handleUpload = async () => {
		if (!file) return;

		const fileExt = file.name.split(".").pop();
		const fileName = `${Date.now()}.${fileExt}`;
		const filePath = `${fileName}`;

		const { data, error } = await supabase.storage.from("happycustomers").upload(filePath, file);

		if (error) {
			console.log("Error uplopading file: ", error);
			return;
		}

		const { data: publicUrlData, error: urlError } = supabase.storage.from("happycustomers").getPublicUrl(filePath);

		if (urlError || !publicUrlData) {
			console.error("Error getting public url: ", urlError);
			return;
		}

		localStorage.setItem("uploaded_image_url", publicUrlData.publicUrl);

		setImageUrl(publicUrlData.publicUrl);

		console.log("File uploaded successfully: ", publicUrlData.publicUrl);
	};

	return (
		<div>
			{/* // TODO: dropdown 진행중 / 완료 / 예정 */}
			<div className="flex flex-col gap-4">
				모임 규칙
				<div className="flex gap-4">
					<h1>모임</h1>
					<button>모임 생성</button>
				</div>
				<div className="flex gap-4">
					{/* // TODO: 라디오로 카테고리화 */}
					모집중 | 진행중 | 완료
				</div>
			</div>
			<div>
				test
				<input type="file" onChange={handleFileChange} />
				<button onClick={handleUpload}>Upload</button>
				{imageUrl && (
					<div>
						<img src={imageUrl} alt="Uploaded file" />
					</div>
				)}
			</div>
		</div>
	);
};

export default GatheringPage;
