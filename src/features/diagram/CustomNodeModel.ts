import { NodeModel, NodeModelGenerics } from '@projectstorm/react-diagrams';

import CustomPortModel from './CustomPortModel';

export interface CustomNodeModelGenerics {
    PLUGIN: any,
}

class CustomNodeModel extends NodeModel<NodeModelGenerics & CustomNodeModelGenerics> {
    plugin: JSX.Element;
    
    constructor(plugin: JSX.Element) {
        super({
            type: 'plugin',
        });

        this.addPort(new CustomPortModel(true, 'In', ''));
        this.addPort(new CustomPortModel(false, 'Out', ''));

        this.plugin = plugin;
    }
}

export default CustomNodeModel;
