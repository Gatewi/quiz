import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  document.body.innerHTML = `
    <div style="display: flex; flex-direction: column; height: 100vh; justify-content: center; align-items: center; background-color: #111318; color: white; font-family: sans-serif; text-align: center; padding: 20px;">
      <h1 style="color: #ef4444; font-size: 24px; margin-bottom: 16px;">Cấu hình chưa hoàn tất</h1>
      <p style="color: #9ca3af; max-width: 500px; line-height: 1.5;">
        Ứng dụng chưa tìm thấy thông tin kết nối Supabase. Vui lòng kiểm tra lại file 
        <code style="background: #374151; padding: 4px 8px; rounded: 4px; color: #e5e7eb;">.env</code>
      </p>
      <div style="margin-top: 24px; text-align: left; background: #1f2937; padding: 16px; border-radius: 8px; width: 100%; max-width: 500px;">
        <p style="margin-bottom: 8px; font-weight: bold; color: #d1d5db;">File .env cần có nội dung sau:</p>
        <pre style="background: black; padding: 12px; border-radius: 4px; overflow-x: auto; color: #10b981;">
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
        </pre>
      </div>
      <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">Sau khi cập nhật file .env, hãy khởi động lại server.</p>
    </div>
  `;
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
