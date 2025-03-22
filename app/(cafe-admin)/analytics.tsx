import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface SalesData {
  date: string;
  amount: number;
}

interface TopProduct {
  name: string;
  quantity: number;
  revenue: number;
}

interface CustomerMetrics {
  totalCustomers: number;
  newCustomers: number;
  averageVisits: number;
  retentionRate: number;
}

interface PeakHour {
  hour: string;
  orders: number;
}

const MOCK_DATA = {
  overview: {
    totalSales: 12500,
    totalOrders: 450,
    averageOrderValue: 27.78,
    newCustomers: 85
  },
  revenueData: {
    daily: [
      { date: 'Mon', amount: 1200 },
      { date: 'Tue', amount: 1500 },
      { date: 'Wed', amount: 1800 },
      { date: 'Thu', amount: 1600 },
      { date: 'Fri', amount: 2200 },
      { date: 'Sat', amount: 2800 },
      { date: 'Sun', amount: 1600 }
    ],
    weekly: [
      { date: 'Week 1', amount: 8500 },
      { date: 'Week 2', amount: 9200 },
      { date: 'Week 3', amount: 8800 },
      { date: 'Week 4', amount: 12500 }
    ],
    monthly: [
      { date: 'Jan', amount: 32000 },
      { date: 'Feb', amount: 35000 },
      { date: 'Mar', amount: 38000 },
      { date: 'Apr', amount: 42000 },
      { date: 'May', amount: 45000 },
      { date: 'Jun', amount: 48000 }
    ]
  },
  topProducts: [
    { name: 'Cappuccino', quantity: 450, revenue: 2025 },
    { name: 'Latte', quantity: 380, revenue: 1900 },
    { name: 'Croissant', quantity: 320, revenue: 1120 },
    { name: 'Green Tea', quantity: 280, revenue: 840 },
    { name: 'Chocolate Cake', quantity: 250, revenue: 1250 }
  ],
  customerMetrics: {
    totalCustomers: 1200,
    newCustomers: 85,
    averageVisits: 3.2,
    retentionRate: 75
  },
  peakHours: [
    { hour: '8:00', orders: 45 },
    { hour: '9:00', orders: 65 },
    { hour: '10:00', orders: 85 },
    { hour: '11:00', orders: 95 },
    { hour: '12:00', orders: 120 },
    { hour: '13:00', orders: 110 },
    { hour: '14:00', orders: 90 },
    { hour: '15:00', orders: 75 }
  ]
};

type TimeRange = 'daily' | 'weekly' | 'monthly';

export default function Analytics() {
  const colorScheme = useColorScheme();
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');

  const isDark = colorScheme === 'dark';
  const textColor = isDark ? '#fff' : '#000';
  const bgColor = isDark ? '#000' : '#fff';
  const cardBgColor = isDark ? '#1c1c1e' : '#f2f2f7';

  const getMaxSales = (data: SalesData[]) => {
    if (!data || data.length === 0) return 0;
    return Math.max(...data.map(item => item.amount));
  };

  const renderSalesChart = () => {
    const data = MOCK_DATA.revenueData[timeRange];
    const maxSales = getMaxSales(data);
    const chartHeight = 200;
    const barWidth = (Dimensions.get('window').width - 64) / data.length - 8;

    return (
      <View style={styles.chartContainer}>
        {data.map((item, index) => {
          const barHeight = (item.amount / maxSales) * chartHeight;
          return (
            <View key={index} style={styles.barContainer}>
              <View 
                style={[
                  styles.bar,
                  { 
                    height: barHeight,
                    backgroundColor: '#007AFF'
                  }
                ]} 
              />
              <Text style={[styles.barLabel, { color: textColor }]}>
                {item.date}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Analytics",
          headerStyle: {
            backgroundColor: bgColor,
          },
          headerTintColor: textColor,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      />
      <ScrollView style={[styles.container, { backgroundColor: bgColor }]}>
        {/* Overview Cards */}
        <View style={styles.overviewContainer}>
          <View style={[styles.overviewCard, { backgroundColor: cardBgColor }]}>
            <FontAwesome name="dollar" size={24} color="#007AFF" />
            <Text style={[styles.overviewValue, { color: textColor }]}>
              ${MOCK_DATA.overview.totalSales.toLocaleString()}
            </Text>
            <Text style={styles.overviewLabel}>Total Sales</Text>
          </View>
          <View style={[styles.overviewCard, { backgroundColor: cardBgColor }]}>
            <FontAwesome name="shopping-cart" size={24} color="#007AFF" />
            <Text style={[styles.overviewValue, { color: textColor }]}>
              {MOCK_DATA.overview.totalOrders}
            </Text>
            <Text style={styles.overviewLabel}>Total Orders</Text>
          </View>
          <View style={[styles.overviewCard, { backgroundColor: cardBgColor }]}>
            <FontAwesome name="calculator" size={24} color="#007AFF" />
            <Text style={[styles.overviewValue, { color: textColor }]}>
              ${MOCK_DATA.overview.averageOrderValue.toFixed(2)}
            </Text>
            <Text style={styles.overviewLabel}>Avg. Order Value</Text>
          </View>
          <View style={[styles.overviewCard, { backgroundColor: cardBgColor }]}>
            <FontAwesome name="users" size={24} color="#007AFF" />
            <Text style={[styles.overviewValue, { color: textColor }]}>
              {MOCK_DATA.overview.newCustomers}
            </Text>
            <Text style={styles.overviewLabel}>New Customers</Text>
          </View>
        </View>

        {/* Revenue Chart */}
        <View style={[styles.section, { backgroundColor: cardBgColor }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Revenue</Text>
            <View style={styles.timeRangeSelector}>
              <TouchableOpacity
                style={[
                  styles.timeRangeButton,
                  timeRange === 'daily' && styles.timeRangeButtonActive
                ]}
                onPress={() => setTimeRange('daily')}
              >
                <Text style={[
                  styles.timeRangeButtonText,
                  timeRange === 'daily' && styles.timeRangeButtonTextActive
                ]}>Daily</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.timeRangeButton,
                  timeRange === 'weekly' && styles.timeRangeButtonActive
                ]}
                onPress={() => setTimeRange('weekly')}
              >
                <Text style={[
                  styles.timeRangeButtonText,
                  timeRange === 'weekly' && styles.timeRangeButtonTextActive
                ]}>Weekly</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.timeRangeButton,
                  timeRange === 'monthly' && styles.timeRangeButtonActive
                ]}
                onPress={() => setTimeRange('monthly')}
              >
                <Text style={[
                  styles.timeRangeButtonText,
                  timeRange === 'monthly' && styles.timeRangeButtonTextActive
                ]}>Monthly</Text>
              </TouchableOpacity>
            </View>
          </View>
          {renderSalesChart()}
        </View>

        {/* Top Products */}
        <View style={[styles.section, { backgroundColor: cardBgColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Top Products</Text>
          {MOCK_DATA.topProducts.map((product, index) => (
            <View key={index} style={styles.productRow}>
              <View style={styles.productInfo}>
                <Text style={[styles.productName, { color: textColor }]}>
                  {index + 1}. {product.name}
                </Text>
                <Text style={styles.productQuantity}>
                  {product.quantity} units sold
                </Text>
              </View>
              <Text style={[styles.productRevenue, { color: textColor }]}>
                ${product.revenue.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>

        {/* Customer Insights */}
        <View style={[styles.section, { backgroundColor: cardBgColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Customer Insights</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: textColor }]}>
                {MOCK_DATA.customerMetrics.totalCustomers.toLocaleString()}
              </Text>
              <Text style={styles.metricLabel}>Total Customers</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: textColor }]}>
                {MOCK_DATA.customerMetrics.newCustomers}
              </Text>
              <Text style={styles.metricLabel}>New Customers</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: textColor }]}>
                {MOCK_DATA.customerMetrics.averageVisits}
              </Text>
              <Text style={styles.metricLabel}>Avg. Visits/Month</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: textColor }]}>
                {MOCK_DATA.customerMetrics.retentionRate}%
              </Text>
              <Text style={styles.metricLabel}>Retention Rate</Text>
            </View>
          </View>
        </View>

        {/* Peak Hours */}
        <View style={[styles.section, { backgroundColor: cardBgColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Peak Hours</Text>
          <View style={styles.peakHoursContainer}>
            {MOCK_DATA.peakHours.map((hour, index) => {
              const maxOrders = Math.max(...MOCK_DATA.peakHours.map(h => h.orders));
              const barHeight = (hour.orders / maxOrders) * 100;
              return (
                <View key={index} style={styles.peakHourBar}>
                  <View 
                    style={[
                      styles.peakHourBarFill,
                      { height: `${barHeight}%` }
                    ]} 
                  />
                  <Text style={[styles.peakHourLabel, { color: textColor }]}>
                    {hour.hour}
                  </Text>
                  <Text style={styles.peakHourValue}>{hour.orders}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  overviewCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: '600',
    marginVertical: 8,
  },
  overviewLabel: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  timeRangeSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 4,
  },
  timeRangeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  timeRangeButtonActive: {
    backgroundColor: '#007AFF',
  },
  timeRangeButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  timeRangeButtonTextActive: {
    color: '#fff',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 200,
    paddingVertical: 16,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  bar: {
    width: '100%',
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 12,
    marginTop: 8,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: 14,
    color: '#666',
  },
  productRevenue: {
    fontSize: 16,
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  metricItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
  },
  peakHoursContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    paddingTop: 16,
  },
  peakHourBar: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  peakHourBarFill: {
    width: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  peakHourLabel: {
    fontSize: 12,
    marginTop: 8,
  },
  peakHourValue: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
}); 