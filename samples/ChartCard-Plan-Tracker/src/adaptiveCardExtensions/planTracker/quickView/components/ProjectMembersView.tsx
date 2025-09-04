import * as React from 'react';
import { Stack, Persona, PersonaSize, Link } from '@fluentui/react';

export interface IUser {
    id: string;
    displayName: string;
    userPrincipalName: string;
    jobTitle?: string;
    mail?: string;
    department?: string;
  }

interface Props {
  users: IUser[];
}

const ProjectMembersView: React.FC<Props> = ({ users }) => {
  if (!users || users.length === 0) {
    return <span>No members found.</span>;
  }

  return (
    <Stack tokens={{ childrenGap: 12 }}>
      {users.map(user => (
        <Persona
          key={user.id}
          text={user.displayName}
          secondaryText={user.jobTitle}
          tertiaryText={user.department}
          size={PersonaSize.size48}
          onRenderSecondaryText={() => (
            <Link href={`mailto:${user.userPrincipalName}`} target="_blank">
              {user.userPrincipalName}
            </Link>
          )}
        />
      ))}
    </Stack>
  );
};

export default ProjectMembersView;
