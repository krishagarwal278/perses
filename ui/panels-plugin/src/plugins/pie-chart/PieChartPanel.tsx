//Copyright 2023 The Perses Authors
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { PieChart, PieChartData, LoadingOverlay, useChartsTheme, legacyGetNearbySeriesData } from '@perses-dev/components';
import { Box, useTheme } from '@mui/material';
import React, { useMemo } from 'react';
import { CalculationType, CalculationsMap } from '@perses-dev/core';
import { useDataQueries, PanelProps } from '@perses-dev/plugin-system';
// import { SeriesData } from 'echarts/types/dist/shared';
import { PieChartOptions } from './pie-chart-model';
import { calculatePercentages, sortSeriesData } from './utils';
import { ContentWithLegend } from '@perses-dev/components';

// test
import { validateLegendSpec } from '@perses-dev/plugin-system';
import { DEFAULT_LEGEND } from '@perses-dev/core';
import merge from 'lodash/merge';
import { useState } from 'react';
import { SelectedLegendItemState } from '@perses-dev/components';
import { LegendProps } from '@perses-dev/components';
import { useRef } from 'react';
import { ChartInstance, useId } from '@perses-dev/components';
import { LegendItem } from '@perses-dev/components';
import { DEFAULT_VISUAL } from '../time-series-chart/time-series-chart-model';
import { getSeriesColor } from '../time-series-chart/utils/palette-gen';
import { SeriesColorProps } from '../time-series-chart/utils/palette-gen';

export type PieChartPanelProps = PanelProps<PieChartOptions>;

const dataPresent = (data: any) => {
  if (data === undefined || data.length < 1) return false;
};

const testCategoricalPalette = [
  '#56B4E9', // lt blue
  '#009E73', // med green
  '#0072B2', // dk blue
  '#CC79A7', // lt purple
  '#F0E442', // yellow
  '#E69F00', // orange
  '#D55E00', // red
];

const mockGetSeriesColor = () => {
  return testCategoricalPalette[Math.floor(Math.random() * testCategoricalPalette.length-1)]
}

export function PieChartPanel(props: PieChartPanelProps) {
  const {
    spec: { calculation, sort, mode },
    contentDimensions,
  } = props;
  const chartsTheme = useChartsTheme();
  const PADDING = chartsTheme.container.padding.default;
  const { queryResults, isLoading, isFetching } = useDataQueries('TimeSeriesQuery'); // gets data queries from a context provider, see DataQueriesProvider
  const chartId = useId('time-series-panel');

  /**
   * TODO: 
  * 1) Add Color property to const pieChartData using getSeriesColor() 
  * 2) In const legendItems, fetch the color from pieChartData. Pass it in LegendItem > color. type LegendItem = {color: string, id: string, name:string }
  * 3) In eChart > options > series > data > itemStyle pass the color 
  *   series: [{
        data: [
            {
                value: 120,
                name: 'hello world',
                itemStyle: {color: popRandomColor()},
            },
      ]
     https://stackoverflow.com/questions/52101249/custom-dynamic-color-for-echarts
  */

  
  // ECharts theme comes from ChartsProvider, more info: https://echarts.apache.org/en/option.html#color
  // Colors are manually applied since our legend and tooltip are built custom with React.
  const categoricalPalette = chartsTheme.echartsTheme.color;
  const muiTheme = useTheme();

  // JZ: NOTES see TimeSeriesChartPanel > legendItems
  let legendItems: LegendItem[] = [];


  // JZ: Generate Chart Data
  const pieChartData: PieChartData[] = useMemo(() => {
    const calculate = CalculationsMap[calculation as CalculationType];
    const pieChartData: PieChartData[] = [];
    for (const result of queryResults) {
      // Skip queries that are still loading or don't have data
      if (result.isLoading || result.isFetching || result.data === undefined) continue;
      
      let seriesIndex = 0; 
      for (const seriesData of result.data.series) {
        // JZ: generate data for eChart visualization
        const series = {
          value: calculate(seriesData.values) ?? null,
          name: seriesData.formattedName ?? '',
          itemStyle: {
            color: mockGetSeriesColor() // TODO: replace this iwth getSeriesColor()
          }
        };
        pieChartData.push(series);

        console.log('Series Data Value', seriesData.values);
        console.log({ series });

        // JZ: generate data for Perses Lengend 
        const seriesId = chartId + seriesData.name + seriesIndex;
        legendItems.push({
          id: seriesId,
          label: series.name,
          color: series.itemStyle.color ?? ''
        });
        seriesIndex++;

      }
    }

    console.log('PieChartPanel > PieChartData: ', pieChartData);

    // #TODO:  1) Add Color property to const pieChartData using getSeriesColor() 


    const sortedPieChartData = sortSeriesData(pieChartData, sort);
    if (mode === 'percentage') {
      return calculatePercentages(sortedPieChartData);
    } else {
      return sortedPieChartData;
    }
  }, [queryResults, sort, mode, calculation]);


  // JZ: Create Legend Data
  console.log('PieChartPanel > queryResults : ', queryResults);
  console.log('PieChartPanel > legendData : ', legendItems);

  // JZ: Legend test
  const contentPadding = chartsTheme.container.padding.default;
  const adjustedContentDimensions: typeof contentDimensions = contentDimensions
    ? {
        width: contentDimensions.width - contentPadding * 2,
        height: contentDimensions.height - contentPadding * 2,
      }
    : undefined;

  const legend = useMemo(() => {
    return props.spec.legend && validateLegendSpec(props.spec.legend)
      ? merge({}, DEFAULT_LEGEND, props.spec.legend)
      : undefined;
  }, [props.spec.legend]);

  const [selectedLegendItems, setSelectedLegendItems] = useState<SelectedLegendItemState>('ALL');

  const [legendSorting, setLegendSorting] = useState<NonNullable<LegendProps['tableProps']>['sorting']>();

  const chartRef = useRef<ChartInstance>(null);

  // JZ: Error checking
  // if (adjustedContentDimensions === undefined) throw 'adjustedContentDimensions is undefined';
  // if (contentDimensions === undefined) throw 'contentDimensions is undefined';

  if (queryResults[0]?.error) throw queryResults[0]?.error;

  if (isLoading || isFetching) {
    return <LoadingOverlay />;
  }

  return (
    <Box sx={{ padding: `${PADDING}px` }}>
      <ContentWithLegend
        // JZ TODO: need to fix the width and height not have a fallback like this 
        width={adjustedContentDimensions?.width ?? 400}
        height={adjustedContentDimensions?.height?? 1000}
        // Making this small enough that the medium size doesn't get
        // responsive-handling-ed away when in the panel options editor.
        minChildrenHeight={50}
        legendSize={legend?.size}
        legendProps={
          legend && {
            options: legend,
            data: legendItems,
            selectedItems: selectedLegendItems,
            onSelectedItemsChange: setSelectedLegendItems,
            tableProps: {
              columns: [],
              sorting: legendSorting,
              onSortingChange: setLegendSorting,
            },
            onItemMouseOver: (e, { id }) => {
              chartRef.current?.highlightSeries({ name: id });
            },
            onItemMouseOut: () => {
              chartRef.current?.clearHighlightedSeries();
            },
          }
        }
      >
        {({ height, width }) => {
          return (
            <Box sx={{ height, width }}>
              <PieChart
                data={pieChartData}
                width={contentDimensions.width - PADDING * 2}
                height={contentDimensions.height - PADDING * 2}
              />
            </Box>
          );
        }}
      </ContentWithLegend>
    </Box>
  );
}
