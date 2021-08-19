import { NodeModel, NodeModelGenerics } from '@projectstorm/react-diagrams';

import CustomPortModel from './CustomPortModel';

export interface CustomNodeModelGenerics {
    PLUGIN: any,
}

class CustomNodeModel extends NodeModel<NodeModelGenerics & CustomNodeModelGenerics> {
    constructor(public plugin: JSX.Element, public pluginIndex: number) {
        super({
            type: 'plugin',
        });

        this.addPort(new CustomPortModel(true, 'In', ''));
        this.addPort(new CustomPortModel(false, 'Out', ''));
    }
}

export default CustomNodeModel;
