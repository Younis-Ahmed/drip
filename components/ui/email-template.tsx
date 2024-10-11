interface EmailTemplateProps {
  confirmLink: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({ confirmLink }) => (
  <div>
    <p>
      <strong>Hi there!</strong>
    </p>
    <a href={confirmLink}>Click here to confirm your email address</a>
  </div>
);
