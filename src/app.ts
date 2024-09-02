import { createApp } from '@/ui/App';
import { Container, createRoot } from 'react-dom/client';

const root = createRoot( document.getElementById( 'app' ) as Container );
root.render( await createApp() );
