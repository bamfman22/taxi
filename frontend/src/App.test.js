import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';

import App from './App';
import taxiApp from './reducers';

fetchMock.get('end:/member/current', {});

it('renders without crashing', () => {
  const div = document.createElement('div');
  const store = createStore(taxiApp, applyMiddleware(thunk));
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
