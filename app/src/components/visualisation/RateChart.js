import { Paper } from '@material-ui/core';
import { useState } from 'react';
import { max } from 'simple-statistics';
import { VictoryChart, VictoryLabel, VictoryLine, VictoryScatter, VictoryZoomContainer } from 'victory';
import theme from './chartTheme';


function calculateCumulativeStatistics(data) {
    let meanData = [data[0]];
    let upperStddevData = [data[0]];
    let lowerStddevData = [data[0]];

    let tripleUpperStddevData = [data[0]];
    let tripleLowerStddevData = [data[0]];

    let workData = data[0].y;
    let lastWorkData = null;
    let S = 0;

    for (let i = 1; i < data.length; ++i) {
        // Mean
        let mean = (meanData.at(-1).y * i + data[i].y) / (i + 1);
        meanData.push({
            x: data[i].x,
            y: mean
        })

        // Standard deviation
        lastWorkData = workData;
        workData = workData + (data[i].y - workData) / (i + 1);
        S += (data[i].y - lastWorkData) * (data[i].y - workData);

        let stddev = Math.sqrt(S / i);
        upperStddevData.push({
            x: data[i].x,
            y: mean + stddev
        });
        lowerStddevData.push({
            x: data[i].x,
            y: mean - stddev
        });
        tripleUpperStddevData.push({
            x: data[i].x,
            y: mean + 3 * stddev
        });
        tripleLowerStddevData.push({
            x: data[i].x,
            y: mean - 3 * stddev
        });
    }

    return { upperStddevData, meanData, lowerStddevData, tripleUpperStddevData, tripleLowerStddevData };
}

export default function RateChart({ title, data, showThreeStandardDeviations }) {
    const [zoomDomain, setZoomDomain] = useState({});
    const rates = data.map(datum => datum.y);
    const maximum = max(rates);
    const { upperStddevData, meanData, lowerStddevData, tripleUpperStddevData, tripleLowerStddevData } = calculateCumulativeStatistics(data);

    return (
        <Paper elevation={1} variant="outlined">
            <VictoryChart
                theme={theme}
                scale={{ x: "time" }}
                domainPadding={10}
                domain={{ y: [0, maximum + 50] }}
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
                    interpolation="catmullRom" data={upperStddevData}
                    style={{ data: { stroke: "#fed8b1" } }}
                />
                <VictoryLine
                    interpolation="catmullRom" data={lowerStddevData}
                    style={{ data: { stroke: "#fed8b1" } }}
                />

                {showThreeStandardDeviations &&
                    <VictoryLine
                        interpolation="catmullRom" data={tripleUpperStddevData}
                        style={{ data: { stroke: "#ffcccb" } }}
                    />
                }
                {showThreeStandardDeviations &&
                    <VictoryLine
                        interpolation="catmullRom" data={tripleLowerStddevData}
                        style={{ data: { stroke: "#ffcccb" } }}
                    />
                }

                {/* Data */}
                <VictoryLine
                    interpolation="bundle" data={data}
                    style={{ data: { stroke: "#8bb9dd" } }}
                />

                <VictoryLine
                    interpolation="catmullRom" data={meanData}
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
