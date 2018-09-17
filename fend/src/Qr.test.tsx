import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Qr from './Qr';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Qr />, div);
  ReactDOM.unmountComponentAtNode(div);
});
