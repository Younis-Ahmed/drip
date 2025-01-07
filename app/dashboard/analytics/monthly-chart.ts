import { date } from 'drizzle-orm/mysql-core'
import BetweenWeeks from './between-weeks'
import CheckDate from './check-date'

export function monthlyChart(chartItems: { date: Date, revenue: number }[]) {
  return [
    {
      date: '3 weeks ago',
      revenue: chartItems.filter(order => BetweenWeeks(order.date!, 28, 21)).reduce((acc, order) => acc + order.revenue, 0),
    },
    {
      date: '2 weeks ago',
      revenue: chartItems.filter(order => BetweenWeeks(order.date!, 21, 14)).reduce((acc, order) => acc + order.revenue, 0),
    },
    {
      date: '1 weeks ago',
      revenue: chartItems.filter(order => BetweenWeeks(order.date!, 14, 7)).reduce((acc, order) => acc + order.revenue, 0),
    },
    {
      date: 'This week',
      revenue: chartItems.filter(order => BetweenWeeks(order.date!, 7, 0)).reduce((acc, order) => acc + order.revenue, 0),

    },
  ]
}
