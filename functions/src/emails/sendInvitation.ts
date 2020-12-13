// tslint:disable-next-line:no-implicit-dependencies
import { Invitation } from '@app/models';
import * as sgMail from '@sendgrid/mail';
import * as functions from 'firebase-functions';

const SENDGRID_API_KEY = functions.config().sendgrid.key;
const PBKS_DOMAIN = functions.config().pesabooks.domain;

sgMail.setApiKey(SENDGRID_API_KEY);

export const sendInvitation = functions.https.onCall(async (data, context) => {
  const invitation: Invitation = data.invitation;

  const msg = {
    to: invitation.email,
    from: {
      name: 'Pesabooks',
      email: 'no-reply@pesabooks.com'
    },
    subject: invitation.inviter.fullName,
    // text: `Hey ${toName}. You have a new follower!!! `,
    // html: `<strong>Hey ${toName}. You have a new follower!!!</strong>`,

    // custom templates
    templateId: '54e8b3d0-1b17-4a3c-8a23-029026fa7f99',
    substitutionWrappers: ['{{', '}}'],
    substitutions: {
      group: invitation.groupName,
      inviterName: invitation.inviter.fullName,
      inviterEmail: invitation.inviter.email,
      url: `https://${PBKS_DOMAIN}/auth?code=${invitation.id}`
      // and other custom properties here
    }
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.log(error);
  }

  return {};
});
