import { Trash2 } from "lucide-react";

const DeleteAllButton = ({ onClick }) => {
  return (
    <button
      className="delete-all-button"
      onClick={onClick}
    >
      <Trash2 size={16} />
      Delete All
    </button>
  );
};

export default DeleteAllButton;