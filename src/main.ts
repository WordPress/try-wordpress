import { createRoot } from 'react-dom/client';
import { createElement } from 'react';
import { App } from './ui/App';

const root = createRoot( document.getElementById( 'main' ) );
root.render( createElement( App, {}, null ) );
