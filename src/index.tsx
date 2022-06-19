import React from 'react';
import * as ReactDOM from 'react-dom';

import App from './App';

import './styles/index.less';

const mount = document.getElementById('mount');
const render = () => {
  if (!mount) {
    console.error('No mountpoint found!');
    return;
  }

  ReactDOM.render(<App />, mount);
};

render();

if (module.hot) {
  module.hot.accept('./App', render);
}
