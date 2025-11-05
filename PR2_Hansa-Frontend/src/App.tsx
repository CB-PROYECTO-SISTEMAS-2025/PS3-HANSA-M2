import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './features/auth/login/pages/Login';
import Register from './features/auth/register/pages/Register';
import Projects from './pages/Projects';
import VerifyCode from './features/auth/verifyCode/pages/VerifyCode';
import Layout from './shared/components/Layout';
//import FileVisualization from './features/repository/pages/FileVisualization';
import Home from './pages/Home';
import VistaPerfil from './pages/Profile';
import EditarPerfilPage from './pages/EditarPerfilPage';
import MyRepositoriesPage from './features/repository/pages/MyRepositoriesPage';
import FileUserRepos from './features/repository/pages/FileUserRepos';
import NotificationsPage from './pages/NotificationsPage'; 
import UsersPage from './pages/UsersPage';
import UserDetailPage from "./pages/UserDetailPage";
//import ResetPassword from './features/auth/resetPassword/pages/ResetPassword';
import RequestReset from './features/auth/resetPassword/pages/RequestReset';
import CreateRepositoryPage from './features/repository/pages/CreateRepositoryPage';
import RepositoryDetailPage from './features/repository/pages/RepositoryDetailPage';

import ForgotPassword from './features/auth/forgotPassword/pages/ForgotPassword';
import ResetPassword from './features/auth/forgotPassword/pages/ResetPassword';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/account/register" element={<Register />} />
        <Route path="/account/verify-code" element={<VerifyCode />} />

        {/* Rutas cambio contraseña */}
        <Route path="/account/forgot-password" element={<ForgotPassword />} />
        <Route path="/account/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} /> {/* opcional */}

        
        <Route path="/projects" element={<Projects />} />
        <Route path="/account/reset" element={<RequestReset />} />
        <Route path="/account/reset-password" element={<ResetPassword />} />

        {/* Rutas con Layout */}
        <Route element={<Layout />}>
          {/* <Route path="/file-repository" element={<FileVisualization />} /> */}
          <Route path="/home" element={<Home />} />
          <Route path="/mis-repositorios" element={<MyRepositoriesPage />} />
          <Route path="/profile" element={<VistaPerfil />} />
          <Route path="/editProfile" element={<EditarPerfilPage />} />
          <Route path="/notificaciones" element={<NotificationsPage />} /> 
          <Route path="/usuarios" element={<UsersPage />} />
          <Route path="/repositorio/nuevo" element={<CreateRepositoryPage />} />
          <Route path="/repositorio/:id" element={<RepositoryDetailPage />} />
          <Route path="/usuarios/:id" element={<UserDetailPage />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
