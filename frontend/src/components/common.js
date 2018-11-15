// @flow

import React from 'react';
import { Avatar } from 'antd';

import type { User } from '../models';

function getInitial(name: string): string {
  const parts = name.split(' ');

  if (parts.length === 1) {
    return parts[0][0];
  }
  return parts[0][0] + parts.slice(-1)[0][0];
}

export function renderAvatar(user: User) {
  const props = {
    size: 64
  };

  if (user.profile_picture == null) {
    return (
      <Avatar style={{ fontSize: 26 }} {...props}>
        {getInitial(user.name)}
      </Avatar>
    );
  }

  return <Avatar src={user.profile_picture} {...props} />;
}
