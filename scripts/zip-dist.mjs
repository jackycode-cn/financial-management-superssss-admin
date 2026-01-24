import archiver from "archiver";
import fs from "node:fs";

const output = fs.createWriteStream("dist.zip");
const archive = archiver("zip", { zlib: { level: 9 } });

let fileCount = 0;
const startTime = Date.now();

archive.on("entry", () => {
	fileCount++;
});

output.on("close", () => {
	const sizeBytes = archive.pointer();
	const endTime = Date.now();
	const duration = endTime - startTime;

	const formatSize = (bytes) => {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
	};

	console.log("\n📦 压缩完成！\n");
	console.log("📁 源目录: dist/");
	console.log(`📄 文件数量: ${fileCount}`);
	console.log(`💾 压缩包大小: ${formatSize(sizeBytes)} (${sizeBytes} bytes)`);
	console.log(`⏱️  耗时: ${duration} ms`);
	console.log("\n✅ 输出文件: dist.zip\n");
});

archive.on("error", (err) => {
	console.error("\n❌ 压缩失败:", err.message);
	process.exit(1);
});

archive.pipe(output);
archive.directory("dist/", false);
archive.finalize();
