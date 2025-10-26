import About from './About';
import Skills from './Skills';
import Projects from './projects/Projects';
import BlogPreview from './blog/BlogPreview';

const Home = () => {
  return (
    <div>
      <section id="about">
        <About />
      </section>
      <section id="skills">
        <Skills />
      </section>
      <section id="projects">
        <Projects />
      </section>
      <section id="blog-preview">
        <BlogPreview />
      </section>
    </div>
  );
};

export default Home;
