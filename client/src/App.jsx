import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import Registration from './components/Registration/Registration';
import MainPage from './components/MainPage/MainPage';
import UserSettings from './components/UserSettings/UserSettings';
import ProtectedRoute from './routes/ProtectedRoute';

const App = () => {
	return (
		<Routes>
			<Route path='/' element={<Navigate to='/login' />} />
			<Route path='/login' element={<Login />} />
			<Route path='/register' element={<Registration />} />
			<Route
				path='/mainpage'
				element={
					<ProtectedRoute>
						<MainPage />
					</ProtectedRoute>
				}
			/>
			<Route
				path='/settings'
				element={
					<ProtectedRoute>
						<UserSettings />
					</ProtectedRoute>
				}
			/>
		</Routes>
	);
};

export default App;
