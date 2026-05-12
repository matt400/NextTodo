import type { Tag } from '../../types';
import { MAX_TAGS_PER_TASK } from '../../types';
import styles from './TagChipPicker.module.css';

interface TagChipPickerProps {
  tags: Tag[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

const TagChipPicker = ({ tags, selectedIds, onChange }: TagChipPickerProps) => {
  if (tags.length === 0) return null;

  const atLimit = selectedIds.length >= MAX_TAGS_PER_TASK;

  const toggle = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id));
    } else {
      if (atLimit) return;
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.label}>
        Tags
        {atLimit && <span className={styles.limitNote}>Max {MAX_TAGS_PER_TASK} per task</span>}
      </div>
      <div className={styles.chipList}>
        {tags.map((tag) => {
          const selected = selectedIds.includes(tag.id);
          const disabled = !selected && atLimit;
          return (
            <button
              key={tag.id}
              type='button'
              onClick={() => toggle(tag.id)}
              disabled={disabled}
              className={`${styles.chip} ${selected ? styles.chipSelected : ''} ${disabled ? styles.chipDisabled : ''}`}
              style={
                selected
                  ? { borderColor: tag.color, color: tag.color, backgroundColor: `${tag.color}22` }
                  : { borderColor: tag.color, color: tag.color }
              }>
              <span className={styles.dot} style={{ backgroundColor: tag.color }} />
              {tag.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TagChipPicker;
