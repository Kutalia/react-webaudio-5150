import { useEffect, useState } from 'react';
import createEngine, {
    DefaultLinkModel,
    DefaultPortModel,
    DiagramEngine,
    DiagramModel,
    NodeModel,
    PathFindingLinkFactory,
    PathFindingLinkModel,
    PortModel,
} from '@projectstorm/react-diagrams';
import {
    CanvasWidget,
    BaseEvent,
    BaseListener
} from '@projectstorm/react-canvas-core';

import './Diagram.css';
import CustomNodeFactory from './CustomNodeFactory';
import CustomNodeModel from './CustomNodeModel';

const removePortLinks = (port: PortModel, linkToExclude: PathFindingLinkModel): void => {
    const links = port.getLinks();
    if (Object.keys(links).length > 1) {
        Object.entries(links).forEach((entry) => {
            const link = entry[1];
            if (link !== linkToExclude) {
                link.remove();
            }
        });
    }
}

type PropTypes = {
    plugins: JSX.Element[],
    setPlugins: Function,
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

            const pathfinding = engine.getLinkFactories().getFactory<PathFindingLinkFactory>(PathFindingLinkFactory.NAME);

            plugins.forEach((plugin, i) => {
                node = new CustomNodeModel(plugin);
                node.setPosition(i * 400, i * 100);
                nodes.push(node);
                if (i > 0) {
                    links.push((nodes[i - 1].getPort('Out') as DefaultPortModel).link(nodes[i].getPort('In') as DefaultPortModel, pathfinding));
                }
            });

            const model = new DiagramModel();
            model.addAll(...nodes, ...links);
            engine.setModel(model);

            type EventType = BaseEvent & { function: string; link: PathFindingLinkModel; isCreated: boolean; };

            const listener = {
                eventDidFire: (event: EventType) => {
                    if (event.function === 'linksUpdated') {
                        const newLink = event.link;
                        const sourcePort = newLink.getSourcePort();

                        console.log(model.getLinks());

                        // remove existing links when relinking
                        removePortLinks(sourcePort, newLink);

                        if (event.isCreated) {
                            // fired when linking is complete
                            // disables chaining plugin into itself
                            newLink.registerListener({
                                targetPortChanged: (event: any) => {
                                    if (event.port.getParent() === sourcePort.getParent()) {
                                        newLink.remove();
                                    } else {
                                        removePortLinks(event.port, newLink);
                                    }
                                }
                            })
                        }
                    }
                },
            };

            model.registerListener(listener as BaseListener);

            const state = engine.getStateMachine().getCurrentState();
            (state as any).dragCanvas.config.allowDrag = false;
        }
    }, [plugins, engine]);

    if (!engine || !engine.getModel()) {
        return null;
    }

    return <CanvasWidget className="canvas" engine={engine} />;
}

export default Diagram;
