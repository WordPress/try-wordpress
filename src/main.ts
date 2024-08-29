import { App } from '@/ui/App';
import { Container, createRoot } from 'react-dom/client';
import { createElement } from 'react';

const root = createRoot( document.getElementById( 'app' ) as Container );
root.render( createElement( App, {}, null ) );
