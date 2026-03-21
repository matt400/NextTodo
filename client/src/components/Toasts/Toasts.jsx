import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import styles from './Toasts.module.css';

let externalAddToast;

export function addToast(type, message) {
	if (externalAddToast) {
		externalAddToast(type, message);
	}
}

const ICONS = {
	success: CheckCircle,
	error: XCircle,
	info: Info,
};

function Toasts() {
	const [toasts, setToasts] = useState([]);

	useEffect(() => {
		externalAddToast = (type, message) => {
			const id = crypto.randomUUID();

			setToasts((prev) => [...prev, { id, type, message }]);

			setTimeout(() => {
				setToasts((prev) => prev.filter((t) => t.id !== id));
			}, 5000);
		};
	}, []);

	return (
		<div className={styles.container}>
			{toasts.map((toast) => {
				const Icon = ICONS[toast.type];

				return (
					<div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
						<div className={styles.content}>
							<div className={styles.left}>
								<Icon className={styles.icon} size={18} />
								<p className={styles.message}>{toast.message}</p>
							</div>

							<button
								onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
								className={styles.closeBtn}>
								<X size={18} />
							</button>
						</div>

						<div className={styles.progressWrapper}>
							<div className={styles.progress} style={{ animationDuration: '5000ms' }} />
						</div>
					</div>
				);
			})}
		</div>
	);
}

export default Toasts;
