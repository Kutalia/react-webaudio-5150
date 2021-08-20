type PropTypes = {
    plugins: string[],
}

const PluginsTrayWidget = ({ plugins }: PropTypes) => {
    return (
        <div>
            {plugins.map((plugin, index) =>
                <div key={index} draggable={true} onDragStart={event => event.dataTransfer.setData('plugin', plugin)}>
                    {plugin}
                </div>)}
        </div>
    );
};

export default PluginsTrayWidget;
