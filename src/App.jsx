import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      {/* استدعاء خريطة المسارات */}
      <AppRoutes />
      
      {/* تجهيز أداة الإشعارات المنبثقة لتعمل في كل الموقع */}
      <ToastContainer position="top-left" autoClose={3000} />
    </>
  )
}

export default App;