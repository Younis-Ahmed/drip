import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import BackButton from './back-button'
import Socials from './socials'

interface CardWrapperProps {
  children: React.ReactNode
  cardTitle: string
  backBtnHref: string
  backBtnLabel: string
  showSocials?: boolean
}

export function AuthCard({
  children,
  cardTitle,
  backBtnHref,
  backBtnLabel,
  showSocials,
}: CardWrapperProps) {
  return (
    <Card className="dark:border-white/60">
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
  )
}
