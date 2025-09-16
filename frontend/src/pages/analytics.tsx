import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, PieChart, Download } from 'lucide-react';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const metrics = {
    testCoverage: 85,
    passRate: 92,
    automationCoverage: 68,
    defectDensity: 2.3,
    avgResolutionTime: 4.2,
    teamProductivity: 87
  };

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white"> Analytics Dashboard</h1>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Test Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.testCoverage}%</div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${metrics.testCoverage}%` }}></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Pass Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.passRate}%</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">+2.3% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Automation Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{metrics.automationCoverage}%</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">+5.1% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Test Execution Trends</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">Pass/Fail rates over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded">
              <TrendingUp className="h-16 w-16 text-gray-400" />
              <p className="ml-4 text-gray-500 dark:text-gray-400">Chart visualization would go here</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Automation vs Manual</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">Test execution breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded">
              <PieChart className="h-16 w-16 text-gray-400" />
              <p className="ml-4 text-gray-500 dark:text-gray-400">Pie chart would go here</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Test Case Performance</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">Top performing and problematic test cases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded">
              <span className="font-medium text-gray-900 dark:text-white">Login Functionality Tests</span>
              <span className="text-green-600 font-bold">98% Pass Rate</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
              <span className="font-medium text-gray-900 dark:text-white">Payment Processing Tests</span>
              <span className="text-yellow-600 font-bold">85% Pass Rate</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded">
              <span className="font-medium text-gray-900 dark:text-white">API Integration Tests</span>
              <span className="text-red-600 font-bold">72% Pass Rate</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
