import { React } from 'react';
import { Link } from "react-router-dom";


const Projects = (props) => {
  return (
    <div key={props.url}>
      <Link to={props.url}> 
        <div>
          <div key={props.titleImage} className="project-title-image">
            <img
              src={props.titleImage}
              alt={`${props.name}`}
              loading="lazy"
            />
          </div>
        </div>
        <p className="project-card-name">{props.name}</p> 
        <p>{props.description}</p>
        <p className="project-technology">
          {props.technologies}
        </p>
      </Link>
    </div>     
  )
}

export default Projects;