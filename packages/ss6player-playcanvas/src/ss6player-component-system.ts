import {SS6PlayerComponent, SS6PlayerComponentProperties} from './ss6player-component';
import {SS6playerComponentData} from './ss6player-component-data';
import {AppBase, Component, ComponentSystem} from 'playcanvas';

export class SS6PlayerComponentSystem extends ComponentSystem {
  id: string;
  ComponentType: typeof SS6PlayerComponent;
  DataType: typeof SS6playerComponentData;

  constructor(app: AppBase) {
    super(app);

    this.id = 'ss6player';

    this.ComponentType = SS6PlayerComponent;
    this.DataType = SS6playerComponentData;

    this.schema = SS6PlayerComponentProperties;

    this.on('beforeremove', this.onBeforeRemove, this);
    app.systems.on('update', this.onUpdate, this);
  }

  initializeComponentData(component: Component, data: object, properties: Array<string | { name: string; type: string }>) {
    console.log('initializeComponentData');
    super.initializeComponentData(component, data, SS6PlayerComponentProperties);
  }

  onBeforeRemove(entity: any, component: any): void {
    let data = entity.ss6player.data;
    if (data.ss6player) {
      data.ss6player.destroy();
    }

    entity.ss6player.removeComponent();
  }

  onUpdate(dt: number): void {
    // console.log('onUpdate: ' + dt.toString());
    const components = this.store;

    for (const id in components) {
      if (components.hasOwnProperty(id)) {
        const component = components[id];
        const componentData = component.data;
        if (component.entity.enabled) {
          if (componentData.ss6player) {
            componentData.ss6player.setPosition(component.entity.getPosition());
            componentData.ss6player.update(dt);
          }
        }
      }
    }
  }
}
