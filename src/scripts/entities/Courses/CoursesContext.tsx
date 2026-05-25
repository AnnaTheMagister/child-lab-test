import React, { useState, useEffect, createContext, useContext } from "react";
import { BASE_URL } from "../../shared/consts";

export const CoursesContext = createContext({
  courses: [],
  coursesLoading: true,
  audienceTerms: [],
  audienceTermsLoading: true,
  courseTypeTerms: [],
  courseTypeTermsLoading: true,
});

export const CoursesContextProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [audienceTerms, setAudienceTerms] = useState([]);
  const [audienceTermsLoading, setAudienceTermsLoading] = useState(true);
  const [courseTypeTerms, setCourseTypeTerms] = useState([]);
  const [courseTypeTermsLoading, setCourseTypeTermsLoading] = useState(true);

  useEffect(() => {
    fetch(BASE_URL + "/wp-json/wp/v2/courses?per_page=100&_embed")
      .then((response) => response.json())
      .then((data) => {
        setCourses(data);
        setCoursesLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch(BASE_URL + "/wp-json/wp/v2/course-audience")
      .then((response) => response.json())
      .then((data) => {
        setAudienceTerms(data);
        setAudienceTermsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch(BASE_URL + "/wp-json/wp/v2/course-type")
      .then((response) => response.json())
      .then((data) => {
        setCourseTypeTerms(data);
        setCourseTypeTermsLoading(false);
      });
  }, []);

  const context = {
    courses,
    coursesLoading,
    audienceTerms,
    audienceTermsLoading,
    courseTypeTerms,
    courseTypeTermsLoading,
  };

  return (
    <CoursesContext.Provider value={context}>
      {children}
    </CoursesContext.Provider>
  );
};

export const useCourses = () => useContext(CoursesContext);
