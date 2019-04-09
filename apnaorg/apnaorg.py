"""
Download books from apnaorg
"""
from sys import argv
import requests
import shutil


def grab_images(link):
    print(link)
    response = requests.get(link, stream=True)
    with open('img.gif', 'wb') as out_file:
        shutil.copyfileobj(response.raw, out_file)
    del response


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
    options = getopts(argv)
    link = None
    if "-l" not in options:
        print("Please add a link")
        return
    else:
        link = options['-l']

    # print(options)
    grab_images(link)


from bs4 import BeautifulSoup


if __name__ == "__main__":
    # main()
    link = "http://apnaorg.com/books/shahmukhi/punjabi-adab/book.php?fldr=book"
    try:
        page = requests.get(link, timeout=10).text
        soup = BeautifulSoup(page, 'html.parser')
        # print(soup)
        # print(soup)
        scripts = soup.find_all('script')
        rel_scripts = scripts[1]
        import re
        menus = re.search(r"pages", rel_scripts).group(1)

        print(menus)
        # return story_titles
    except requests.exceptions.Timeout:
        print("There was an error")
