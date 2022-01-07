import { createStore } from 'redux';
import { Provider } from 'react-redux';

import reducer from './reducer';

const store = createStore(reducer);

function StoreProvider(props) {
    return <Provider store={store} >{props.children}</Provider>
}

export default StoreProvider;