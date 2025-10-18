import '../styles/skills.css';

const Skills = () => {
  return (
    <div>
      <div className="content-section">
        <h2>💻 Skills</h2>
        <div className="content-section-box">
          <div className="skills-container">
            <div>
              <p className="skills-category">Languages</p>
              <p className="skills-list">JavaScript, Ruby, HTML, CSS, SQL</p>
            </div>
            <div>
              <p className="skills-category">Frameworks & Libraries</p>
              <p className="skills-list"><span className="skills-subcategory">Front-End: </span>React, Redux, MobX, Quill ∙ <span className="skills-subcategory">Back-End: </span>Ruby on Rails</p>
            </div>
            <div>
              <p className="skills-category">Databases & ORMs</p>
              <p className="skills-list">PostgreSQL, SQLite3, ActiveRecord</p>
            </div>
            <div>
              <p className="skills-category">Testing & Development</p>
              <p className="skills-list">Jest, Playwright, RSpec, Git, GitHub, Jenkins, Heroku</p>
            </div>
            <div>
              <p className="skills-category">Methodologies</p>
              <p className="skills-list">Object-Oriented Programming (OOP), MVC (Model-View-Controller), MVP (Model-View-Presenter)</p>
            </div>
            <div>
              <p className="skills-category">Editors</p>
              <p className="skills-list">VSCode, Atom, Cursor</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Skills;