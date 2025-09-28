import { React } from 'react';
import ProjectCard from './ProjectCard';
import ProjectData from './ProjectData';

const Projects = () => {
  return (
    <div className="content-section">
      <h2>🎨 Projects</h2>
      <div className="project-grid">
        {ProjectData.map((project) => {
          return (
            <div className="project-grid-item" key={project.urlParam}>
              <ProjectCard name={project.name} titleImage={project.titleImage} description={project.shortDescription} technologies={project.technologies} url={`/projects/${project.urlParam}`}/>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Projects;