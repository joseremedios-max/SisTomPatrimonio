import { Routes } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return <Routes>{AppRoutes()}</Routes>;
}