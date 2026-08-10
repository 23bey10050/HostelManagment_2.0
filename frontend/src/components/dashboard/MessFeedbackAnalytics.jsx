import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function MessFeedbackAnalytics({ analytics }) {
  const overallChartRef = useRef(null);
  const messComparisonChartRef = useRef(null);
  const mealTypeChartRef = useRef(null);
  const ratingDistributionChartRef = useRef(null);
  
  // Chart.js instances
  const chartInstances = useRef({});
  
  useEffect(() => {
    if (!analytics) return;
    
    // Destroy existing charts to prevent memory leaks
    Object.values(chartInstances.current).forEach(chart => chart.destroy());
    chartInstances.current = {};
    
    // Create overall ratings chart - simplified bar chart instead of radar
    if (overallChartRef.current) {
      const ctx = overallChartRef.current.getContext('2d');
      chartInstances.current.overall = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Food Quality', 'Cleanliness', 'Service Quality'],
          datasets: [{
            label: 'Average Rating (out of 5)',
            data: [
              analytics.overall.foodQualityAvg,
              analytics.overall.cleanlinessAvg,
              analytics.overall.serviceQualityAvg
            ],
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 206, 86)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              max: 5,
              ticks: {
                stepSize: 1,
                callback: function(value) {
                  return value + ' ★';
                }
              },
              title: {
                display: true,
                text: 'Average Rating'
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Overall Mess Performance',
              font: {
                size: 16
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': ' + context.raw.toFixed(1) + ' ★';
                }
              }
            }
          }
        }
      });
    }
    
    // Create mess comparison chart - simplified
    if (messComparisonChartRef.current && analytics.messwise.length > 0) {
      const ctx = messComparisonChartRef.current.getContext('2d');
      const messNames = analytics.messwise.map(item => item._id);
      
      chartInstances.current.messComparison = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: messNames,
          datasets: [
            {
              label: 'Food Quality',
              data: analytics.messwise.map(item => item.foodQualityAvg),
              backgroundColor: 'rgba(255, 99, 132, 0.7)',
              borderColor: 'rgb(255, 99, 132)',
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              max: 5,
              ticks: {
                stepSize: 1,
                callback: function(value) {
                  return value + ' ★';
                }
              },
              title: {
                display: true,
                text: 'Food Quality Rating'
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Food Quality by Mess',
              font: {
                size: 16
              }
            },
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return 'Rating: ' + context.raw.toFixed(1) + ' ★';
                }
              }
            }
          }
        }
      });
    }
    
    // Create meal type chart - simple pie chart
    if (mealTypeChartRef.current && analytics.mealType.length > 0) {
      const ctx = mealTypeChartRef.current.getContext('2d');
      const mealTypes = analytics.mealType.map(item => item._id);
      
      chartInstances.current.mealType = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: mealTypes,
          datasets: [
            {
              data: analytics.mealType.map(item => item.count),
              backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)'
              ],
              borderColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 206, 86)',
                'rgb(75, 192, 192)'
              ],
              borderWidth: 1
            }
          ]
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Feedback by Meal Type',
              font: {
                size: 16
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((context.raw / total) * 100);
                  return `${context.label}: ${context.raw} (${percentage}%)`;
                }
              }
            }
          }
        }
      });
    }
    
    // Create rating distribution chart - simple bar chart
    if (ratingDistributionChartRef.current && analytics.ratingDistribution) {
      const ctx = ratingDistributionChartRef.current.getContext('2d');
      
      // Process data for display
      const foodQualityData = analytics.ratingDistribution.foodQuality.map(item => ({
        rating: item._id,
        count: item.count
      }));
      
      chartInstances.current.ratingDistribution = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
          datasets: [
            {
              label: 'Number of Ratings',
              data: [
                foodQualityData.find(d => d.rating === 1)?.count || 0,
                foodQualityData.find(d => d.rating === 2)?.count || 0,
                foodQualityData.find(d => d.rating === 3)?.count || 0,
                foodQualityData.find(d => d.rating === 4)?.count || 0,
                foodQualityData.find(d => d.rating === 5)?.count || 0
              ],
              backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(255, 159, 64, 0.7)',
                'rgba(255, 205, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(54, 162, 235, 0.7)'
              ],
              borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)'
              ],
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Ratings'
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Food Quality Rating Distribution',
              font: {
                size: 16
              }
            }
          }
        }
      });
    }
    
    // Cleanup function
    return () => {
      Object.values(chartInstances.current).forEach(chart => chart.destroy());
    };
  }, [analytics]);

  if (!analytics) {
    return <div>No analytics data available</div>;
  }

  return (
    <div className="space-y-8">
      {/* Overall Stats at the top - badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-600">{analytics.overall.count}</div>
          <div className="text-sm font-medium text-gray-600">Total Submissions</div>
        </div>
        
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-amber-600">
            {analytics.overall.foodQualityAvg.toFixed(1)} ★
          </div>
          <div className="text-sm font-medium text-gray-600">Food Quality</div>
        </div>
        
        <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-emerald-600">
            {analytics.overall.cleanlinessAvg.toFixed(1)} ★
          </div>
          <div className="text-sm font-medium text-gray-600">Cleanliness</div>
        </div>
        
        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-purple-600">
            {analytics.overall.serviceQualityAvg.toFixed(1)} ★
          </div>
          <div className="text-sm font-medium text-gray-600">Service Quality</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Stats */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="h-60">
            <canvas ref={overallChartRef}></canvas>
          </div>
        </div>

        {/* Mess Comparison */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="h-60">
            <canvas ref={messComparisonChartRef}></canvas>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meal Type */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="h-60">
            <canvas ref={mealTypeChartRef}></canvas>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="h-60">
            <canvas ref={ratingDistributionChartRef}></canvas>
          </div>
        </div>
      </div>
      
      {/* Legend explaining the star ratings */}
      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <h3 className="font-medium mb-2">Rating Scale:</h3>
        <div className="grid grid-cols-5 gap-2">
          <div>1 ★: Poor</div>
          <div>2 ★: Fair</div>
          <div>3 ★: Good</div>
          <div>4 ★: Very Good</div>
          <div>5 ★: Excellent</div>
        </div>
      </div>
    </div>
  );
}

export default MessFeedbackAnalytics;
