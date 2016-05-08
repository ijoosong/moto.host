# Moto.host
_Your mobile tour host_

Built for the [TechCrunch Disrupt 2016 Hackathon](http://techcrunch.com/event-info/disrupt-ny-2016/disrupt-ny-hackathon-2016/).

**Pitch**

In the era of IoT, it's become a lot easier to learn about a city's history, architecture, and culture.  Now with **moto.host**, your new mobile tour host, it's become even easier.  Take a picture and with the power of [Clarifai](clarifai.com), [NYC Open Data](https://nycopendata.socrata.com/), geolocation, [IBM Watson](http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/text-to-speech.html), and your own mobile device, you can quickly get detailed information about what you're seeing effortlessly.  Let your mobile phone be your host as you tour your city and get to know it better than ever before.

**User Flow:**

Open the app, camera shows up, you take a picture, you get information from that picture/location.

**App Flow:**

React Native Android App, gets information from captured photo, sends to Clarifai, based on tags get information from NYC open data.  Info is pushed to screen, then text-to-speech is pushed to headphones.

**NYC Open Data references:**
- [Landmarks](https://data.cityofnewyork.us/api/views/rb9s-d3m8/rows.json?accessType=DOWNLOAD)
- [Directory of Eateries](https://data.cityofnewyork.us/Recreation/Directory-of-Eateries/8792-ebcp)

**Built by:**
- [Cassidy Williams](http://cassidoo.co)
- [Joseph Song](http://github.com/ijoosong)
- [Timotius Sitorus](https://timsitorus.com/)
