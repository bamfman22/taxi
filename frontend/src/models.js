// @flow
//
import type { Dispatch } from 'redux';

const destinations = {
  sfo: 'sfo',
  oak: 'oak',
  sjc: 'sjc'
};

export type DispatchProps = {
  dispatch: Dispatch
};

export type Destination = $Keys<typeof destinations>;

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
  location?: {
    driver: Coordinate,
    passenger: Coordinate
  }
};
