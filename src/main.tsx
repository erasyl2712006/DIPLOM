import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import App from './App';
import './index.css';

// Add code to initialize localStorage with default data
import { 
  initializeLocalStorage 
} from './data/local-storage';
import { 
  students, 
  teachers, 
  gradeEntries, 
  materials, 
  attendanceRecords,
  messages
} from './data/mock-data';

// Initialize localStorage with mock data
document.addEventListener('DOMContentLoaded', () => {
  initializeLocalStorage('students', students);
  initializeLocalStorage('teachers', teachers);
  initializeLocalStorage('grades', gradeEntries);
  initializeLocalStorage('materials', materials);
  initializeLocalStorage('attendance', attendanceRecords);
  initializeLocalStorage('messages', messages);
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <BrowserRouter>
        <ToastProvider />
        <App />
      </BrowserRouter>
    </HeroUIProvider>
  </React.StrictMode>,
);