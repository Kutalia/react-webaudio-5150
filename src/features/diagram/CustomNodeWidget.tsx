import React from 'react';
import { DiagramEngine, PortWidget } from '@projectstorm/react-diagrams';
import CustomNodeModel from './CustomNodeModel';
import styled from '@emotion/styled'

const Wrapper = styled.div`
    .plugin-port {
        width: 16px;
        height: 16px;
        z-index: 10;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 8px;
        cursor: pointer;
        &:hover {
            background: rgba(0, 0, 0, 1);
        }
        position: absolute;
        top: 50%;

        &.port-in {
            left: 0%;
        }
        &.port-out {
            right: 0%;
        }
    }
`;

export interface CustomWidgetProps {
    node: CustomNodeModel,
    engine: DiagramEngine,
}

class CustomNodeWidget extends React.Component<CustomWidgetProps>{
    render() {
        const InPort = this.props.node.getPort('In');
        const OutPort = this.props.node.getPort('Out');

        return (<Wrapper>
            {this.props.node.plugin}
            {InPort && <PortWidget className="plugin-port port-in" port={InPort} engine={this.props.engine} />}
            {OutPort && <PortWidget className="plugin-port port-out" port={OutPort} engine={this.props.engine} />}
        </Wrapper>);
    }
};

export default CustomNodeWidget;
