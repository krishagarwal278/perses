// Copyright 2023 The Perses Authors
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

import { ModeOption, SortOption } from '@perses-dev/components';
import { CalculationType, DEFAULT_CALCULATION, Definition, FormatOptions } from '@perses-dev/core';
import { OptionsEditorProps, LegendSpecOptions } from '@perses-dev/plugin-system';

export const DEFAULT_FORMAT: FormatOptions = { unit: 'decimal', shortValues: true };
export const DEFAULT_SORT: SortOption = 'desc';
export const DEFAULT_MODE: ModeOption = 'value';

/**
 * The schema for a BarChart panel.
 */
export interface BarChartDefinition extends Definition<PieChartOptions> {
  kind: 'PieChart';
}

/**
 * The Options object type supported by the BarChart panel plugin.
 */
export interface PieChartOptions {
  thresholds: import('/Users/kragarwa/perses/ui/core/dist/index').ThresholdOptions;
  querySettings: Array<
    import('/Users/kragarwa/perses/ui/panels-plugin/src/plugins/time-series-chart/time-series-chart-model').QuerySettingsOptions
  >;
  calculation: CalculationType;
  format?: FormatOptions;
  sort?: SortOption;
  mode?: ModeOption;
  legend?: LegendSpecOptions;
}

export type PieChartOptionsEditorProps = OptionsEditorProps<PieChartOptions>;

/**
 * Creates the initial/empty options for a BarChart panel.
 */
export function createInitialBarChartOptions(): PieChartOptions {
  return {
    calculation: DEFAULT_CALCULATION,
    format: DEFAULT_FORMAT,
    thresholds: DEFAULT_FORMAT,
    sort: DEFAULT_SORT,
    mode: DEFAULT_MODE,
  };
}
