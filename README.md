## ball-blast-ai

A game where a player has to hit balls falling from the sky by using trusty cannon
(Gun). Player has to stop the balls from falling before they hit the cannon. Once the strength of a ball
reaches to 0 from an initial level it again replicates itself with half the amount of initial strength and
it goes that way. It raises the difficult level each time the balls count drops to zero. 

### Example Demo
 

<a target = "_blank" href="https://youtu.be/TKIViQSsMEg?t=12s"> 
 <img src="https://user-images.githubusercontent.com/49583145/113905363-b33d0d00-97f0-11eb-8c5f-719cb79330b1.png" width="1000"/>
</a>

</br>

[Link](https://github.com/Asto7/DTask2) for Game Alone without visual controls feature.

<b>Visual Control Feature</b>: User can train the canon movements(like move left, move right, stay still) on the browser itself with the help of mobilenet model, knn algorithm to classify and webcam to capture images for training the model.

### Setup
```
npm install
```

### Starting server
```
npm start
```

#### How to Train the Model In Browser
- Long Press On the Class Label Button for which you want to train the model, meanwhile webcam will capture the images(Current position) and train it under that class label :)
- Example : [Link](https://user-images.githubusercontent.com/49583145/110783465-7da71180-828e-11eb-967d-66375e890c7c.mp4)
 
#### TODO
1. Make it Responsive.
2. Add touch controls for mobile devices.
3. Generate random balls.
4. Better UI.
