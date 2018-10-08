import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import './index.css';
import taxiApp from './reducers';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const store = createStore(taxiApp, applyMiddleware(createLogger(), thunk));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
