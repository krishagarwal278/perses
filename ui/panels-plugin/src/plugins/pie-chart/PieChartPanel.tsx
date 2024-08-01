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

import { PieChart, PieChartData, LoadingOverlay, useChartsTheme } from '@perses-dev/components';
import { Box } from '@mui/material';
import { useMemo } from 'react';
import { CalculationType, CalculationsMap } from '@perses-dev/core';
import { useDataQueries, PanelProps } from '@perses-dev/plugin-system';
// import { SeriesData } from 'echarts/types/dist/shared';
import { PieChartOptions } from './pie-chart-model';
import { calculatePercentages, sortSeriesData } from './utils';

export type PieChartPanelProps = PanelProps<PieChartOptions>;

export function PieChartPanel(props) {
  const {
    spec: { calculation, sort, mode },
    contentDimensions,
  } = props;

  const chartsTheme = useChartsTheme();
  const PADDING = chartsTheme.container.padding.default;

  const { queryResults, isLoading, isFetching } = useDataQueries('TimeSeriesQuery'); // gets data queries from a context provider, see DataQueriesProvider
  console.log(queryResults);
  const pieChartData: PieChartData[] = useMemo(() => {
    const calculate = CalculationsMap[calculation as CalculationType];
    const pieChartData: PieChartData[] = [];
    for (const result of queryResults) {
      // Skip queries that are still loading or don't have data
      if (result.isLoading || result.isFetching || result.data === undefined) continue;
      for (const seriesData of result.data.series) {
        const series = {
          value: calculate(seriesData.values) ?? null,
          name: seriesData.formattedName ?? '',
        };
        console.log('Series Data Value', seriesData.values);
        pieChartData.push(series);
        console.log({ series });
      }
    }

    const sortedPieChartData = sortSeriesData(pieChartData, sort);
    if (mode === 'percentage') {
      return calculatePercentages(sortedPieChartData);
    } else {
      return sortedPieChartData;
    }
  }, [queryResults, sort, mode, calculation]);
  console.log(pieChartData);
  if (queryResults[0]?.error) throw queryResults[0]?.error;

  if (contentDimensions === undefined) return null;

  if (isLoading || isFetching) {
    return <LoadingOverlay />;
  }

  return (
    <Box sx={{ padding: `${PADDING}px` }}>
      <PieChart
        width={0}
        height={0}
        data={null} // width={contentDimensions.width - PADDING * 2}
        // height={contentDimensions.height - PADDING * 2}
        // format={format}
        // mode={mode}
      />
    </Box>
  );
}
