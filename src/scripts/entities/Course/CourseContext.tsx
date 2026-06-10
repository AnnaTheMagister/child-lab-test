import React, { useState, useEffect, createContext, useContext } from 'react';
import { BASE_URL } from '../../shared/consts';
import { getTermNameBySlug } from '../../shared/libs/terms';

export interface CourseTypeTerm {
  name: string;
  slug: string;
}

export interface CourseData {
  postId: number;
  title: string;
  subtitle: string;
  shortDescription: string;
  courseColor: string;
  courseTitleColor: string;
  courseButtonGradient: string;
  courseBackgroundColor: string;
  courseAccessLink: string;
  courseTypes: CourseTypeTerm[];
  imageUrl: string;
}

interface CourseContextType {
  course: CourseData | null;
  loading: boolean;
  error: string | null;
}

const CourseContext = createContext<CourseContextType>({
  course: null,
  loading: true,
  error: null,
});

export const CourseContextProvider = ({ postId, children }: { postId: number; children: React.ReactNode }) => {
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) {
      setError('No post ID provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const courseUrl = `${BASE_URL}/wp-json/wp/v2/courses/${postId}?_embed`;
    const termUrl = `${BASE_URL}/wp-json/wp/v2/course-type`;

    Promise.all([
      fetch(courseUrl).then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); }),
      fetch(termUrl).then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); }),
    ])
      .then(([courseData, termData]: [any, any[]]) => {
        const img =
          courseData._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
          '';

        const courseTypeSlug: string | undefined = courseData.acf?.course_type;
        const courseTypes: CourseTypeTerm[] = courseTypeSlug
          ? [{ name: getTermNameBySlug(courseTypeSlug, termData) || courseTypeSlug, slug: courseTypeSlug }]
          : [];

        setCourse({
          postId: courseData.id,
          title: courseData.title?.rendered || '',
          subtitle: courseData.acf?.course_subtitle || '',
          shortDescription: courseData.acf?.course_short_description || '',
          courseColor: courseData.acf?.course_color || '#EB3F9B',
          courseTitleColor: courseData.acf?.course_title_color || '',
          courseButtonGradient: courseData.acf?.course_button_gradient || '',
          courseBackgroundColor: courseData.acf?.course_background_color || '',
          courseAccessLink: courseData.acf?.course_access_link || '',
          courseTypes,
          imageUrl: img,
        });
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [postId]);

  return (
    <CourseContext.Provider value={{ course, loading, error }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => useContext(CourseContext);
