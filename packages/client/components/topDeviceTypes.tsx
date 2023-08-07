import {
  DeviceTypePercentage,
  getTopDeviceTypes,
} from '@/utilities/httpClient';
import { useState } from 'react';
import { StatView } from './statView';

export function TopDeviceTypes({ id }: { id: string }) {
  const [topDeviceTypes, setTopDeviceTypes] =
    useState<DeviceTypePercentage[]>();

  return (
    <StatView
      className="bg-slate-50 rounded-lg p-5 w-full h-auto"
      onFetchData={fetchTopDeviceTypes()}
    >
      {displayTopDeviceTypes()}
    </StatView>
  );

  function fetchTopDeviceTypes(): () => Promise<unknown> {
    return async () => {
      if (id) setTopDeviceTypes(await getTopDeviceTypes(id));
    };
  }

  function displayTopDeviceTypes() {
    return (
      <div>
        <h4 className="text-xs font-bold">Top devices</h4>
        <div role="list" className="flex flex-col gap-1 pt-2">
          {topDeviceTypes?.map((e, i) => {
            return (
              <div role="listitem" key={i} className="text-xs relative">
                <div className="flex justify-between p-2 z-10 relative">
                  <p className="font-semibold">{e.type}</p>
                  <p>{e.percentage}</p>
                </div>
                <div
                  className={`h-full w-[${formatPercentage(
                    e.percentage
                  )}] max-w-full bg-cyan-400 absolute top-0 right-0`}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
    );

    function formatPercentage(percentage: number) {
      return `${Math.round(percentage * 100)}%`;
    }
  }
}
