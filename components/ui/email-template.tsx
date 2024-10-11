import { Button } from "./button";

interface EmailTemplateProps {
  confirmLink: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({ confirmLink }) => (
  <div>
    <p><strong>Hi there!</strong></p>
    <Button ref={confirmLink}>Click here to confirm your email address</Button>
  </div>
);
