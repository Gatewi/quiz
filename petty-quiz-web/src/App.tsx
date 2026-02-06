

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import ExamInterface from './pages/ExamInterface';
import ExamResult from './pages/ExamResult';
import Report from './pages/Report';
import Guide from './pages/Guide';
import GroupStudy from './pages/GroupStudy';
import ForgotPassword from './pages/ForgotPassword';
import { QuizProvider } from './context/QuizContext';

function App() {
  return (
    <QuizProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="report" element={<Report />} />
            <Route path="group" element={<GroupStudy />} />
            <Route path="guide" element={<Guide />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
          </Route>
          <Route path="/exam" element={<ExamInterface />} />
          <Route path="/exam-result" element={<ExamResult />} />
        </Routes>
      </BrowserRouter>
    </QuizProvider>
  );
}

export default App;
