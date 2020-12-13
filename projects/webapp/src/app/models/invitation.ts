import { User } from './user';

export interface Invitation {
  id?: string;
  email?: string;
  inviter?: User;
  active?: boolean;
  status?: statusInvitation;
  groupId?: string;
  groupName?: string;
  role?: 'admin' | 'member';
}

export enum statusInvitation {
  pending = 'pending',
  accepted = 'accepted',
  revoked = 'revoked'
}
