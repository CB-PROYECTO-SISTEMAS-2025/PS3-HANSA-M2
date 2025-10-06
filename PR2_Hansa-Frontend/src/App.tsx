import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './features/auth/login/pages/Login';
import Register from './features/auth/register/pages/Register';
import Projects from './pages/Projects';
import VerifyCode from './features/auth/verifyCode/pages/VerifyCode';
import Layout from './shared/components/Layout';
import FileVisualization from './features/repository/pages/FileVisualization';
import Home from './pages/Home';
import VistaPerfil from './pages/Profile';
import EditarPerfilPage from './pages/EditProfile';
import MyRepositoriesPage from './features/repository/pages/MyRepositoriesPage';
import FileUserRepos from './features/repository/pages/FileUserRepos';
import NotificationsPage from './pages/NotificationsPage'; 
import UsersPage from './pages/UsersPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/account/register" element={<Register />} />
        <Route path="/account/verify-code" element={<VerifyCode />} />
        <Route path="/projects" element={<Projects />} />

        {/* Rutas con Layout */}
        <Route element={<Layout />}>
          <Route path="/file-repository" element={<FileVisualization />} />
          <Route path="/home" element={<Home />} />
          <Route path="/mis-repositorios" element={<MyRepositoriesPage />} />
          <Route path="/profile" element={<VistaPerfil />} />
          <Route path="/repositorio/:id" element={<FileUserRepos />} />
          <Route path="/editar-perfil" element={<EditarPerfilPage />} />
          <Route path="/notificaciones" element={<NotificationsPage />} /> 
          <Route path="/usuarios" element={<UsersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
