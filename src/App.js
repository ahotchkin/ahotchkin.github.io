import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from 'react';
import './App.css';
import ScrollRestoration from './components/utils/ScrollRestoration';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Project from './components/projects/Project';
import { BlogProvider  } from "./context/BlogContext";
import Blog from './components/blog/Blog';
import BlogPost from './components/blog/BlogPost';
import './styles/global.css';

function App() {
  return (
    <div>
      <Router>
        <ScrollRestoration />
        <div>
          <NavBar />
        </div>
        <div className="main-content">
          <BlogProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects/:projectUrl" element={<Project />} />

              <Route path="/blog/*" element={
                <Routes>
                  <Route index element={<Blog />} />
                  <Route path="/:slug" element={<BlogPost />} />
                </Routes>
              } />
            </Routes>
          </BlogProvider>
        </div>
      </Router>
    </div>
  );
}

export default App;
