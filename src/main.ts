import './style.css'
import { Game } from './game/Game';
import { TestScene } from './test-scene';

const app = document.querySelector<HTMLDivElement>('#app')!;
const game = new Game();
app.appendChild(game.domElement);

game.scene = new TestScene();
game.run();
