import { createApp } from '@/ui/App';
import { Container, createRoot } from 'react-dom/client';
import { initParser } from '@/parser/init';

initParser();

const root = createRoot( document.getElementById( 'app' ) as Container );
root.render( await createApp() );
