import urllib.request
import re
import urllib.parse
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def get_youtube_video(query):
    query = urllib.parse.quote(query)
    url = f"https://www.youtube.com/results?search_query={query}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        html = urllib.request.urlopen(req, context=ctx).read().decode('utf-8')
        video_ids = re.findall(r'"videoId":"([^"]{11})"', html)
        if video_ids:
            seen = set()
            return [x for x in video_ids if not (x in seen or seen.add(x))]
    except Exception as e:
        print(f"Error: {e}")
    return []

print(get_youtube_video("REST API Knowledge beginner"))
