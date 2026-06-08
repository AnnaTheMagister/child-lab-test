import React from 'react';
import { DEFAULT_IMAGE_URL } from '../../../shared/consts';
import { Button, Icon, Tag } from '../../../ui-kit';

export interface Course {
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
    course_audience: string[];
    course_type: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string }>;
  };
}

export const CourseCard = ({
  course,
  courseTypeName,
}: {
  course: Course;
  courseTypeName: string | null;
}) => {
  const imgSrc = course._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const imageUrl = imgSrc ?? DEFAULT_IMAGE_URL;
  const courseColor = course.acf?.course_color || '#EB3F9B';

  return (
    <div
      className="course-card"
      style={{
        backgroundImage: `url(${imageUrl})`,
        '--course-color': courseColor,
      } as React.CSSProperties}
    >
      <div className="course-card__overlay" />
      <div className="course-card__content">
        {courseTypeName && (
          <Tag color={courseColor} textColor="#fff" size="sm" className="course-card__tag">
            {courseTypeName}
          </Tag>
        )}
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
        <Button
          href={course.link}
          colors="custom"
          active={{ background: '#fff', color: courseColor }}
          icon={<Icon name="chevron" />}
          size="lg"
        >
          {window.wp.i18n.__('Подробнее', 'childlab')}
        </Button>
      </div>
    </div>
  );
};
