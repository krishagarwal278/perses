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

import merge from 'lodash/merge';
import {
  CalculationSelector,
  CalculationSelectorProps,
  LegendOptionsEditor,
  LegendOptionsEditorProps,
} from '@perses-dev/plugin-system';
import { produce } from 'immer';
import {
  FormatControls,
  FormatControlsProps,
  OptionsEditorGroup,
  OptionsEditorGrid,
  OptionsEditorColumn,
  SortSelector,
  // ThresholdsEditor,
  // ThresholdsEditorProps,
  SortSelectorProps,
  ModeSelector,
  ModeSelectorProps,
  ModeOption,
  SortOption,
} from '@perses-dev/components';
import { CalculationType, DEFAULT_CALCULATION, isPercentUnit, FormatOptions } from '@perses-dev/core';
import { Button } from '@mui/material';
// import { QuerySettingsEditor } from '../time-series-chart/QuerySettingsEditor';
import {
  PieChartOptions,
  PieChartOptionsEditorProps,
  DEFAULT_FORMAT,
  DEFAULT_SORT,
  DEFAULT_MODE,
} from './pie-chart-model';

export function PieChartOptionsEditorSettings(props: PieChartOptionsEditorProps) {
  const { onChange, value } = props;

  const handleCalculationChange: CalculationSelectorProps['onChange'] = (newCalculation: CalculationType) => {
    onChange(
      produce(value, (draft: PieChartOptions) => {
        draft.calculation = newCalculation;
      })
    );
  };

  const handleLegendChange: LegendOptionsEditorProps['onChange'] = (newLegend) => {
    // TODO (sjcobb): fix type, add position, fix glitch
    onChange(
      produce(value, (draft: PieChartOptions) => {
        draft.legend = newLegend;
      })
    );
  };

  const handleUnitChange: FormatControlsProps['onChange'] = (newFormat: FormatOptions) => {
    onChange(
      produce(value, (draft: PieChartOptions) => {
        draft.format = newFormat;
      })
    );
  };
  // const handleThresholdsChange: ThresholdsEditorProps['onChange'] = (thresholds) => {
  //   onChange(
  //     produce(value, (draft: PieChartOptions) => {
  //       draft.thresholds = thresholds;
  //     })
  //   );
  // };

  const handleSortChange: SortSelectorProps['onChange'] = (newSort: SortOption) => {
    onChange(
      produce(value, (draft: PieChartOptions) => {
        draft.sort = newSort;
      })
    );
  };

  const handleModeChange: ModeSelectorProps['onChange'] = (newMode: ModeOption) => {
    onChange(
      produce(value, (draft: PieChartOptions) => {
        draft.mode = newMode;
      })
    );
  };
  // const handleQuerySettingsChange: QuerySettingsEditorProps['onChange'] = (newQuerySettings) => {
  //   onChange(
  //     produce(value, (draft: PieChartOptions) => {
  //       draft.querySettings = newQuerySettings;
  //     })
  //   );
  // };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleResetSettings: React.MouseEventHandler<HTMLButtonElement> = () => {
    onChange(
      produce(value, (draft: PieChartOptions) => {
        draft.calculation = DEFAULT_CALCULATION;
        draft.format = DEFAULT_FORMAT;
        draft.sort = DEFAULT_SORT;
        draft.mode = DEFAULT_MODE;
      })
    );
  };

  // ensures decimalPlaces defaults to correct value
  const format = merge({}, DEFAULT_FORMAT, value.format);

//   const legendvalue = {
//     legend: { position: 'bottom', mode: 'list', size: 'medium' } ,
//     legendItems: {
// {legend: {position: "bottom", mode: "list", size: "medium"}}
// {id: "time-series-panel-5up{env=\"demo\",instance=\"demo.do.prometheus.io:8080\",job=\"cadvisor\"}0", label: "up{env=\"demo\",instance=\"demo.do.prometheus.io:8080\",job=\"cadvisor\"}", color: "hsla(263.66,50%,65%,0.9)", data: undefined}
// {id: "time-series-panel-5up{env=\"demo\",instance=\"demo.do.prometheus.io:9093\",job=\"alertmanager\"}1", label: "up{env=\"demo\",instance=\"demo.do.prometheus.io:9093\",job=\"alertmanager\"}", color: "hsla(166.38,50%,35%,0.9)", data: undefined}
// {id: "time-series-panel-5up{env=\"demo\",instance=\"demo.do.prometheus.io:9100\",job=\"node\"}2", label: "up{env=\"demo\",instance=\"demo.do.prometheus.io:9100\",job=\"node\"}", color: "hsla(179.94,65%,65%,0.9)", data: undefined}
// {id: "time-series-panel-5up{instance=\"demo.do.prometheus.io:3000\",job=\"grafana\"}3", label: "up{instance=\"demo.do.prometheus.io:3000\",job=\"grafana\"}", color: "hsla(223.44,35%,50%,0.9)", data: undefined}
// {id: "time-series-panel-5up{instance=\"demo.do.prometheus.io:8996\",job=\"random\"}4", label: "up{instance=\"demo.do.prometheus.io:8996\",job=\"random\"}", color: "hsla(161.24,35%,35%,0.9)", data: undefined}
// {id: "time-series-panel-5up{instance=\"demo.do.prometheus.io:8997\",job=\"random\"}5", label: "up{instance=\"demo.do.prometheus.io:8997\",job=\"random\"}", color: "hsla(224.37,35%,35%,0.9)", data: undefined}
// {id: "time-series-panel-5up{instance=\"demo.do.prometheus.io:8998\",job=\"random\"}6", label: "up{instance=\"demo.do.prometheus.io:8998\",job=\"random\"}", color: "hsla(184.15,50%,50%,0.9)", data: undefined}
// {id: "time-series-panel-5up{instance=\"demo.do.prometheus.io:8999\",job=\"random\"}7", label: "up{instance=\"demo.do.prometheus.io:8999\",job=\"random\"}", color: "hsla(202.39,35%,35%,0.9)", data: undefined}
// {id: "time-series-panel-5up{instance=\"demo.do.prometheus.io:9090\",job=\"prometheus\"}8", label: "up{instance=\"demo.do.prometheus.io:9090\",job=\"prometheus\"}", color: "hsla(62.56,35%,35%,0.9)", data: undefined}
// {id: "time-series-panel-5up{instance=\"http://localhost:9100\",job=\"blackbox\"}9", label: "up{instance=\"http://localhost:9100\",job=\"blackbox\"}", color: "hsla(298.27,65%,65%,0.9)", data: undefined}
// {id: "time-series-panel-5up{instance=\"localhost:2019\",job=\"caddy\"}10", label: "up{instance=\"localhost:2019\",job=\"caddy\"}", color: "hsla(126.16,35%,50%,0.9)", data: undefined}

// Array Prototype

// Object Prototype
// {selectedLegendItems: "ALL"}
// {legendColumns: []}},
//     selectedLegendItems: 'ALL',
//     legendColumns: [],
//   };

  return (
    <OptionsEditorGrid>
      <OptionsEditorColumn>
        <LegendOptionsEditor value={value.legend} onChange={handleLegendChange} />
        <OptionsEditorGroup title="Misc">
          <FormatControls value={format} onChange={handleUnitChange} disabled={value.mode === 'percentage'} />
          <CalculationSelector value={value.calculation} onChange={handleCalculationChange} />
          <SortSelector value={value.sort} onChange={handleSortChange} />
          <ModeSelector value={value.mode} onChange={handleModeChange} disablePercentageMode={isPercentUnit(format)} />
        </OptionsEditorGroup>
      </OptionsEditorColumn>
      <OptionsEditorColumn>
        {/* <QuerySettingsEditor querySettingsList={value.querySettings} onChange={handleQuerySettingsChange} /> */}
        <OptionsEditorGroup title="Reset Settings">
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              onChange(
                produce(value, (draft: PieChartOptions) => {
                  // reset button removes all optional panel options
                  // draft.radius = undefined;
                  draft.legend = undefined;
                  // draft.visual = undefined;
                  // draft.thresholds = undefined;
                  // draft.querySettings = undefined;
                })
              );
            }}
          >
            Reset To Defaults
          </Button>
        </OptionsEditorGroup>
      </OptionsEditorColumn>
    </OptionsEditorGrid>
  );
}
