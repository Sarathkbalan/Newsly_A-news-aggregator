import { useState, useEffect } from "react";
import axios from "axios";
import Customnewsgrid from "../components/Customnewsgrid"

const NewsFeed = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarkedArticles, setBookmarkedArticles] = useState(() => {
    const savedBookmarks = localStorage.getItem("bookmarkedArticles");
    return savedBookmarks ? JSON.parse(savedBookmarks) : [];
  });
  const [comments, setComments] = useState(() => {
    const savedComments = localStorage.getItem("comments");
    return savedComments ? JSON.parse(savedComments) : {};
  });

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("/api/news", {
          withCredentials: true,
        });

        console.log("API Response:", response.data);
        setNews(response.data);
      } catch (err) {
        setError("Failed to fetch news. Check backend or network.");
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    localStorage.setItem("bookmarkedArticles", JSON.stringify(bookmarkedArticles));
  }, [bookmarkedArticles]);

  useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(comments));
  }, [comments]);

  const toggleBookmark = (article) => {
    if (bookmarkedArticles.some((item) => item.url === article.url)) {
      // Remove article from bookmarks
      setBookmarkedArticles((prev) =>
        prev.filter((item) => item.url !== article.url)
      );
    } else {
      // Add article to bookmarks
      setBookmarkedArticles((prev) => [...prev, article]);
    }
  };

  const addComment = (articleUrl, comment) => {
    setComments((prev) => ({
      ...prev,
      [articleUrl]: [...(prev[articleUrl] || []), comment],
    }));
  };

  const deleteComment = (articleUrl, commentIndex) => {
    setComments((prev) => ({
      ...prev,
      [articleUrl]: prev[articleUrl].filter((_, index) => index !== commentIndex),
    }));
  };

  if (loading) return <p>Loading news...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
   
    <Customnewsgrid/>
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Latest News</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {news.map((article, index) => (
          <div
            key={index}
            className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">{article.title}</h2>
              <p className="text-gray-700 mb-4">{article.description}</p>

              {/* Comment Section */}
              <div className="mt-4">
                <h3 className="text-md font-semibold mb-2">Comments</h3>
                <div className="space-y-2">
                  {(comments[article.url] || []).map((comment, commentIndex) => (
                    <div key={commentIndex} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                      <p className="text-sm">{comment}</p>
                      <button
                        onClick={() => deleteComment(article.url, commentIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && e.target.value.trim()) {
                        addComment(article.url, e.target.value.trim());
                        e.target.value = "";
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded-l focus:outline-none"
                  />
                  <button
                    onClick={(e) => {
                      const input = e.target.previousElementSibling;
                      if (input.value.trim()) {
                        addComment(article.url, input.value.trim());
                        input.value = "";
                      }
                    }}
                    className="px-4 bg-blue-500 text-white rounded-r hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                >
                  Read more
                </a>
                <button
                  onClick={() => toggleBookmark(article)}
                  className="text-gray-500 hover:text-yellow-500 focus:outline-none"
                >
                  {bookmarkedArticles.some((item) => item.url === article.url) ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default NewsFeed;

