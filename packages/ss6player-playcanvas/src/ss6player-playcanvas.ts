import {SS6PlayerComponentSystem} from './ss6player-component-system';
import {SS6PlayerComponent} from './ss6player-component';

export {SS6PlayerComponentSystem, SS6PlayerComponent};

import {Application} from 'playcanvas';
function registerSS6Player() {
  const app = Application.getApplication();
  const system = new SS6PlayerComponentSystem(app);
  app.systems.add(system);
  console.log('register ss6player');
}
registerSS6Player();
