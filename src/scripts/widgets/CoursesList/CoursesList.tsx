import React, { useState, useEffect, useMemo } from "react";
import { DEFAULT_IMAGE_URL } from "../../shared/consts";
import { useCourses } from "../../entities/Courses";
import Loader from "../Loader/Loader";
import { useCurrentSearch } from "../../shared/hooks";

interface Course {
  id: number;
  title: { rendered: string };
  link: string;
  acf: {
    course_subtitle: string;
    course_description: string;
    course_access_link: string;
    course_color: string;
    course_background_color: string;
    course_title_color: string;
    course_button_gradient: string;
  };
  course_audience: number[];
  course_type: number[];
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string }>;
  };
}

interface Term {
  id: number;
  name: string;
  slug: string;
}

const AUDIENCE_PARAM = "audience";

export const CoursesListComponent = () => {
  const {
    courses,
    coursesLoading,
    audienceTerms,
    courseTypeTerms,
    audienceTermsLoading,
    courseTypeTermsLoading,
  } = useCourses();

  // Читаем параметр ?audience= из URL через общий хук
  const { getParam } = useCurrentSearch();

  const [selectedAudience, setSelectedAudience] = useState<string | null>(
    () => getParam(AUDIENCE_PARAM),
  );

  // Синхронизируем локальное состояние с URL (popstate / внешние изменения)
  useEffect(() => {
    setSelectedAudience(getParam(AUDIENCE_PARAM));
  }, [getParam]);

  const filteredCourses = useMemo(() => {
    if (!selectedAudience) return courses;

    const selectedTerm = (audienceTerms as Term[]).find(
      (t) => t.slug === selectedAudience,
    );
    if (!selectedTerm) return courses;

    return (courses as Course[]).filter((c) =>
      c.course_audience?.includes(selectedTerm.id),
    );
  }, [courses, selectedAudience, audienceTerms]);

  const setAudienceFilter = (slug: string | null) => {
    const url = new URL(window.location.href);

    if (slug) {
      url.searchParams.set(AUDIENCE_PARAM, slug);
    } else {
      url.searchParams.delete(AUDIENCE_PARAM);
    }

    window.history.pushState({}, "", url.toString());
    window.dispatchEvent(new Event("pushstate"));
    setSelectedAudience(slug);
  };

  const getCourseTypeName = (typeIds: number[]): string | null => {
    if (!typeIds?.length) return null;
    const term = (courseTypeTerms as Term[]).find(
      (t) => t.id === typeIds[0],
    );
    return term?.name ?? null;
  };

  const loading =
    coursesLoading || audienceTermsLoading || courseTypeTermsLoading;

  return (
    <div className="childlab-widget courses-list-page">
      <div className="courses-filter">
        <button
          className={`courses-filter__btn${
            !selectedAudience ? " courses-filter__btn--active" : ""
          }`}
          onClick={() => setAudienceFilter(null)}
        >
          {window.wp.i18n.__("Все", "childlab")}
        </button>
        {(audienceTerms as Term[]).map((term) => (
          <button
            key={term.id}
            className={`courses-filter__btn${
              selectedAudience === term.slug
                ? " courses-filter__btn--active"
                : ""
            }`}
            onClick={() => setAudienceFilter(term.slug)}
          >
            {term.name}
          </button>
        ))}
      </div>

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
            <CourseCardComponent
              key={course.id}
              course={course}
              courseTypeName={getCourseTypeName(course.course_type)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CourseCardComponent = ({
  course,
  courseTypeName,
}: {
  course: Course;
  courseTypeName: string | null;
}) => {
  const imgSrc = course._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  const imageUrl = imgSrc ?? DEFAULT_IMAGE_URL;
  const courseColor = course.acf?.course_color || "#EB3F9B";

  return (
    <div
      className="course-card"
      style={{ "--course-color": courseColor } as React.CSSProperties}
    >
      <div
        className="course-card__banner"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="course-card__overlay" />
        {courseTypeName && (
          <span className="course-card__tag">{courseTypeName}</span>
        )}
      </div>
      <div className="course-card__body">
        <h3 className="course-card__title">{course.title.rendered}</h3>
        {course.acf?.course_subtitle && (
          <div className="course-card__subtitle">
            {course.acf.course_subtitle}
          </div>
        )}
        {course.acf?.course_description && (
          <div className="course-card__description truncate-multiline">
            {course.acf.course_description}
          </div>
        )}
        <a className="course-card__link" href={course.link}>
          <span>{window.wp.i18n.__("Подробнее", "childlab")}</span>
          <svg className="svg-icon" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};
