---
layout: post
title:      "How Katie Couric Inspired My React Redux Project"
date:       2020-11-01 11:34:47 -0500
permalink:  how_katie_couric_inspired_my_react_redux_project
---


The time had finally come, after months (and months) of learning and coding, to build my final project. This was my chance to show off everything I had learned up to this point, all the way from the beginning days of Ruby to the final days of React and Redux. And what a journey it has been! The only question that remained: What could I possibly create to showcase my newfound talents? As usual, Katie Couric had the answer.

A little context: While quarantining I stumbled across the 2014 documentary Fed Up, a deep-dive into the American Food Industry and the negative effects it may or may not be having on our health. It was eye-opening and, to be honest, quite alarming. Long-story short, we have a bit of a problem here in America with our diets, and I was no exception. At the end of the documentary Ms. Couric challenged me to go 10 days without added sugar. That seemed unreasonable, so instead I decided to attempt one week without any processed foods. Although seven days without Cheez-Its was rather grueling, the week passed, and I surprisingly felt pretty good. I decided to try for week two. Essentially this catapulted me into a health documentary rabbit hole that <strike>scared</strike> inspired me to start eating cleaner.

<iframe src="https://giphy.com/embed/RKRqGJinGNjIzNRy4P" width="480" height="247" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/ron-swanson-so-what-whats-your-point-RKRqGJinGNjIzNRy4P">via GIPHY</a></p>

At this point, I’m sure you’re wondering what any of this could possibly have to do with my final project. As I started this whole journey I thought it would be a good idea to track my nutrition. There are PLENTY of apps out there that allow you to do so, but I couldn’t find one that had everything I wanted. A comprehensive database of food, pretty visuals tracking my nutrient intake, exercise summaries for the week, recommendations of what to eat based on what I’ve already consumed for the day, and the list goes on (what can I say, I have high expectations). I could find at least one, maybe two of these features in any given app, but I couldn’t find them all in one place. Luckily, Flatiron equipped me with the skills to change that. Disclaimer: I haven’t actually changed that yet because that’s a LOT of stuff, but for now I have built an app that allows you to track your food, nutrients, and exercises for the day. Not bad!

As always, it all started with an outline to help keep me organized and plan how I was going to set up the backend:

<img src="https://user-images.githubusercontent.com/33204849/97806051-b15e9480-1c27-11eb-8c1d-7f3e968bd539.jpg" width="800" height="831">

I also spent a bit of time planning my frontend so I had a clear idea of what I wanted my user experience to be:

<img src="https://user-images.githubusercontent.com/33204849/97806170-48c3e780-1c28-11eb-8a9e-b29b6c615aa6.jpg" width="800" height="745">

A couple of rails g resource commands and one create-react-app command later, and I was on my way.

### Props to React
I was excited to dive deep into building my first React App, taking advantage of all of its great features, performance and components among them. Since I was using a new framework, and really because it's best practice, I knew organization would be key to keeping track of my code. Modeling my project after a few select Flatiron labs, I came up with a basic file structure, starting with a container component for each model on my backend. I knew that I would be connecting these components to my Redux store to get any necessary information to pass down to their respective children. For example, I created an ExercisesContainer, within which I rendered three child components in the appropriate routes: Exercises, ExerciseInput, and ExerciseUpdate. ExerciseInput and ExerciseUpdate would be responsible for rendering the "new" and "update" forms for a user's exercise. Exercises.js was used rendered each individual exercise as an ExerciseCard component. I used this basic structure for each model in my application to stay consistent, and as a result I'm able to locate all of my code with ease.

By making use of `mapStateToProps()` and `mapDispatchToProps()` I could get all of the necessary information from the Redux store to pass to these child components.

```
//src/containers/ExercisesContainer.js

import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import { createExercise } from '../actions/exercises';
import { updateExercise } from '../actions/exercises';
import { deleteExercise } from '../actions/exercises';

import Exercises from '../components/exercises/Exercises';
import ExerciseInput from '../components/exercises/ExerciseInput';
import ExerciseUpdate from '../components/exercises/ExerciseUpdate';

class ExercisesContainer extends Component {

render() {
  return (
    <div>
      <Switch>
        <Route exact path={`${this.props.match.url}/new`} render={props =>
          <ExerciseInput currentUser={this.props.currentUser} createExercise={this.props.createExercise} date={this.props.date} history={this.props.history} />
        } />

        <Route exact path={this.props.match.url} render={props =>
          <Exercises exercises={this.props.exercises} deleteExercise={this.props.deleteExercise} date={this.props.date} caloriesBurned={this.props.caloriesBurned} {...props} />
        } />

        <Route exact path={`${this.props.match.url}/:exerciseId/edit`} render={props => {
          const exercise = this.props.exercises.find(exercise => exercise.id === props.match.params.exerciseId)
          if (!!exercise) {
            return (
              <ExerciseUpdate exercise={exercise} currentUser={this.props.currentUser} updateExercise={this.props.updateExercise} date={this.props.date} {...props} />
            )
          }
        }} />
      </Switch>
    </div>
  );
};
};

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  exercises: state.exercises
});

const mapDispatchToProps = {
  createExercise,
  updateExercise,
  deleteExercise
};

export default connect(mapStateToProps, mapDispatchToProps)(ExercisesContainer);
```

Above, connect is invoked and returns a function that supplies ExercisesContainer with props that are included as state as described in `mapStateToProps()` and actions as described in `mapDispatchToProps()`. This function takes ExercisesContainer as an argument, so I am not just exporting ExercisesContainer as I've defined it, but a bulked up version with state and actions from the Redux store. Which is a perfect segue into the next section.


### Utilizing the Redux Store
With Redux being another requirement, I needed to figure out how to make use of the Redux store. I knew this would require using reducers and action creators, but it was admittedly a daunting task to take on having never done it before. I started with creating an all-encompassing store.js file. This is where I would import all of my reducers, combine them into one reducer, and use the createStore function: `createStore(reducer, composeEnhancer(applyMiddleware(thunk)))`. I could then import this into my index.js file and pass store as prop to Provider, giving me access to the store anywhere within my app, with the proper code.

```
//src/index.js

ReactDOM.render(
  <Provider store={ store } >
    <Router>
     <App />
    </Router>
  </Provider>, document.getElementById('root')
);
```

Okay, now that I had that all set up, I had to actually create my reducers and action creators that would be imported into store.js. Just like with my containers, I figured it would make sense to have separate reducers and action creators to correspond with my models on the backend. With the help of one of Howard’s instructional videos, I followed three key steps:
1. Build reducer
2. Add to store
3. Build action creator

Using Exercises as an example, there were a few things I wanted to accomplish overall: I wanted to set a user’s exercises on login and clear a user’s exercises on logout, in addition to allowing a user to add, update, and delete exercises from the database. That's a lot to think about all at once, so I took it one step at a time, starting with building a reducer:

```
//src/reducers/exercises.js

export default (state = [], action) => {
  switch (action.type) {
    case "SET_EXERCISES":
      return action.exercises
    case "ADD_EXERCISE":
      return state.concat(action.exercise)
    case "UPDATE_EXERCISE":
      return (state.map(exercise => {
        if (exercise.id === action.exercise.id ) {
          return action.exercise
        } else {
          return exercise
        }
      }))
    case "DELETE_EXERCISE":
      return state.filter(exercise => exercise.id !== action.exerciseId)
    case "CLEAR_EXERCISES":
      return []
    default:
      return state
  }
}
```

With my reducer in place, next came step two: add it to the store:

```
//src/store.js

import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import exercises from './reducers/exercises';

const reducer = combineReducers({
  exercises,
  // additional reducers would be listed here after importing above
});

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, composeEnhancer(applyMiddleware(thunk)));

export default store;
```

Then came the slightly challenging part — building the action creators. Again, with Howard’s help, I decided to break these up into synchronous and asynchronous actions (#organization). My synchronous actions would correspond with the actions listed in my reducer:

```
//src/actions/exercises.js

export const setExercises = exercises => {
  return {
    type: "SET_EXERCISES",
    exercises
  }
}

export const clearExercises = () => {
  return {
    type: "CLEAR_EXERCISES"
  }
}

export const addExercise = exercise => {
  return {
    type: "ADD_EXERCISE",
    exercise
  }
}

export const updateExerciseSuccess = exercise => {
  return {
    type: "UPDATE_EXERCISE",
    exercise
  }
}

export const deleteExerciseSuccess = exerciseId => {
  return {
    type: "DELETE_EXERCISE",
    exerciseId
  }
}
```

Okay, that actually wasn't too bad. *Then* came the slightly challenging part — writing the asynchronous action creators that would need to connect to the backend API. For our purposes they're all relatively similar, so we’ll focus on `createExercise`. This is called in the ExerciseInput component when a user clicks on “Submit”:

```
//src/components/exercises/ExerciseInput.js

handleSubmit = event => {
  event.preventDefault();
  this.props.createExercise(this.state, this.props.date, this.props.currentUser, this.props.history)
};
```

Remember, the action creator is passed as a prop to ExerciseInput from ExercisesContainer, which has access to it through `mapDispatchToProps()`. Okay, back to the action creator itself. First, we need to take the information the user inputted and create an exercise object. The action creator will return a function (thank you, thunk!) that takes dispatch as an argument. Inside that function we can dispatch multiple actions and return our fetch request. And since we’re so familiar with fetch requests at this point, the rest is smooth sailing:

```
//src/actions/exercises.js

export const createExercise = (exerciseData, date, currentUser, history) => {
  const exercise = {
    user_id: currentUser.id,
    date: date,
    category: exerciseData.category,
    name: exerciseData.name,
    duration_in_minutes: exerciseData.duration_in_minutes,
    calories_burned: exerciseData.calories_burned
  }

  return dispatch => {
    return fetch(baseUrl, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(exercise)
    })
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          console.log(json.error)
        } else {
          dispatch(addExercise(json.data))
          history.push("/exercises")
        }
      })
      .catch(console.log())
  }
}
```

So I pretty much could just follow that pattern for all the other models and I would have a fully functioning React Redux app, right?

<iframe src="https://giphy.com/embed/gIf19UHBI6jmEnR1aJ" width="480" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/cbc-schitts-creek-gIf19UHBI6jmEnR1aJ">via GIPHY</a></p>


### Theres a Package For That
Let's take a break from all of the requirements and talk about some of the fun features I was able to add (not that the requirements aren't fun...). A couple of times I found myself wanting to include a feature, but I had no idea where to begin. If there’s one thing I’ve learned, it’s that there is quite a bit of open source code out there that can really help bring your project to the next level. With a bit of Googling and a few YouTube tutorials, I was able to add some really cool elements to my frontend. For one, I wanted the user to be able to select a date to and see all information (nutrition, meals, exercises, etc.) for that date, past, present, or future. React DatePicker to the rescue. This is a great package that pretty much does exactly what I wanted it to do. 

<img width="255" alt="date-picker" src="https://user-images.githubusercontent.com/33204849/97806205-76a92c00-1c28-11eb-9b66-93188ac2b761.png">

Another idea I had was to display a user’s macronutrient information in doughnut chart form to give them a clear visual of where they stood for the day. This proved to be a little trickier. It may be that my Google search terms weren’t as clear, or that I wasn’t sure what to look for, but I spent quite a bit of time on this. First creating a static pie chart, but then realizing I needed it to be dynamic and update as the database information updated. Finally, I stumbled across Chart.js, which again, pretty much does exactly what I was looking for. In this instance I thought I would be able to create the chart myself, but once I found Chart.js I knew that I was better off using that and moving on. Not only is my code much cleaner than it would be if I had implemented something on my own, the charts have features I never would have been able to add (animation, hover features, etc.). 

<img width="410" alt="macronutrients-chart" src="https://user-images.githubusercontent.com/33204849/97806224-917ba080-1c28-11eb-8559-19ae57b671bd.png">

Throughout this project and course I've learned that if there is a feature I’ve either seen somewhere before or am having a heck of a time implementing, there is absolutely no shame in seeing what already exists that I might be able to make use of. In the end it just frees up my time to focus on something else.


### Is that everything?
Heck no! It never is though. I have so many more ideas of features to add. Like all the things on my fitness app wishlist, for one. I'd also like to implement an email feature and send a weekly email recap to users, offering fitness/health tips and letting them know if they met their goals. Speaking of goals, I want to add a feature that allows a user to set their own goals. I also think it would be great to add accessibility features. I have a few sprinkled throughout, but not anywhere near what I should have. And I would love to add tests. Test-driven development is so important and useful and I have yet to build a project with a comprehensive test suite. In a nutshell, there’s much left to do. Even though I’m “done” with my final project, this student’s journey is far from over. Before I dive into any of that, I’m going to take a quick break for some Cheez-Its.

What? I’ve earned it.

<iframe src="https://giphy.com/embed/xUOxfaABfkwPSJ5M6A" width="480" height="270" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/thegoodplace-season-1-xUOxfaABfkwPSJ5M6A">via GIPHY</a></p>
