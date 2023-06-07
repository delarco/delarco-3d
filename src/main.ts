import './style.css'
import { Game } from './game/Game';
import { TestScene } from './test-scene';

const scene = document.querySelector<HTMLDivElement>('#scene')!;
const game = new Game();
scene.appendChild(game.domElement);

game.scene = new TestScene();
game.run();
