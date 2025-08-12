import html2PDF from "jspdf-html2canvas";
import type { Options } from "jspdf-html2canvas/dist/types";
/**
 * 将指定 DOM 元素导出为 PDF 文件
 * @param elementId - 需要导出的 DOM 元素 id
 * @param pdfFileName - 导出的 PDF 文件名
 */
export async function exportPdf(htmlEle: HTMLElement, options?: Partial<Options>) {
	const pdf = await html2PDF(htmlEle, {
		jsPDF: {
			format: "a4",
		},
		imageType: "image/jpeg",
		output: "./pdf/generate.pdf",
		...options,
	});
	return pdf;
}
