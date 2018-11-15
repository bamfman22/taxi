import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';

import taxiApp from './reducers';

const store = createStore(taxiApp, applyMiddleware(createLogger(), thunk));

export default store;
