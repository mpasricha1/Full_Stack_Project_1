# Full_Stack_Project_1
## Overview

http://mix-tape-maker.herokuapp.com/

## Presntation link: https://prezi.com/view/sf3qHDVasAEwsRhcaomZ/

## Technologies used:

* Skeleton Framework
* HTML
* CSS
* Javascript
* Ajax
* Heroku

The goal of this project was to create mix tape generator that returns a list of 10 randomly suggested songs based on the user input. 
The user enters a name of an artist or band and a mix tape or play-list is generated. A list of 10 randomly selected songs within the artist’s genre with the album cover, song name, album, and artist name. 
The user can name the playlist and it’s saved to a list of playlists. A media player allows the user to play songs within the playlist.
![image](https://user-images.githubusercontent.com/15931465/107121616-66c16980-6861-11eb-800c-a274a0a2c16b.png)
![image](https://user-images.githubusercontent.com/15931465/107121620-6f19a480-6861-11eb-81c6-f48106a592fa.png)

## APIs used:
### TasteDive
The Taste Dive API provided us with a list of simliar band names. The endpoint took one argument and that was a band name to search on. 

#### Endpoints Used
https://tastedive.com/api/similar?q=

### Deezer
The Deezer API provided most of the dynamic content on the page. The similiar band array was passed the first end point in order to gather all the albums for each band in the array. 
After this call, another deezer end point is used to get information on the album that was selected from each bands. Inside the results from the second endpoint is the third endpoint 
which contains the tracklist for each album. 

#### Endpoints Used
* https://api.deezer.com/search?q
* https://api.deezer.com/album/
* https://api.deezer.com/album/339679/tracks