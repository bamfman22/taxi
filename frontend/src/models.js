// @flow
//
import type { Dispatch } from 'redux';

export type DispatchProps = {
  dispatch: Dispatch
};

export const DestinationName = {
  sfo: 'San Francisco International Airport',
  oak: 'Oakland International Airport',
  sjc: 'Norman Y. Mineta San Jose International Airport'
};

export type Destination = $Keys<typeof DestinationName>;

export type Coordinate = {
  lat: number,
  lng: number
};

export type User = {
  name: string,
  profile_picture: ?string,
  activated: boolean,
  role: string,
  phone: ?string,
  email: ?string
};

export type Driver = User & {
  plate: string
};

export type Trip = {
  id: number,
  driver: ?Driver,
  created: number,
  destination: Destination,
  passenger: User,
  subtotal: ?string,
  status: string,
  notified: boolean,
  location?: {
    driver: Coordinate,
    passenger: Coordinate
  }
};
