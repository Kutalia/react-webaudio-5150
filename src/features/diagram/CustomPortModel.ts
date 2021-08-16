import { PathFindingLinkModel } from "@projectstorm/react-diagrams-routing";
import { DefaultPortModel } from "@projectstorm/react-diagrams-defaults";

class CustomPortModel extends DefaultPortModel {
    createLinkModel() {
        return new PathFindingLinkModel();
    }
}

export default CustomPortModel;
