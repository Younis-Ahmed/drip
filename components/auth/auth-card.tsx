import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Socials from './socials';
import BackButton from './back-button';

type CardWrapperProps = {
  children: React.ReactNode;
  cardTitle: string;
  backBtnHref: string;
  backBtnLabel: string;
  showSocials?: boolean;
};

export const AuthCard = ({
  children,
  cardTitle,
  backBtnHref,
  backBtnLabel,
  showSocials,
}: CardWrapperProps) => {
  return (
    <Card className='dark:border-white/60'>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocials && (
        <CardFooter>
          <Socials />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton label={backBtnLabel} href={backBtnHref} />
      </CardFooter>
    </Card>
  );
};
