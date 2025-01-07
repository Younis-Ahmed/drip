import { date } from 'drizzle-orm/mysql-core'
import CheckDate from './check-date'

export function weeklyChart(chartItems: { date: Date, revenue: number }[]) {
  return [
    {
      date: '6 days ago',
      revenue: chartItems.filter(order => CheckDate(order.date, 6)).reduce((acc, order) => acc + order.revenue, 0),
    },
    {
      date: '5 days ago',
      revenue: chartItems.filter(order => CheckDate(order.date, 5)).reduce((acc, order) => acc + order.revenue, 0),
    },
    {
      date: '4 days ago',
      revenue: chartItems.filter(order => CheckDate(order.date, 4)).reduce((acc, order) => acc + order.revenue, 0),
    },
    {
      date: '3 days ago',
      revenue: chartItems.filter(order => CheckDate(order.date, 3)).reduce((acc, order) => acc + order.revenue, 0),

    },
    {
      date: '2 days ago',
      revenue: chartItems.filter(order => CheckDate(order.date, 2)).reduce((acc, order) => acc + order.revenue, 0),
    },
    {
      date: 'Yesterday',
      revenue: chartItems.filter(order => CheckDate(order.date, 1)).reduce((acc, order) => acc + order.revenue, 0),
    },
    {
      date: 'Today',
      revenue: chartItems.filter(order => CheckDate(order.date, 0)).reduce((acc, order) => acc + order.revenue, 0),
    },
  ]
}
