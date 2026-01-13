import React, { useState, useEffect } from "react";
import { Chart as ChartJS } from "chart.js/auto";

const App = () => {
  const [longUrl, setLongUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentLinks, setRecentLinks] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [statsData, setStatsData] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // Set to true for dark mode only
  const [osChartData, setOsChartData] = useState(null);
  const [countryChartData, setCountryChartData] = useState(null);
  const [loadingCharts, setLoadingCharts] = useState({
    os: false,
    country: false,
  });

  // Load recent links on component mount
  useEffect(() => {
    fetchRecentLinks();
  }, []);

  // Render charts when chart data changes
  useEffect(() => {
    if (osChartData) {
      // Destroy existing chart if it exists
      const existingOsChart = ChartJS.getChart("osChart");
      if (existingOsChart) {
        existingOsChart.destroy();
      }

      const ctx = document.getElementById("osChart")?.getContext("2d");
      if (ctx) {
        new ChartJS(ctx, {
          type: "doughnut",
          data: {
            labels: osChartData.labels,
            datasets: [
              {
                data: osChartData.data,
                backgroundColor: [
                  "#3B82F6", // blue-500
                  "#EF4444", // red-500
                  "#10B981", // emerald-500
                  "#F59E0B", // amber-500
                  "#8B5CF6", // violet-500
                  "#EC4899", // pink-500
                  "#6EE7B7", // emerald-300
                  "#93C5FD", // blue-300
                  "#F87171", // red-300
                  "#A78BFA", // violet-300
                ],
                borderWidth: 0,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  color: "#D1D5DB", // gray-300
                  font: {
                    size: 12,
                  },
                },
              },
              tooltip: {
                backgroundColor: "#374151", // gray-700
                titleColor: "#F9FAFB", // gray-50
                bodyColor: "#D1D5DB", // gray-300
                borderColor: "#4B5563", // gray-600
                borderWidth: 1,
              },
            },
          },
        });
      }
    }
  }, [osChartData]);

  useEffect(() => {
    if (countryChartData) {
      // Destroy existing chart if it exists
      const existingCountryChart = ChartJS.getChart("countryChart");
      if (existingCountryChart) {
        existingCountryChart.destroy();
      }

      const ctx = document.getElementById("countryChart")?.getContext("2d");
      if (ctx) {
        new ChartJS(ctx, {
          type: "doughnut",
          data: {
            labels: countryChartData.labels,
            datasets: [
              {
                data: countryChartData.data,
                backgroundColor: [
                  "#3B82F6", // blue-500
                  "#EF4444", // red-500
                  "#10B981", // emerald-500
                  "#F59E0B", // amber-500
                  "#8B5CF6", // violet-500
                  "#EC4899", // pink-500
                  "#6EE7B7", // emerald-300
                  "#93C5FD", // blue-300
                  "#F87171", // red-300
                  "#A78BFA", // violet-300
                ],
                borderWidth: 0,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  color: "#D1D5DB", // gray-300
                  font: {
                    size: 12,
                  },
                },
              },
              tooltip: {
                backgroundColor: "#374151", // gray-700
                titleColor: "#F9FAFB", // gray-50
                bodyColor: "#D1D5DB", // gray-300
                borderColor: "#4B5563", // gray-600
                borderWidth: 1,
              },
            },
          },
        });
      }
    }
  }, [countryChartData]);

  const fetchRecentLinks = async () => {
    try {
      const response = await fetch("/api/recent");
      if (response.ok) {
        const data = await response.json();
        setRecentLinks(data);
      }
    } catch (err) {
      console.error("Error fetching recent links:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setShortUrl("");

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          longUrl,
          customSlug: customSlug.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShortUrl(data.shortUrl);
        // Add to recent links
        setRecentLinks((prev) => [
          { ...data, createdAt: new Date().toISOString() },
          ...prev.slice(0, 9),
        ]);
        setLongUrl("");
        setCustomSlug("");
      } else {
        setError(data.error || "An error occurred");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const closeStatsModal = () => {
    setShowStats(false);
    setStatsData(null);
    setOsChartData(null);
    setCountryChartData(null);
  };

  const fetchChartStats = async (slug) => {
    // Fetch OS distribution
    setLoadingCharts((prev) => ({ ...prev, os: true }));
    try {
      const osResponse = await fetch(`/api/stats/${slug}/os`);
      const osData = await osResponse.json();

      if (osResponse.ok) {
        setOsChartData(osData);
      }
    } catch (err) {
      console.error("Error fetching OS stats:", err);
    } finally {
      setLoadingCharts((prev) => ({ ...prev, os: false }));
    }

    // Fetch country distribution
    setLoadingCharts((prev) => ({ ...prev, country: true }));
    try {
      const countryResponse = await fetch(`/api/stats/${slug}/country`);
      const countryData = await countryResponse.json();

      if (countryResponse.ok) {
        setCountryChartData(countryData);
      }
    } catch (err) {
      console.error("Error fetching country stats:", err);
    } finally {
      setLoadingCharts((prev) => ({ ...prev, country: false }));
    }
  };

  const fetchStats = async (slug) => {
    setLoadingStats(true);
    try {
      const response = await fetch(`/api/stats/${slug}`);
      const data = await response.json();

      if (response.ok) {
        setStatsData(data);
        setShowStats(true);
        // Fetch chart data after showing the modal
        fetchChartStats(slug);
      } else {
        setError(data.error || "Failed to fetch stats");
      }
    } catch (err) {
      setError("Network error occurred while fetching stats");
    } finally {
      setLoadingStats(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 shadow-xl shadow-gray-900/30">
        <div className="max-w-[800px] mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            URL Shortener
          </h1>
        </div>
      </header>

      <main>
        <div className="max-w-[800px] mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="longUrl"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Long URL
                  </label>
                  <input
                    type="url"
                    id="longUrl"
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                    placeholder="https://example.com/very/long/url"
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="customSlug"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Custom Alias (Optional)
                  </label>
                  <input
                    type="text"
                    id="customSlug"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    placeholder="my-custom-slug"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {loading ? "Shortening..." : "Shorten URL"}
                </button>
              </form>

              {error && (
                <div className="mt-4 p-4 bg-red-900/30 text-red-200 rounded-lg border border-red-800/50">
                  {error}
                </div>
              )}

              {shortUrl && (
                <div className="mt-6 p-4 bg-emerald-900/20 rounded-lg border border-emerald-800/30">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-emerald-300 truncate">
                        Shortened URL:
                      </p>
                      <p className="text-sm text-emerald-200 truncate">
                        {shortUrl}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(shortUrl, -1)}
                      className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-emerald-100 bg-emerald-700/50 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
                    >
                      {copiedIndex === -1 ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Links Section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                Recent Links
              </h2>
              {recentLinks.length > 0 ? (
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl max-h-[450px] overflow-y-auto shadow-xl">
                  <ul className="divide-y divide-gray-700">
                    {recentLinks.map((link, index) => (
                      <li key={link.slug}>
                        <div className="px-4 py-4 sm:px-6 hover:bg-gray-700/30 transition-colors duration-150">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-blue-400 truncate hover:text-blue-300 transition-colors duration-150">
                              <a
                                href={`/${link.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                              >
                                {link.shortUrl}
                              </a>
                            </div>
                            <div className="ml-2 flex-shrink-0 flex">
                              <span className="inline-flex items-center text-xs font-medium text-gray-400 bg-gray-700/50 px-2 py-1 rounded-full">
                                {link.clicks} clicks
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <div className="mr-6 text-sm text-gray-400 truncate">
                                Original: {link.longUrl}
                              </div>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-400 sm:mt-0">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() =>
                                    copyToClipboard(link.shortUrl, index)
                                  }
                                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-blue-100 bg-blue-700/50 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                >
                                  {copiedIndex === index ? "Copied!" : "Copy"}
                                </button>
                                <button
                                  onClick={() => fetchStats(link.slug)}
                                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-purple-100 bg-purple-700/50 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                                >
                                  Stats
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No recent links yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800/50 backdrop-blur-sm border-t border-gray-700/50 mt-12">
        <div className="max-w-[800px] mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-400">
            URL Shortener Application &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>

      {/* Stats Modal */}
      {showStats && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-4xl w-full max-h-[400px] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">
                  Link Statistics
                </h3>
                <button
                  onClick={closeStatsModal}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  ✕
                </button>
              </div>

              {loadingStats ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  <p className="mt-2 text-gray-400">Loading stats...</p>
                </div>
              ) : statsData ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                      <p className="text-sm text-gray-400">Total Clicks</p>
                      <p className="text-2xl font-bold text-white">
                        {statsData.clicks}
                      </p>
                    </div>
                    <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                      <p className="text-sm text-gray-400">Created</p>
                      <p className="text-sm text-gray-300">
                        {statsData.createdAt
                          ? new Date(statsData.createdAt).toLocaleString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-white mb-2">
                      Click Details
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-700/50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                              Time
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                              Device
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                              OS
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                              Browser
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                              IP
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                          {statsData.clickDetails &&
                          statsData.clickDetails.length > 0 ? (
                            statsData.clickDetails.map((click, idx) => (
                              <tr key={idx}>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-300">
                                  {click.timestamp
                                    ? new Date(click.timestamp).toLocaleString()
                                    : "N/A"}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-300">
                                  {click.deviceInfo
                                    ? click.deviceInfo.deviceType
                                    : "N/A"}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-300">
                                  {click.deviceInfo
                                    ? click.deviceInfo.os
                                    : "N/A"}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-300">
                                  {click.deviceInfo
                                    ? click.deviceInfo.browser
                                    : "N/A"}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-300">
                                  {click.ip || "N/A"}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="5"
                                className="px-3 py-2 text-center text-sm text-gray-400"
                              >
                                No click data available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Charts Section */}
                  <div className="mt-6 space-y-6">
                    {osChartData && (
                      <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                        <h4 className="text-lg font-medium text-white mb-3">
                          OS Distribution
                        </h4>
                        <div className="flex justify-center">
                          <canvas
                            id="osChart"
                            width="200"
                            height="200"
                          ></canvas>
                        </div>
                      </div>
                    )}

                    {countryChartData && (
                      <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                        <h4 className="text-lg font-medium text-white mb-3">
                          Country Distribution
                        </h4>
                        <div className="flex justify-center">
                          <canvas
                            id="countryChart"
                            width="200"
                            height="200"
                          ></canvas>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">No stats data available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
