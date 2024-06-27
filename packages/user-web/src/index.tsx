import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { UserApp } from './app/user-app';

const container = createRoot(document.getElementById('user-app')!);

container.render(
  <StrictMode>
    <BrowserRouter>
      <UserApp />
    </BrowserRouter>
  </StrictMode>,
);
