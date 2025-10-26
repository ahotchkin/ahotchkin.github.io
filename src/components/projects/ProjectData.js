import reactFitnessTitleImg from '../../images/react_fitness_title.png';
import reactFitnessMealDiaryImg from '../../images/react_fitness_meal_diary.png';
import reactFitnessFoodDatabaseImg from '../../images/react_fitness_food_database.png';
import hpTriviaTitleImg from '../../images/hp_trivia_title.png';
import hpTriviaWelcomeImg from '../../images/hp_trivia_welcome.png';
import hpTriviaRoundImg from '../../images/hp_trivia_round.png';
import movieReviewsTitleImg from '../../images/movie_reviews_title.png';
import movieReviewsReviewsImg from '../../images/movie_reviews_reviews.png';
import movieReviewsAddReviewImg from '../../images/movie_reviews_add_review.png';

const ProjectData = [
  {
    urlParam: 'react-fitness',
    name: 'React Fitness',
    shortDescription:
      'Track your daily nutrition and exercise and achieve your fitness goals',
    longDescription:
      "Ever wondered if you're getting enough protein in a day? Or carbs? Or if that workout you did was even worth it? If you've ever felt like your wellness routine is a guessing game, you're not alone. The truth is, it's almost impossible to know without a little help.<br /><br />Enter React Fitness — your co-pilot in the quest for a healthier you. It's not just a tracker; it's a tool that helps you uncover the hidden patterns in your daily nutrition and exercise. Because living a healthier life shouldn't be a mystery, it should be an adventure.",
    technologies: 'JavaScript ∙ React ∙ Redux ∙ Ruby\u00A0on\u00A0Rails',
    titleImage: reactFitnessTitleImg,
    screenshots: [reactFitnessMealDiaryImg, reactFitnessFoodDatabaseImg],
    embedId: '1110720312',
    videoTitle: 'React Fitness Demo',
    githubUrl: 'https://github.com/ahotchkin/react-fitness-frontend',
    link: '',
  },
  {
    urlParam: 'harry-potter-trivia',
    name: 'Harry Potter Trivia',
    shortDescription:
      'Test your Harry Potter knowledge and save the Wizarding World in this trivia game',
    longDescription:
      "Have you spent the better part of the last two decades immersed in the Wizarding World of Harry Potter? Do you dream of having an owl mail delivery service? Are you still waiting for your Hogwarts Letter to arrive? Then this trivia game is for you. <br /><br />Create a username, select your house, and begin your adventure. But be careful, if you aren't as knowledgeable as you think, Voldemort will take control of the Wizarding World as we know it. <br /><br />Each round you'll have 3 chances to answer at least 5 of 7 questions correctly. Should you successfully get through all 7 rounds, you will save the Wizarding World. Should you fail, Voldemort will prevail and we'll be stuck in some weird alternate Cursed Child reality. Good luck!",
    technologies: 'JavaScript ∙ Ruby\u00A0on\u00A0Rails ∙ PostgreSQL',
    titleImage: hpTriviaTitleImg,
    screenshots: [hpTriviaWelcomeImg, hpTriviaRoundImg],
    embedId: '1110732322',
    videoTitle: 'Harry Potter Trivia Demo',
    githubUrl: 'https://github.com/ahotchkin/js-harry-potter-trivia',
    link: '',
  },
  {
    urlParam: 'rails-movie-reviews',
    name: 'Rails Movie Reviews',
    shortDescription:
      'Review your favorite (and least favorite) movies alongside other movie buffs',
    longDescription:
      'Are you a certified cinephile? Have you ever had a brilliant "hot take" on a classic film or the latest blockbuster? Then Rails Movie Reviews is your new home — a community where film lovers and critics unite.<br /><br />Dive into a sea of opinions, read reviews from fellow film buffs, and share your own thoughts on your favorite films. And for those with a truly dedicated eye for cinema, special access allows you to add and update movies for everyone to review.',
    technologies: 'Ruby\u00A0on\u00A0Rails ∙ Sqlite3 ∙ Bootstrap',
    titleImage: movieReviewsTitleImg,
    screenshots: [movieReviewsReviewsImg, movieReviewsAddReviewImg],
    embedId: '1110732122',
    videoTitle: 'Rails Movie Reviews Demo',
    githubUrl: 'https://github.com/ahotchkin/rails-movie-reviews',
    link: '',
  },
];

export default ProjectData;
