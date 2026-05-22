import { useState } from 'react';

import toast from 'react-hot-toast';

import api from '../utils/api';

export default function AIInsights() {

  const [insights, setInsights] = useState(null);

  const [loading, setLoading] = useState(false);

  const generate = async () => {

    setLoading(true);

    setInsights(null);

    try {

      const response = await api.post(
        '/ai/generate-insights'
      );

      setInsights(response.data.insights);

      toast.success('Insights generated!');

    } catch (error) {

      toast.error(

        error.response?.data?.message

        || 'Failed to generate insights'

      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div>

      <h2 className="font-display text-xl font-bold text-white">

        AI Sales Insights

      </h2>

      <p className="text-gray-400 text-sm mt-1 mb-6">

        AI-powered pricing recommendations and market trend analysis.

      </p>

      <button

        className="btn-primary mb-6"

        onClick={generate}

        disabled={loading}

      >

        {loading

          ? '⏳ Analyzing your store...'

          : '✨ Generate Insights'}

      </button>

      {loading && (

        <div className="card text-center py-12">

          <div className="text-gray-400 text-sm">

            AI is analyzing your store data...

          </div>

        </div>

      )}

      {insights && (

        <div className="space-y-4">

          {/* Overall Summary */}

          {insights.overallSummary && (

            <div className="card border-accent/30">

              <div className="flex items-center gap-3 mb-3">

                <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center text-base">

                  🏪

                </div>

                <h3 className="font-semibold text-white text-sm">

                  Store Health Summary

                </h3>

              </div>

              <p className="text-sm text-gray-300 leading-relaxed">

                {insights.overallSummary}

              </p>

            </div>

          )}

          {/* Pricing Recommendations */}

          {insights.pricingRecommendations?.length > 0 && (

            <div className="card">

              <div className="flex items-center gap-3 mb-4">

                <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center text-base">

                  💰

                </div>

                <h3 className="font-semibold text-white text-sm">

                  Pricing Recommendations

                </h3>

              </div>

              <div className="space-y-3">

                {insights.pricingRecommendations.map((recommendation, index) => (

                  <div
                    key={index}
                    className="bg-bg rounded-lg p-3"
                  >

                    <div className="flex items-center justify-between mb-1">

                      <p className="text-white text-sm font-medium">

                        {recommendation.product}

                      </p>

                      <div className="flex items-center gap-2 text-xs">

                        <span className="text-gray-400">

                          ${recommendation.currentPrice}

                        </span>

                        <span className="text-gray-500">
                          →
                        </span>

                        <span className="text-accent2 font-semibold">

                          ${recommendation.suggestedPrice}

                        </span>

                      </div>

                    </div>

                    <p className="text-gray-400 text-xs leading-relaxed">

                      {recommendation.reason}

                    </p>

                  </div>

                ))}

              </div>

            </div>

          )}

          {/* Trending Insights */}

          {insights.trendingInsights?.length > 0 && (

            <div className="card">

              <div className="flex items-center gap-3 mb-4">

                <div className="w-8 h-8 rounded-lg bg-accent2/10 flex items-center justify-center text-base">

                  📈

                </div>

                <h3 className="font-semibold text-white text-sm">

                  Trending Insights

                </h3>

              </div>

              <div className="space-y-2">

                {insights.trendingInsights.map((trend, index) => (

                  <div
                    key={index}
                    className="flex items-start gap-2"
                  >

                    <span className="text-accent2 mt-0.5 text-sm">

                      •

                    </span>

                    <p className="text-gray-300 text-sm leading-relaxed">

                      {trend}

                    </p>

                  </div>

                ))}

              </div>

            </div>

          )}

          {/* Inventory Alerts */}

          {insights.inventoryAlerts?.length > 0 && (

            <div className="card">

              <div className="flex items-center gap-3 mb-4">

                <div className="w-8 h-8 rounded-lg bg-warn/10 flex items-center justify-center text-base">

                  ⚠️

                </div>

                <h3 className="font-semibold text-white text-sm">

                  Action Required

                </h3>

              </div>

              <div className="space-y-3">

                {insights.inventoryAlerts.map((alert, index) => (

                  <div
                    key={index}
                    className="bg-bg rounded-lg p-3"
                  >

                    <p className="text-warn text-sm font-medium mb-1">

                      {alert.product}

                    </p>

                    <p className="text-gray-400 text-xs leading-relaxed">

                      {alert.message}

                    </p>

                  </div>

                ))}

              </div>

            </div>

          )}

        </div>

      )}

    </div>

  );

}