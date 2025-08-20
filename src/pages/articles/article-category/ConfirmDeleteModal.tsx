import { Modal } from "antd";

interface ConfirmDeleteModalProps {
	visible: boolean;
	onCancel: () => void;
	onConfirm: () => void;
}

const ConfirmDeleteModal = ({ visible, onCancel, onConfirm }: ConfirmDeleteModalProps) => {
	return (
		<Modal
			title="確認刪除"
			open={visible}
			onCancel={onCancel}
			onOk={onConfirm}
			okText="確認"
			cancelText="取消"
			okType="danger"
		>
			<p>確認要刪除該分類嗎？此操作不可撤销。</p>
			<p style={{ color: "#ff4d4f", marginTop: 16 }}>提示：刪除分類可能會影響關聯的文章，請謹慎操作。</p>
		</Modal>
	);
};

export default ConfirmDeleteModal;
