from bs4 import BeautifulSoup
import requests
from datetime import datetime, date, time, timedelta
import nltk
from nltk.corpus import wordnet
import time

from nltk.stem.snowball import SnowballStemmer
stemmer = SnowballStemmer("english")

base_url = "https://www.dawn.com/newspaper/"


# dawn archive
base_url = "https://www.dawn.com/"

def fetch_response(link):
    """
    Fetches response from the website
    :param: link of the target website
    :return: response date
    """
    #TODO add exception handling, throw exception
    try:
        page = requests.get(link, timeout=10).text
        soup = BeautifulSoup(page, 'html.parser')
        stories = soup.find_all("div",attrs={'class':['col-12']})
        stories = soup.find_all("div",attrs={'class':['mb-4']})
        # print(story_div)
        story_titles = []
        for soup in stories:
            story_titles = soup.find_all("h2", attrs={'class':['story__title','size-five']})
            # for s in story_titles:
                # print(s.text)

        # print(story_titles)
        return story_titles
    except requests.exceptions.Timeout:
        print("There was an error")
        return None

def read_news(link):
    """
    Fetches news and returns a dictionary of text tokens
    :param: link of the target website
    """
    title_list = []
    story_titles = fetch_response(link)
    if story_titles:
        for title in story_titles:
            tokens = nltk.word_tokenize(title.text)
            stem_tokens = []
            for tok in tokens:
                stem_tokens.append(stemmer.stem(tok))

            title_list.append(stem_tokens)

    return title_list

def main():
    # return
    start_date = "2018-01-08"
    pages = ["front-page","back-page","national"]
    pages = ["archive"]
    date_1 = datetime.strptime(start_date, "%Y-%m-%d")
    end_date = date_1 + timedelta(days=10)
    end_date = end_date.strftime("%Y-%m-%d")

    news_date = start_date
    counter = 0
    news_dictionary = {}
    while news_date != end_date and counter < 100:

        for each_page in pages:
            archive = base_url + each_page + "/" + str(news_date)
            print(archive)
            print("-------------------------------")
            time.sleep(5)
            list_of_titles = read_news(archive)

            news_count = 0
            # print(list_of_titles)
            for title in list_of_titles:
                print(title)
                if "rape" in title:
                    news_count += 1
                    news_dictionary[news_date] = news_count

            print(news_count)

            #
        time.sleep(3)
        date_1 = date_1 + timedelta(days=1)
        news_date = date_1.strftime("%Y-%m-%d")
        print(news_date)
        counter += 1

if __name__ == "__main__":
    main()
