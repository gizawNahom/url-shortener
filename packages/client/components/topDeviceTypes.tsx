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
    <StatView className="" onFetchData={fetchTopDeviceTypes()}>
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
        <p>Top devices</p>
        <div role="list">
          {topDeviceTypes?.map((e, i) => {
            return (
              <div role="listitem" key={i}>
                {e.type} {e.percentage}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
