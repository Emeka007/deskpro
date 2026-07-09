import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { store } from './store';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  Routes: ({ children }) => children,
  Route: ({ element }) => element,
  NavLink: ({ children, className }) => <a className={typeof className === 'function' ? className({ isActive: false }) : className}>{children}</a>,
  Navigate: () => null,
}));

import App from './App';

test('app renders without crashing', () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </Provider>
  );
});
