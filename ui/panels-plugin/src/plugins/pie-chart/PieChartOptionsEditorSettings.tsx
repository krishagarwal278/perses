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
import { QuerySettingsEditor, QuerySettingsEditorProps } from '../time-series-chart/QuerySettingsEditor';
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
  const handleQuerySettingsChange: QuerySettingsEditorProps['onChange'] = (newQuerySettings) => {
    onChange(
      produce(value, (draft: PieChartOptions) => {
        draft.querySettings = newQuerySettings;
      })
    );
  };

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
        <QuerySettingsEditor querySettingsList={value.querySettings} onChange={handleQuerySettingsChange} />
        <OptionsEditorGroup title="Reset Settings">
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              onChange(
                produce(value, (draft: PieChartOptions) => {
                  // reset button removes all optional panel options
                  draft.radius = undefined;
                  draft.legend = undefined;
                  draft.visual = undefined;
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
