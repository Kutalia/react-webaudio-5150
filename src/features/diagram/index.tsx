import { useEffect, useState, useRef } from 'react';
import createEngine, {
    DefaultLinkModel,
    DefaultPortModel,
    DiagramEngine,
    DagreEngine,
    DiagramModel,
    NodeModel,
    PathFindingLinkFactory,
    PathFindingLinkModel,
    PortModel,
    DefaultNodeModel,
    LinkModel,
    NodeModelListener,
} from '@projectstorm/react-diagrams';
import {
    CanvasWidget,
    BaseEvent,
    BaseListener
} from '@projectstorm/react-canvas-core';
import isEqual from 'lodash/isEqual';

import './Diagram.css';
import CustomNodeFactory from './CustomNodeFactory';
import CustomNodeModel from './CustomNodeModel';

const removePortLinks = (port: PortModel, linkToExclude?: PathFindingLinkModel): void => {
    const links = port.getLinks();
    if (Object.keys(links).length > (linkToExclude ? 1 : 0)) {
        Object.entries(links).forEach((entry) => {
            const link = entry[1];
            if (link !== linkToExclude) {
                link.remove();
            }
        });
    }
}

const getSignalChain = (model: DiagramModel, inputNodeID: string) => {
    const signalChain: number[] = [];
    let adjacentLinks: { [id: string]: LinkModel; } | undefined;
    let link: LinkModel;
    let node: NodeModel = model.getNode(inputNodeID);
    const nodes = model.getNodes();

    for (let i = 0; i < nodes.length - 1; i++) {
        adjacentLinks = (node as DefaultNodeModel)
            .getPort('Out')?.getLinks();

        if (!adjacentLinks || !Object.keys(adjacentLinks).length) {
            return null;
        }

        link = (Object.entries(
            adjacentLinks as {})[0][1] as LinkModel);

        if (link.getSourcePort().getNode() === node) {
            node = link.getTargetPort().getNode();
        } else {
            node = link.getSourcePort().getNode();
        }

        if (node instanceof CustomNodeModel) {
            signalChain.push(node.pluginIndex);
        }
    }

    return signalChain;
}

type PropTypes = {
    plugins: JSX.Element[],
    setPluginsOrder: Function,
    addPlugin: Function,
    pluginsOrder: number[] | null,
};

const Diagram = ({ plugins, setPluginsOrder, pluginsOrder, addPlugin }: PropTypes) => {
    const [engine, setEngine] = useState<DiagramEngine>();
    const pluginsRef = useRef<typeof plugins>([]); // used to maintain previous properties
    const pluginsOrderRef = useRef<typeof pluginsOrder>([]);

    useEffect(() => {
        const diagramEngine = createEngine({ registerDefaultZoomCanvasAction: false });
        diagramEngine.getNodeFactories().registerFactory(new CustomNodeFactory());
        setEngine(diagramEngine);
    }, []);

    useEffect(() => {
        const pluginsOrderChanged = !isEqual(pluginsOrderRef.current, pluginsOrder);
        const pluginAdded = pluginsOrder && pluginsOrderRef.current && (pluginsOrderRef.current as number[]).length < pluginsOrder.length;

        if (engine && (pluginAdded || (pluginsRef.current !== plugins && (pluginsOrderChanged || !pluginsOrder)))) {
            let model = engine.getModel();
            let node: NodeModel;
            let links: DefaultLinkModel[] = [];
            const renderedPluginsLength = pluginsOrder ? pluginsOrder.length : plugins.length;
            const newPluginIndex = pluginsOrder ? pluginsOrder[pluginsOrder.length - 1] : renderedPluginsLength - 1;

            // when new plugin is added on prerendered pedalboard
            if (model && model.getNodes().length - 2 < renderedPluginsLength) {
                node = new CustomNodeModel(pluginsOrder ? plugins[newPluginIndex as number] : plugins[plugins.length - 1], newPluginIndex);

                let outputNode = model.getNodes().filter(n => n instanceof DefaultNodeModel && (n as DefaultNodeModel).getOptions().name === 'Output')[0];
                let outputPort = outputNode.getPort('In') as DefaultPortModel;
                let outputLink = Object.keys(outputPort.getLinks()).length && Object.entries(outputPort.getLinks())[0][1];
                outputLink && removePortLinks(outputPort);

                let connectedToOutputNodePort = outputLink && (outputLink.getTargetPort().getNode() === outputNode ? outputLink.getSourcePort() : outputLink.getTargetPort());

                links = [
                    (node.getPort('Out') as DefaultPortModel).link(outputPort),
                ];

                outputLink && links.push((connectedToOutputNodePort as DefaultPortModel).link(node.getPort('In') as DefaultPortModel));

                model.addAll(node, ...links);
            }
            // when initializing diagram
            else if (!pluginsOrder) {
                let nodes: NodeModel[] = [];

                const pathfinding = engine.getLinkFactories().getFactory<PathFindingLinkFactory>(PathFindingLinkFactory.NAME);

                plugins.forEach((plugin, i) => {
                    node = new CustomNodeModel(plugin, i);
                    nodes.push(node);
                    if (i > 0) {
                        links.push((nodes[i - 1].getPort('Out') as DefaultPortModel).link(nodes[i].getPort('In') as DefaultPortModel, pathfinding));
                    }
                });

                // binding input and output audio signal nodes
                nodes = [new DefaultNodeModel({ name: 'Input' }), ...nodes];
                nodes.push(new DefaultNodeModel({ name: 'Output' }));

                const disableDeleteListener = {
                    eventWillFire: (event: BaseEvent & { function: string; }) => {
                        if (event.function === 'entityRemoved') {
                            event.stopPropagation();
                        }
                    }
                };

                nodes[0].registerListener(disableDeleteListener as NodeModelListener);
                nodes[nodes.length - 1].registerListener(disableDeleteListener as NodeModelListener);

                if (nodes.length > 2) {
                    links = [
                        (nodes[0] as DefaultNodeModel)
                            .addPort(new DefaultPortModel({ name: 'Out' }))
                            .link(nodes[1].getPort('In') as DefaultPortModel, pathfinding),
                        ...links
                    ];

                    links.push(
                        (nodes[nodes.length - 2] as any)
                            .getPort('Out')
                            .link(nodes[nodes.length - 1].addPort(new DefaultPortModel({ name: 'In' })), pathfinding)
                    );
                }

                model = new DiagramModel();
                model.addAll(...nodes, ...links);
                engine.setModel(model);

                type EventType = BaseEvent & { function: string; link: PathFindingLinkModel; isCreated: boolean; };

                const listener = {
                    eventDidFire: (event: EventType) => {
                        if (event.function === 'linksUpdated') {
                            const newLink = event.link;
                            const sourcePort = newLink.getSourcePort();

                            // remove existing links when relinking
                            removePortLinks(sourcePort, newLink);

                            if (event.isCreated) {
                                // fired when linking to target port is complete
                                // disables chaining plugin into itself
                                newLink.registerListener({
                                    targetPortChanged: (event: any) => {
                                        if (event.port.getParent() === sourcePort.getParent()) {
                                            newLink.remove();
                                        } else {
                                            removePortLinks(event.port, newLink);
                                        }

                                        const signalChain = getSignalChain(model, nodes[0].getID());
                                        signalChain && setPluginsOrder(signalChain);
                                    }
                                })
                            }
                        }
                    },
                };

                model.registerListener(listener as BaseListener);

                const state = engine.getStateMachine().getCurrentState();
                if (state) {
                    (state as any).dragCanvas.config.allowDrag = false;
                }

            }

            setTimeout(() => {
                const dagreEngine = new DagreEngine({
                    graph: {
                        rankdir: 'LR',
                        ranker: 'longest-path',
                        marginx: 550,
                        marginy: 550,
                        ranksep: 25,
                    },
                    includeLinks: true
                });

                dagreEngine.redistribute(model);
                engine
                    .getLinkFactories()
                    .getFactory<PathFindingLinkFactory>(PathFindingLinkFactory.NAME)
                    .calculateRoutingMatrix();

                engine.repaintCanvas();
            }, 1000);

            pluginsRef.current = plugins;
        }

        if (pluginsOrderChanged) {
            pluginsOrderRef.current = pluginsOrder;
        }
    }, [plugins, engine, pluginsOrder, setPluginsOrder, pluginsRef]);

    if (!engine || !engine.getModel()) {
        return null;
    }

    return (
        <div onDrop={event => {
            const data = event.dataTransfer.getData('plugin');
            addPlugin(data);
        }}
            className="canvas-wrapper"
            onDragOver={event => event.preventDefault()}>
            <CanvasWidget className="canvas" engine={engine} />
        </div>
    );
}

export default Diagram;
