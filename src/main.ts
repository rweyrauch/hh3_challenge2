/**
 * Application entry point.
 *
 * Imports Bootstrap CSS and then boots the app router.
 */
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import { startApp } from './ui/app.js';

const container = document.getElementById('app');
if (!container) {
  throw new Error('No #app element found in the document.');
}

startApp(container);
