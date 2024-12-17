interface EmailTemplateProps {
  confirmLink: string
  title: string
  linkContent: string
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({ confirmLink, title, linkContent }) => (
  <div>
    <p>
      <strong>{title}</strong>
    </p>
    <a href={confirmLink}>{linkContent}</a>
  </div>
)
