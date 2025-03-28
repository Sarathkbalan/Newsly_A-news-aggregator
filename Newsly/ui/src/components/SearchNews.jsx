import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const SearchNews = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`/api/news?query=${query}`, { credentials: "include" });
        const data = await res.json();
        setArticles(data);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchNews();
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Search Results for <span className="text-green-600">"{query}"</span>
        </h1>

        {loading ? (
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg overflow-hidden transition transform hover:scale-105 hover:shadow-lg"
              >
                {article.urlToImage && (
                  <img src={article.urlToImage} alt={article.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900">{article.title}</h3>
                  <p className="text-gray-700 mt-2 line-clamp-3">{article.description || "No description available."}</p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-lg transition hover:bg-green-700"
                  >
                    Read More
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg">No articles found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchNews;

