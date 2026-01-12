import { Trash2 } from "lucide-react";
import styles from './DeleteAllButton.module.css'
const DeleteAllButton = ({ onClick }) => {
  return (
    <button
      className={`${styles.deleteAllButton}`}
      onClick={onClick}
    >
      <Trash2 size={16} />
      Delete All
    </button>
  );
};

export default DeleteAllButton;