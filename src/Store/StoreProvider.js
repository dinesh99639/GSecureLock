import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducer from './reducer';

const store = createStore(reducer, composeWithDevTools());

function StoreProvider(props) {
    return <Provider store={store} >{props.children}</Provider>
}

export default StoreProvider;