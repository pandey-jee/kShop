import React, { useState, useEffect } from 'react';
import { 
  Search, 
  TrendingUp, 
  AlertTriangle, 
  BarChart3, 
  Users, 
  Target,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Helmet } from 'react-helmet-async';
import api from '@/lib/api';

interface SearchAnalytics {
  totalSearches: number;
  topQueries: Array<{ query: string; count: number }>;
  noResultQueries: Array<{ query: string; count: number }>;
  avgResultsPerSearch: number;
  conversionRate: number;
  searchTrends: Array<{
    date: string;
    searches: number;
    conversions: number;
  }>;
  categoryDistribution: Array<{
    category: string;
    searches: number;
    percentage: number;
  }>;
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
}

export default function SearchAnalytics() {
  const [analytics, setAnalytics] = useState<SearchAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/search/analytics', {
        params: { timeRange }
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching search analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalytics();
    setRefreshing(false);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Helmet>
          <title>Search Analytics - Admin Dashboard</title>
        </Helmet>
        
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Search Analytics</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Analytics Data Available
        </h3>
        <p className="text-gray-600 mb-4">
          Search analytics data is not available at the moment.
        </p>
        <Button onClick={fetchAnalytics}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Search Analytics - Admin Dashboard</title>
        <meta name="description" content="View detailed search analytics and user behavior insights." />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Search Analytics</h1>
          <p className="text-gray-600">
            Insights into user search behavior and performance metrics
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Searches</p>
                <p className="text-2xl font-bold">{formatNumber(analytics.totalSearches)}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5% from last period
                </p>
              </div>
              <Search className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Results</p>
                <p className="text-2xl font-bold">{analytics.avgResultsPerSearch.toFixed(1)}</p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  per search query
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold">{analytics.conversionRate.toFixed(1)}%</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <Target className="h-3 w-3 mr-1" />
                  +2.3% improvement
                </p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">No Results</p>
                <p className="text-2xl font-bold">
                  {analytics.noResultQueries.reduce((sum, q) => sum + q.count, 0)}
                </p>
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Needs attention
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Search Queries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Search Queries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topQueries.map((query, index) => {
                const maxCount = analytics.topQueries[0]?.count || 1;
                const percentage = (query.count / maxCount) * 100;
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          #{index + 1}
                        </Badge>
                        <span className="font-medium">{query.query}</span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {formatNumber(query.count)} searches
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* No Results Queries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              No Results Queries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.noResultQueries.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">🎉</div>
                <p className="text-gray-600">
                  Great! No searches without results in this period.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {analytics.noResultQueries.map((query, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium text-red-700">{query.query}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {query.count} searches
                      </span>
                      <Button size="sm" variant="outline">
                        Add Products
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Category Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Search Distribution by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.categoryDistribution?.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{category.category}</span>
                  <span className="text-sm text-gray-600">
                    {category.percentage.toFixed(1)}%
                  </span>
                </div>
                <Progress value={category.percentage} className="h-2" />
                <p className="text-xs text-gray-500">
                  {formatNumber(category.searches)} searches
                </p>
              </div>
            )) || (
              <div className="col-span-full text-center py-4 text-gray-600">
                Category distribution data not available
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Device Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Device Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analytics.deviceBreakdown && Object.entries(analytics.deviceBreakdown).map(([device, count]) => {
              const total = Object.values(analytics.deviceBreakdown).reduce((sum, val) => sum + val, 0);
              const percentage = total > 0 ? (count / total) * 100 : 0;
              
              return (
                <div key={device} className="text-center">
                  <div className="text-2xl font-bold">{percentage.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600 capitalize">{device}</div>
                  <div className="text-xs text-gray-500">
                    {formatNumber(count)} searches
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Search Trends Chart */}
      {analytics.searchTrends && (
        <Card>
          <CardHeader>
            <CardTitle>Search Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2">
              {analytics.searchTrends.map((trend, index) => {
                const maxSearches = Math.max(...analytics.searchTrends.map(t => t.searches));
                const height = (trend.searches / maxSearches) * 100;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-500 rounded-t"
                      style={{ height: `${height}%` }}
                    />
                    <div className="text-xs text-gray-600 mt-2 text-center">
                      {new Date(trend.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="text-xs font-medium">
                      {trend.searches}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
