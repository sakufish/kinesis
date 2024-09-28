import { useEffect } from "react";

import { Stage, Layer, Rect } from 'react-konva';

type RepProgressIndicatorProps = {
    startPercentage: number,
    middlePercentage: number,
    currentPosition: "start" | "middle",
    currentPercentage: number | null,
};

const RepProgressIndicator = (props: RepProgressIndicatorProps) => {
    const { startPercentage, middlePercentage, currentPosition, currentPercentage } = props;

    return (
        <Stage width={50} height={200}>
            <Layer>
                <Rect
                    width={50}
                    height={200}
                    fill="black"
                    cornerRadius={10}
                />
                <Rect
                    x={0}
                    y={0}
                    width={50}
                    height={startPercentage * 200}
                    fill="lime"
                    opacity={currentPosition === "start" ? 0.5 : 0.8}
                    cornerRadius={[10, 10, 0, 0]}
                />
                <Rect
                    x={0}
                    y={middlePercentage * 200}
                    width={50}
                    height={(1 - middlePercentage) * 200}
                    fill="lime"
                    opacity={currentPosition === "middle" ? 0.5 : 0.8}
                    cornerRadius={[0, 0, 10, 10]}
                />
                <Rect
                    x={0}
                    y={currentPercentage ? currentPercentage * 200 : 0}
                    width={50}
                    height={5}
                    fill="red"
                    cornerRadius={5}
                />
            </Layer>
        </Stage>
    );
}

export default RepProgressIndicator;