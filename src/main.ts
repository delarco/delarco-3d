import './style.css'
import { Game } from './game/Game';
import { TestScene } from './test-scene';
import { UserInterface } from './user-interface';
import { GameConfig } from './game/GameConfig';

const scene = new TestScene();
const userInterface = new UserInterface(scene);
const sceneArea = document.querySelector<HTMLDivElement>('#scene')!;
const game = new Game(new GameConfig(), userInterface);
sceneArea.appendChild(game.domElement);

game.scene = scene;
game.run();
