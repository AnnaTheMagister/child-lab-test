import React, { useState, useEffect, useMemo } from "react";
import { useCourses } from "../../entities/Courses";
import Loader from "../Loader/Loader";
import { useCurrentSearch } from "../../shared/hooks";
import { ButtonGroup, Button } from "../../ui-kit";
import { CourseCard, Course } from "./CourseCard";
import { getTermNameBySlug } from "../../shared/libs/terms";

interface Term {
  id: number;
  name: string;
  slug: string;
}

const AUDIENCE_PARAM = "audience";
const DEFAULT_AUDIENCE_SLUG = "parents";

export const CoursesListComponent = () => {
  const {
    courses,
    coursesLoading,
    audienceTerms,
    courseTypeTerms,
    audienceTermsLoading,
    courseTypeTermsLoading,
  } = useCourses();

  const { getParam } = useCurrentSearch();

  const [selectedAudience, setSelectedAudience] = useState<string | null>(
    () => getParam(AUDIENCE_PARAM) || DEFAULT_AUDIENCE_SLUG,
  );

  useEffect(() => {
    const urlValue = getParam(AUDIENCE_PARAM) || DEFAULT_AUDIENCE_SLUG;
    setSelectedAudience(urlValue);
  }, [getParam]);

  const sortedTerms = useMemo(() => {
    const terms = audienceTerms as Term[];
    return [...terms].sort((a, b) => {
      if (a.slug === DEFAULT_AUDIENCE_SLUG) return -1;
      if (b.slug === DEFAULT_AUDIENCE_SLUG) return 1;
      return 0;
    });
  }, [audienceTerms]);

  const filteredCourses = useMemo(() => {
    if (!selectedAudience) return courses;
    const coursesData = courses as Course[];
    return coursesData.filter((c) => {
      const slugs = c.acf?.course_audience || [];
      return slugs.includes(selectedAudience);
    });
  }, [courses, selectedAudience]);

  const setAudienceFilter = (slug: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set(AUDIENCE_PARAM, slug);
    window.history.pushState({}, "", url.toString());
    window.dispatchEvent(new Event("pushstate"));
    setSelectedAudience(slug);
  };

  const loading =
    coursesLoading || audienceTermsLoading || courseTypeTermsLoading;

  return (
    <>
      <ButtonGroup className="courses-filter">
        {sortedTerms.map((term) => (
          <Button
            key={term.id}
            isActive={selectedAudience === term.slug}
            colors="raspberry"
            onClick={() => setAudienceFilter(term.slug)}
          >
            {term.name}
          </Button>
        ))}
      </ButtonGroup>

      {loading ? (
        <Loader fullScreen={false} />
      ) : (filteredCourses as Course[]).length === 0 ? (
        <div className="empty-wrapper">
          <div className="empty-placeholder">
            {window.wp.i18n.__("Нет курсов по этой теме", "childlab")}
          </div>
        </div>
      ) : (
        <div className="courses-list">
          {(filteredCourses as Course[]).map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              courseTypeName={getTermNameBySlug(course.acf?.course_type, courseTypeTerms as Term[])}
            />
          ))}
        </div>
      )}
    </>
  );
};
