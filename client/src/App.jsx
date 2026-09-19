import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import WriteArticles from "./pages/WriteArticles";
import BlogTitle from "./pages/BlogTitle";
import GenerateImage from "./pages/GenerateImage";
import RemoveBackground from "./pages/RemoveBackground";
import RemoveObject from "./pages/RemoveObject";
import ReviewResume from "./pages/ReviewResume";
import Community from "./pages/Community";
import {Toaster} from 'react-hot-toast'


function App() {
  

  return (
    <div>
      <Toaster />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/write-article" element={<WriteArticles />} />
        <Route path="/blog-titles" element={<BlogTitle />} />
        <Route path="/generate-images" element={<GenerateImage />} />
        <Route path="/remove-background" element={<RemoveBackground />} />
        <Route path="/remove-object" element={<RemoveObject />} />
        <Route path="/review-resume" element={<ReviewResume />} />
        <Route path="/community" element={<Community />} />
      </Route>
    </Routes>
    </div>
  );
}

export default App;