import React from 'react';
import { useParams } from 'react-router-dom';
import ProjectData from './ProjectData';

const Project = () => {
  const { projectUrl } = useParams();
  const project = ProjectData.find((project) => project.urlParam === projectUrl);

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div>
      <h1 className="project-title-heading">{project.name}</h1>
      <p className="project-github-link">View on <a target="_blank" rel="noopener noreferrer" href={project.githubUrl}>Github</a></p>
      <div>
        <div key={project.titleImage} className="project-title-image">
          <img
            src={project.titleImage}
            alt={`${project.name}`}
            loading="lazy"
          />
        </div>
      </div>
      <br />
      {project.longDescription && (
        <div
          dangerouslySetInnerHTML={{ __html: project.longDescription }}
        />
      )}
      <br />
      <br />
      {project.screenshots?.length > 0 && (
        <div>
          <div className="project-screenshots-grid">
            {project.screenshots.map((screenshotUrl, index) => (
              <div key={screenshotUrl} className="project-screenshot-item">
                <img
                  src={screenshotUrl}
                  alt={`${project.title} Screenshot ${index + 1}`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="video-outer-wrapper">
        <div className="video-container">
          <iframe
            src={`https://player.vimeo.com/video/${project.embedId}?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479`}
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            title={project.videoTitle}>
          </iframe>
        </div>
        <script src="https://player.vimeo.com/api/player.js"></script>
      </div> 
    </div>
  );
}

export default Project;