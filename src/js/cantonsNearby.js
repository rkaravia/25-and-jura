import { point as turfPoint } from '@turf/helpers';
import turfBearing from '@turf/bearing';
import turfBooleanContains from '@turf/boolean-contains';
import turfNearestPointOnLine from '@turf/nearest-point-on-line';
import turfPolygonToLine from '@turf/polygon-to-line';

import CANTONS from '../data/cantons.json';
import cantonNameToId from './cantonNameToId';

class CantonsNearby {
  constructor(point) {
    this.current = null;
    this.nearby = [];
    this._point = point;
    this._distanceMap = new Map();

    this._populateDistanceMap();
    this._populateNearby();
  }

  _populateDistanceMap() {
    CANTONS.features.forEach((cantonPolygon) => {
      const cantonName = cantonPolygon.properties.NAME;
      if (turfBooleanContains(cantonPolygon, this._point)) {
        this.current = {
          bearing: 0,
          distance: 0,
          id: cantonNameToId(cantonName),
          name: cantonName,
        };
      } else {
        const distanceBearing = this._distanceToCanton(cantonPolygon);
        this._updateDistance(cantonName, distanceBearing);
      }
    });
  }

  _distanceToCanton(cantonPolygon) {
    const line = turfPolygonToLine(cantonPolygon);
    const nearest = turfNearestPointOnLine(line, this._point, { units: 'meters' });
    const bearing = turfBearing(this._point, nearest);
    const distance = nearest.properties.dist;
    return { bearing, distance };
  }

  _updateDistance(cantonName, distanceBearing) {
    const { distance } = distanceBearing;
    const distanceBefore = this._distanceMap.get(cantonName);
    if (distanceBefore === undefined || distanceBefore.distance > distance) {
      this._distanceMap.set(cantonName, distanceBearing);
    }
  }

  _populateNearby() {
    this.nearby = [...this._distanceMap].map(([name, { bearing, distance }]) => {
      const id = cantonNameToId(name);
      return {
        bearing, distance, id, name,
      };
    }).filter((canton) => {
      if (this.current) {
        return canton.name !== this.current.name;
      }
      return true;
    }).sort((a, b) => a.distance - b.distance);
  }
}

export default ({ longitude, latitude }) => {
  const point = turfPoint([longitude, latitude]);
  const cantonsNearby = new CantonsNearby(point);
  const { current, nearby } = cantonsNearby;
  return { current, nearby };
};
