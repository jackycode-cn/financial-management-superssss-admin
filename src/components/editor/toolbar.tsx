import useLocale from "@/locales/use-locale";
import PDFButton from "./pdf-button";
import { StyledToolbar } from "./styles";

const HEADINGS = [
	"common.title.1",
	"common.title.2",
	"common.title.3",
	"common.title.4",
	"common.title.5",
	"common.title.6",
];

export const formats = [
	"align",
	"background",
	"blockquote",
	"bold",
	"list",
	"code",
	"code-block",
	"color",
	"direction",
	"font",
	"formula",
	"header",
	"image",
	"indent",
	"italic",
	"link",
	"list",
	"script",
	"size",
	"strike",
	"table",
	"underline",
	"video",
];

type EditorToolbarProps = {
	id: string;
	isSimple?: boolean;
};

export default function Toolbar({ id, isSimple }: EditorToolbarProps) {
	const { t } = useLocale();
	return (
		<StyledToolbar>
			<div id={id}>
				<div className="ql-formats">
					<select className="ql-header" defaultValue="">
						{HEADINGS.map((heading, index) => (
							<option key={heading} value={index + 1}>
								{t(heading)}
							</option>
						))}
						<option value="">{t("common.normal")}</option>
					</select>
				</div>

				<div className="ql-formats">
					<button type="button" className="ql-bold" title={t("common.bold")} />
					<button type="button" className="ql-italic" title={t("common.italic")} />
					<button type="button" className="ql-underline" title={t("common.underline")} />
					<button type="button" className="ql-strike" title={t("common.strike")} />
				</div>

				{!isSimple && (
					<div className="ql-formats">
						<select className="ql-color" title={t("common.color")} />
						<select className="ql-background" title={t("common.background")} />
					</div>
				)}

				<div className="ql-formats">
					<button type="button" className="ql-list" value="ordered" title={t("common.orderedList")} />
					<button type="button" className="ql-list" value="bullet" title={t("common.bulletList")} />
					{!isSimple && <button type="button" className="ql-indent" value="-1" title={t("common.outdent")} />}
					{!isSimple && <button type="button" className="ql-indent" value="+1" title={t("common.indent")} />}
				</div>

				{!isSimple && (
					<div className="ql-formats">
						<button type="button" className="ql-script" value="super" title={t("common.super")} />
						<button type="button" className="ql-script" value="sub" title={t("common.sub")} />
					</div>
				)}

				{!isSimple && (
					<div className="ql-formats">
						<button type="button" className="ql-code-block" title={t("common.code")} />
						<button type="button" className="ql-blockquote" title={t("common.quote")} />
					</div>
				)}

				<div className="ql-formats">
					<button type="button" className="ql-direction" value="rtl" title={t("common.direction")} />

					<select className="ql-align" title={t("common.align")} />
				</div>

				<div className="ql-formats">
					<button type="button" className="ql-link" title={t("common.link")} />

					<button type="button" className="ql-image" title={t("common.image")} />
					<button type="button" className="ql-video" title={t("common.video")} />
				</div>

				<div className="ql-formats">
					{!isSimple && <button type="button" className="ql-formula" title={t("common.formula")} />}
					<button type="button" className="ql-clean" title={t("common.clean")} />
				</div>
				<div className="ql-formats">
					<button type="button" className="ql-pdf" title={t("common.pdf")}>
						<PDFButton />
					</button>
				</div>
			</div>
		</StyledToolbar>
	);
}
