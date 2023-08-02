import { ClickStat, geTotalClicksByDay } from '@/utilities/httpClient';
import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import {
  Chart as ChartJS,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  TimeSeriesScale,
} from 'chart.js';
import {
  mapToAxes,
  calculateStepSize,
  subtractDays,
} from '@/utilities/chartUtilities';
import { StatView } from './statView';

ChartJS.register(LinearScale, BarElement, Tooltip, Legend, TimeSeriesScale);

export function ClickCount({ id }: { id: string }) {
  const [clickStat, setClickStat] = useState<ClickStat>();

  return (
    <StatView
      className="bg-slate-50 rounded-lg p-5 w-full h-auto"
      data-testid="clickCount"
      onFetchData={fetchTotalClicksByDay()}
    >
      {clickStat && displayChart()}
    </StatView>
  );

  function fetchTotalClicksByDay(): () => Promise<unknown> {
    return async () => {
      if (id) setClickStat(await geTotalClicksByDay(id));
    };
  }

  function displayChart() {
    return (
      <div>
        <div className="pb-3">
          <h4 className="text-xs font-bold">Total Clicks</h4>
          <p className="text-cyan-600 text-md">{clickStat?.totalClicks}</p>
        </div>
        <Bar data={buildDataSets()} options={buildOptions()} />
      </div>
    );
  }

  function buildDataSets() {
    return {
      datasets: [
        {
          backgroundColor: '#22d3ee',
          hoverBackgroundColor: '#06b6d4',
          data: mapToAxes(clickStat?.dailyClickCounts ?? []),
        },
      ],
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function buildOptions(): any {
    return {
      plugins: buildPluginsSettings(),
      scales: buildScalesSettings(),
    };

    function buildPluginsSettings() {
      return {
        tooltip: buildToolTipSettings(),
        legend: buildLegendSettings(),
      };

      function buildToolTipSettings() {
        return {
          callbacks: {
            label: function (context: { parsed: { y: number } }) {
              const clicks = context.parsed.y;
              if (clicks > 1) return `${clicks} clicks`;
              return `${clicks} click`;
            },
          },
        };
      }

      function buildLegendSettings() {
        return {
          display: false,
        };
      }
    }

    function buildScalesSettings() {
      return {
        x: buildXAxisSettings(),
        y: buildYAxisSettings(),
      };

      function buildXAxisSettings() {
        return {
          type: 'time',
          time: buildTimeSettings(),
          grid: buildGridSettings(),
          min: getMinimumDate(),
        };

        function buildTimeSettings() {
          return {
            unit: 'day',
            displayFormats: {
              day: 'dd/MM/yy',
            },
          };
        }

        function buildGridSettings() {
          return {
            drawTicks: true,
            drawOnChartArea: false,
          };
        }

        function getMinimumDate() {
          return subtractDays(getFirstDay(), 20);

          function getFirstDay() {
            return clickStat?.dailyClickCounts[0].day ?? '';
          }
        }
      }

      function buildYAxisSettings() {
        const totalClicks = clickStat?.totalClicks ?? 1;
        const stepSize = calculateStepSize(totalClicks);
        return {
          border: {
            dash: [5, 5],
          },
          ticks: {
            stepSize,
          },
          suggestedMax: totalClicks + stepSize,
        };
      }
    }
  }
}
