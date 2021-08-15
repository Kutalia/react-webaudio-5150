import { DefaultPortModel, NodeModel, NodeModelGenerics } from '@projectstorm/react-diagrams';

export interface CustomNodeModelGenerics {
    PLUGIN: any,
}

class CustomNodeModel extends NodeModel<NodeModelGenerics & CustomNodeModelGenerics> {
    plugin: JSX.Element;
    
    constructor(plugin: JSX.Element) {
        super({
            type: 'plugin',
        });

        this.addPort(new DefaultPortModel(true, 'In', ''));
        this.addPort(new DefaultPortModel(false, 'Out', ''));

        this.plugin = plugin;
    }
}

export default CustomNodeModel;
