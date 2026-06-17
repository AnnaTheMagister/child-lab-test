import React, { useEffect, useState } from 'react';
import { Button, Tag } from '../../ui-kit';
import { resolveColors } from '../../shared/libs/colors';
import { useCourse } from '../../entities/Course';
import './CourseBanner.scss';
import { getScreenSize } from '../FrontListComponent/FrontListComponent';

export interface CourseBannerData {
  courseColor: string;
  courseTitleColor: string;
  courseButtonGradient: string;
  courseBackgroundColor: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  courseTypes: Array<{ name: string; slug: string }>;
  courseAccessLink: string;
  imageUrl: string;
}

export const CourseBannerView = ({ data }: { data: CourseBannerData }) => {
  const { courseBackgroundColor } =
    resolveColors(data);

  const [size, setSize] = useState(getScreenSize(window.innerWidth))

  useEffect(() => {
    window.addEventListener("resize", () => {
      setSize(getScreenSize(window.innerWidth));
    });
  }, []);

  const isVertical = size === 'xs' || size === 'sm' || size === 'xxs'

  return <div
    className="course-banner"
    style={{ backgroundImage: `url(${data.imageUrl})` }}
  >
    <div
      className="course-banner-overlay"
      style={{
        background: `linear-gradient(to right, ${courseBackgroundColor} 0, rgba(255, 255, 255, 1) 100%)`,
      }}
    />
    <CourseBannerContent data={data} />
  </div >;
};

export const CourseBanner = () => {
  const { course, loading, error } = useCourse();

  if (loading) return null;
  if (error || !course) return null;

  return <CourseBannerView data={course} />;
};


export const CourseBannerContent = ({ data }: { data: CourseBannerData }) => {
  const { courseColor, courseTitleColor, courseButtonGradient } =
    resolveColors(data);

  return (
    <div className="container course-banner-content">
      <div className="col-lg-6 col-md-6 col-sm-12">
        {data.courseTypes.map(term => (
          <Tag key={term.slug} color={courseColor} textColor="#fff" size="lg">
            {term.name}
          </Tag>
        ))}
        <h1 className="course-banner-title" style={{ color: courseTitleColor }}>
          {data.title}
        </h1>
        {data.subtitle && (
          <h2 className="course-banner-subtitle" style={{ color: courseTitleColor }}>
            {data.subtitle}
          </h2>
        )}
        {data.shortDescription && (
          <div className="course-banner-description">
            {data.shortDescription}
          </div>
        )}
        {data.courseAccessLink && (
          <Button
            href={data.courseAccessLink}
            colors="custom"
            className="course-banner-access-button"
            active={{
              background: `linear-gradient(90deg, ${courseColor} 0%, ${courseButtonGradient} 100%)`,
              color: '#ffffff',
              borderColor: courseColor,
            }}
            size='lg'
            target="_blank"
          >
            Получить доступ
          </Button>
        )}
      </div>
    </div>
  );
};