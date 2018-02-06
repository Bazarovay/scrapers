from bs4 import BeautifulSoup
import requests
from datetime import datetime, date, time, timedelta
import nltk
from nltk.corpus import wordnet,stopwords
import time
import string
from nltk.stem.snowball import SnowballStemmer
import sys
from sys import argv

stemmer = SnowballStemmer("english")

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
        stories = soup.find("div",attrs={'class':['content']})
        stories = stories.find_all("div",attrs={'class':['no-gutters']})

        story_titles = []
        for soup in stories:
            story_titles = soup.find_all("h2", attrs={'class':['story__title']})

        return story_titles
    except requests.exceptions.Timeout:
        print("There was an error")
        return None


stoplist = stopwords.words('english')  + list(string.punctuation) + ["'","'s"]


def read_news(link):
    """
    Fetches news and returns a list of stemmed text tokens
    :param: link of the target website
    """
    title_list = []
    story_titles = fetch_response(link)
    if story_titles:
        for title in story_titles:
            tokens = nltk.word_tokenize(title.text)
            stem_tokens = []

            stem_tokens = [stemmer.stem(word) for word in tokens if word not in stoplist]
            title_list.append(stem_tokens)
    return title_list


def getopts(argv):
    """
    Code used from https://gist.github.com/dideler/2395703 
    """
    opts = {}  # Empty dictionary to store key-value pairs.
    while argv:  # While there are arguments left to parse...
        if argv[0][0] == '-':  # Found a "-name value" pair.
            opts[argv[0]] = argv[1]  # Add key and value to the dictionary.
        argv = argv[1:]  # Reduce the argument list by copying it starting from index 1.
    return opts

def main():
    # return
    myargs = getopts(argv)
    date_range = 70
    date = "2017-12-01"
    if '-d' in myargs:  # Example usage.
        date = myargs['-d']

    if '-r' in myargs:
        date_range = myargs['-r']

    start_date = date
    pages = ["archive"]
    date_1 = datetime.strptime(start_date, "%Y-%m-%d")
    end_date = date_1 + timedelta(days=date_range)
    end_date = end_date.strftime("%Y-%m-%d")

    news_date = start_date
    counter = 0
    news_dictionary = {}
    while news_date != end_date and counter < 100:

        popular_words_count = {}
        for each_page in pages:
            archive = base_url + each_page + "/" + str(news_date)
            print(archive)
            print("-------------------------------")
            list_of_titles = read_news(archive)

            news_count = 0

            top_ten_word_count = []

            for title in list_of_titles:

                for w in title:
                    if w not in popular_words_count:
                        popular_words_count[w] = 1
                    else:
                        popular_words_count[w] += 1


            relevant_words = ["rape","molest","sexual","abus"]
            # relevant_words = ["blasphemi","lynch"]
            rel_words_found = []
            for k in popular_words_count:
                if k in relevant_words:
                    rel_words_found.append((popular_words_count[k],k))

                top_ten_word_count.append((popular_words_count[k],k))

            top_ten_word_count.sort()

            print(rel_words_found)
            print("|||||||||||||||||||||||||||||||||||||||||||")
            print(top_ten_word_count[-25:])


            # print(popular_words_count)
            time.sleep(5)

        news_dictionary[news_date] = popular_words_count
            #
        time.sleep(3)
        date_1 = date_1 + timedelta(days=1)
        news_date = date_1.strftime("%Y-%m-%d")
        # print(news_dictionary)
        counter += 1

if __name__ == "__main__":
    main()
