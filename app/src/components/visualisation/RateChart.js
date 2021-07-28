import { Paper } from '@material-ui/core';
import { useState } from 'react';
import { max, sampleStandardDeviation } from 'simple-statistics';
import { VictoryChart, VictoryLabel, VictoryLine, VictoryScatter, VictoryZoomContainer } from 'victory';
import theme from './chartTheme';


function calculateCumulativeMovingAverage(data) {
    let newData = [data[0]];
    for (let i = 1; i < data.length; ++i) {
        newData.push({
            x: data[i].x,
            y: (newData.at(-1).y * i + data[i].y) / (i + 1)
        })
    }
    return newData;
}

function shiftData(data, shift) {
    return data.map(datum => ({ x: datum.x, y: datum.y + shift }))
}



export default function RateChart({ title, data, showThreeStandardDeviations }) {
    const [zoomDomain, setZoomDomain] = useState({});
    const rates = data.map(datum => datum.y);
    const maximum = max(rates);
    const stddev = sampleStandardDeviation(rates);
    const cumulativeRollingAverageData = calculateCumulativeMovingAverage(data);

    return (
        <Paper elevation={1} variant="outlined">
            <VictoryChart
                theme={theme}
                scale={{ x: "time" }}
                domainPadding={10}
                domain={{ y: [0, maximum + stddev] }}
                style={{
                    parent: {
                        paddingTop: 0
                    }
                }}
                containerComponent={
                    <VictoryZoomContainer
                        zoomDimension="x"
                        zoomDomain={zoomDomain}
                        onZoomDomainChange={setZoomDomain}
                    />
                }>

                <VictoryLabel text={title} x={225} y={30} textAnchor="middle" />

                {/* "Ground truth" +/- std devs */}
                <VictoryLine
                    interpolation="catmullRom" data={shiftData(cumulativeRollingAverageData, stddev)}
                    style={{ data: { stroke: "#fed8b1" } }}
                />
                <VictoryLine
                    interpolation="catmullRom" data={shiftData(cumulativeRollingAverageData, -stddev)}
                    style={{ data: { stroke: "#fed8b1" } }}
                />

                {showThreeStandardDeviations &&
                    <VictoryLine
                        interpolation="catmullRom" data={shiftData(cumulativeRollingAverageData, 3 * stddev)}
                        style={{ data: { stroke: "#ffcccb" } }}
                    />
                }
                {showThreeStandardDeviations &&
                    <VictoryLine
                        interpolation="catmullRom" data={shiftData(cumulativeRollingAverageData, -3 * stddev)}
                        style={{ data: { stroke: "#ffcccb" } }}
                    />
                }

                {/* Data */}
                <VictoryLine
                    interpolation="bundle" data={data}
                    style={{ data: { stroke: "#8bb9dd" } }}
                />

                <VictoryLine
                    interpolation="catmullRom" data={cumulativeRollingAverageData}
                    style={{ data: { stroke: "#d2e9af " } }}
                />

                <VictoryScatter data={data}
                    size={5}
                    style={{ data: { fill: "#00e5ff" } }}
                />

            </VictoryChart>
        </Paper >
    );
}
