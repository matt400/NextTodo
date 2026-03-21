import ProtectedRoute from './routes/ProtectedRoute';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

import Login from './pages/Login';
import Registration from './pages/Registration';
import MainContent from './pages/MainContent';
import NotFoundPage from './pages/NotFoundPage';
import Toasts from './components/Toasts';

const App = () => {
	return (
		<ThemeProvider>
			<Toasts />
			<Routes>
				<Route path='/' element={<Navigate to='/login' />} />
				<Route path='/login' element={<Login />} />
				<Route path='/register' element={<Registration />} />
				<Route
					path='/maincontent'
					element={
						<ProtectedRoute>
							<MainContent />
						</ProtectedRoute>
					}
				/>
				<Route path='*' element={<NotFoundPage />}></Route>
			</Routes>
		</ThemeProvider>
	);
};

export default App;
