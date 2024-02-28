import { getNews } from "@/utils/news";
import { extractTopicFromTitles } from "@/utils/NewsClassifier";

export const NewsHeadlinesBox = async () => {
  const news = await getNews();
  const topics = await extractTopicFromTitles(
    news.map((article) => article.webTitle),
  );

  //   const topics = await extractTopicFromTitles(
  //     news.map((article) => article.webTitle),
  //   );

  return (
    <div>
      <h2>News</h2>
      <ul>
        {news.map((article) => (
          <li key={article.id}>
            <span className="font-bold">{article.sectionId}</span>{" "}
            {article.webTitle}
          </li>
        ))}
      </ul>
      <h2>Topics</h2>
      <ul className="m-4 rounded-lg bg-white p-8">
        {topics
          .toSorted((a, b) => b.classification - a.classification)
          .map((topic, index) => {
            const correspondingNews = news.find(
              (article) => article.webTitle === topic.title,
            );
            if (correspondingNews) {
              return (
                <li key={index}>
                  <a
                    href={correspondingNews.webUrl}
                  >{`${topic.topic}(${topic.classification})`}</a>
                </li>
              );
            }
            return (
              <li key={index}>
                <span className="font-semibold">Original not found!</span>
                {topic.topic}
              </li>
            );
          })}
        {/* {topics.map((topic, index) => (
          <li key={index}> {topic}</li>
        ))} */}
      </ul>
    </div>
  );
};

export default NewsHeadlinesBox;
