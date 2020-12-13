import { Doc } from './doc';
import { RoleEnum } from './role';

export interface User extends Doc {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  isHost?: boolean;
  lastGroupId?: string;
  pictureUrl?: string;
  isDemo?: boolean;
  groups?: {
    [groupId: string]: {
      isMember: boolean;
      isOwner: boolean;
      role: RoleEnum;
    };
  };
}
