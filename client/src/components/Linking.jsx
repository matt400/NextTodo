import { Link } from 'react-router-dom';
import '../styles/elements/linking.css';

const Linking = ({ to, innerText }) => {
  return (
    <Link className="link" to={to}>
      {innerText}
    </Link>
  );
};

export default Linking;

