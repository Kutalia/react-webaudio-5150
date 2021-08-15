import { useEffect, useState } from 'react';
import createEngine, {
    DefaultLinkModel,
    DefaultPortModel,
    DiagramEngine,
    DiagramModel,
    NodeModel,
} from '@projectstorm/react-diagrams';
import {
    CanvasWidget,
    BaseEvent,
    BaseListener
} from '@projectstorm/react-canvas-core';

import './Diagram.css';
import CustomNodeFactory from './CustomNodeFactory';
import CustomNodeModel from './CustomNodeModel';

type PropTypes = {
    plugins: JSX.Element[],
}

const Diagram = ({ plugins }: PropTypes) => {
    const [engine, setEngine] = useState<DiagramEngine>();

    useEffect(() => {
        const diagramEngine = createEngine({ registerDefaultZoomCanvasAction: false });
        diagramEngine.getNodeFactories().registerFactory(new CustomNodeFactory());
        setEngine(diagramEngine);
    }, []);

    useEffect(() => {
        if (engine) {
            const nodes: NodeModel[] = [];
            const links: DefaultLinkModel[] = [];
            let node: NodeModel;

            plugins.forEach((plugin, i) => {
                node = new CustomNodeModel(plugin);
                node.setPosition(i * 400, i * 100);
                nodes.push(node);
                if (i > 0) {
                    links.push((nodes[i - 1].getPort('Out') as DefaultPortModel).link<DefaultLinkModel>(nodes[i].getPort('In') as DefaultPortModel));
                }
            });

            const model = new DiagramModel();
            model.addAll(...nodes, ...links);
            engine.setModel(model);

            type EventType = BaseEvent & { function: string; };

            const listener = {
                eventDidFire: (event: EventType) => {
                    console.log(event);
                },
            };

            engine.getModel().registerListener(listener as BaseListener);

            const state = engine.getStateMachine().getCurrentState();
            (state as any).dragCanvas.config.allowDrag = false;
        }
    }, [plugins, engine]);

    if (!engine || !engine.getModel()) {
        return null;
    }
    console.log(engine.getModel().getLinks());

    return <CanvasWidget className="canvas" engine={engine} />;
}

export default Diagram;
