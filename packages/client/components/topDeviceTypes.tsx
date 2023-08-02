import { DeviceTypePercentage, getTopDevices } from '@/utilities/httpClient';
import { useEffect, useState } from 'react';
import { Loading } from './loading';

export function TopDeviceTypes({ id }: { id: string }) {
  const [topDeviceTypes, setTopDeviceTypes] =
    useState<DeviceTypePercentage[]>();

  useEffect(() => {
    (async () => {
      if (id) setTopDeviceTypes(await getTopDevices(id));
    })();
  }, [id]);

  return (
    <div>{topDeviceTypes ? displayTopDeviceTypes() : displayLoading()}</div>
  );

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

  function displayLoading() {
    return (
      <div className="flex justify-center items-center">
        <Loading colored={true} />
      </div>
    );
  }
}
