import React from 'react';
import { DEFAULT_IMAGE_URL } from '../../../shared/consts';
import { resolveColors } from '../../../shared/libs/colors';
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

  const {
    courseColor, courseBackgroundColor,
  } = resolveColors({
    courseColor: course.acf?.course_color,
    courseTitleColor: course.acf?.course_title_color,
    courseButtonGradient: course.acf?.course_button_gradient,
    courseBackgroundColor: course.acf?.course_background_color,
  });

  return (
    <div
      className="course-card"
      style={{
        backgroundImage: `url(${imageUrl})`,
        '--course-color': courseColor,
      } as React.CSSProperties}
    >
      <div className="course-card__overlay" style={{
        background: `linear-gradient(to top, ${courseBackgroundColor} 0, rgba(255, 255, 255, 1) 100%)`,
      }} />
      <div className="course-card__content" >
        {courseTypeName && (
          <Tag color={courseColor} textColor="#fff" size="lg" className="course-card__tag">
            {courseTypeName}
          </Tag>
        )}
        <h3 className="course-card__title" style={{ color: courseColor }}>{course.title.rendered}{' '}
          {course.acf?.course_subtitle &&
            course.acf.course_subtitle
          }</h3>
        {course.acf?.course_description && (
          <div className="course-card__description truncate-multiline">
            {course.acf.course_description}
          </div>
        )}
        <Button
          href={course.link}
          className="course-card-link"
          colors="custom"
          active={{ color: '#fff', background: courseColor }}
          size="md"
        >
          {/* <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}> */}
            <div>{window.wp.i18n.__('Подробнее', 'childlab')}</div>
            <Icon name="arrow-right" size={24} />
          {/* </div> */}
        </Button>
      </div>
    </div>
  );
};
