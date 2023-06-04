import './style.css'
import { Game } from './game/Game';

const app = document.querySelector<HTMLDivElement>('#app')!;
const game = new Game();
app.appendChild(game.domElement);
