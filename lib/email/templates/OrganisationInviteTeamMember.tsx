import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface OrganizationInviteTeamMemberEmailProps {
  url?: string;
}

export const OrganizationInviteTeamMemberEmail = ({
  url = '',
}: OrganizationInviteTeamMemberEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Invitation</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Text style={text}>Hi,</Text>

            <Button style={button} href={url}>
              Accept Invitation
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default OrganizationInviteTeamMemberEmail;

const main = {
  backgroundColor: '#f6f9fc',
  padding: '10px 0',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  padding: '45px',
};

const text = {
  fontSize: '16px',
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: '300',
  color: '#404040',
  lineHeight: '26px',
};

const button = {
  backgroundColor: '#007ee6',
  borderRadius: '4px',
  color: '#fff',
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '210px',
  padding: '14px 7px',
};

const anchor = {
  textDecoration: 'underline',
};