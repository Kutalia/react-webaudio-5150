import { AbstractReactFactory, GenerateModelEvent } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';

import CustomNodeWidget from './CustomNodeWidget';
import CustomNodeModel from './CustomNodeModel';

class CustomNodeFactory extends AbstractReactFactory<CustomNodeModel, DiagramEngine> {
    constructor() {
        super('plugin');
    }

    generateReactWidget(event: any): JSX.Element {
        return <CustomNodeWidget engine={this.engine} node={event.model} />;
    }

    generateModel(event: GenerateModelEvent) {
        return new CustomNodeModel(<></>, 0);
    }
}

export default CustomNodeFactory;
