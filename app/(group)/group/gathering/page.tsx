"use client";

import { supabase } from "@/utils/supabase";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";

const MAX_IMAGES = 10;

const GatheringPage = () => {
	const [files, setFiles] = useState<File[]>([]);
	const [imageUrls, setImageUrls] = useState<string[]>([]);

	useEffect(() => {
		const storedUrls = localStorage.getItem("uploaded_image_urls");
		if (storedUrls) {
			setImageUrls(JSON.parse(storedUrls));
		}
	}, []);

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const newFiles = Array.from(e.target.files);
			if (newFiles.length + files.length > MAX_IMAGES) {
				alert(`최대 ${MAX_IMAGES}개까지만 업로드 가능합니다.`);
				return;
			}
			setFiles((prevFiles) => [...prevFiles, ...newFiles]);
		}
	};

	const handleUpload = async () => {
		if (files.length === 0) return;

		const newImageUrls: string[] = [];

		for (const file of files) {
			const fileExt = file.name.split(".").pop();
			const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
			const filePath = `${fileName}`;

			const { data, error } = await supabase.storage.from("happycustomers").upload(filePath, file);

			if (error) {
				console.log("Error uploading file: ", error);
				continue;
			}

			const { data: publicUrlData, error: urlError } = supabase.storage.from("happycustomers").getPublicUrl(filePath);

			if (urlError || !publicUrlData) {
				console.error("Error getting public URL: ", urlError);
				continue;
			}

			newImageUrls.push(publicUrlData.publicUrl);
		}
		setImageUrls((prevUrls) => [...prevUrls, ...newImageUrls]);
		setFiles([]); // Clear files after uploading
		localStorage.setItem("uploaded_image_urls", JSON.stringify(newImageUrls));
		console.log("Files uploaded successfully: ", newImageUrls);
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
				{imageUrls.map((url, index) => (
					<div key={index} className="h-[400px] w-[400px]">
						<Image src={url} alt={`Uploaded file ${index + 1}`} layout="responsive" objectFit="cover" width={200} height={200} />
					</div>
				))}
			</div>
		</div>
	);
};

export default GatheringPage;
