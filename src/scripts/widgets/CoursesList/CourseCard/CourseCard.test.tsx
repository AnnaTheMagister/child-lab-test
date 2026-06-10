import React from 'react';
import { render, screen } from '@testing-library/react';
import { CourseCard, Course } from './CourseCard';

const baseCourse: Course = {
  id: 1,
  title: { rendered: 'Test Course' },
  link: '/test-course',
  acf: {
    course_subtitle: 'Test Subtitle',
    course_description: 'Test Description',
    course_access_link: '',
    course_color: '#eb3f9b',
    course_background_color: '#fff',
    course_title_color: '#000',
    course_button_gradient: '',
    course_audience: ['parents'],
    course_type: 'online',
  },
  _embedded: {
    'wp:featuredmedia': [{ source_url: '/test-img.jpg' }],
  },
};

beforeEach(() => {
  window.wp = {
    i18n: {
      __: (str: string) => str,
    },
  } as any;
});

describe('CourseCard', () => {
  it('renders title', () => {
    render(<CourseCard course={baseCourse} courseTypeName="Webinar" />);
    expect(screen.getByRole('heading')).toHaveTextContent('Test Course');
  });

  it('renders subtitle when present', () => {
    render(<CourseCard course={baseCourse} courseTypeName="Webinar" />);
    expect(screen.getByRole('heading')).toHaveTextContent('Test Subtitle');
  });

  it('renders description when present', () => {
    render(<CourseCard course={baseCourse} courseTypeName="Webinar" />);
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders course type tag when name provided', () => {
    render(<CourseCard course={baseCourse} courseTypeName="Webinar" />);
    expect(screen.getByText('Webinar')).toBeInTheDocument();
  });

  it('does not render course type tag when null', () => {
    render(<CourseCard course={baseCourse} courseTypeName={null} />);
    expect(screen.queryByText('Webinar')).not.toBeInTheDocument();
  });

  it('renders "Подробнее" link with course href', () => {
    render(<CourseCard course={baseCourse} courseTypeName="Webinar" />);
    const link = screen.getByRole('link', { name: /подробнее/i });
    expect(link).toHaveAttribute('href', '/test-course');
  });

  it('renders chevron icon in the link', () => {
    render(<CourseCard course={baseCourse} courseTypeName="Webinar" />);
    const link = screen.getByRole('link', { name: /подробнее/i });
    expect(link.querySelector('svg')).toBeInTheDocument();
  });

  it('sets --course-color CSS variable and background image on card', () => {
    const { container } = render(<CourseCard course={baseCourse} courseTypeName="Webinar" />);
    const card = container.querySelector('.course-card');
    const style = card?.getAttribute('style') || '';
    expect(style).toContain('#eb3f9b');
    expect(style).toContain('/test-img.jpg');
  });

  it('renders tag with course color as background', () => {
    render(<CourseCard course={baseCourse} courseTypeName="Webinar" />);
    const tag = screen.getByText('Webinar');
    expect(tag.className).toContain('ui-tag');
    expect(tag.style.backgroundColor).toBe('rgb(235, 63, 155)');
  });

  it('does not render subtitle when empty', () => {
    const course = { ...baseCourse, acf: { ...baseCourse.acf, course_subtitle: '' } };
    render(<CourseCard course={course} courseTypeName="Webinar" />);
    expect(screen.queryByText('Test Subtitle')).not.toBeInTheDocument();
  });

  it('does not render description when empty', () => {
    const course = { ...baseCourse, acf: { ...baseCourse.acf, course_description: '' } };
    render(<CourseCard course={course} courseTypeName="Webinar" />);
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  it('uses default color when course_color is empty', () => {
    const course = { ...baseCourse, acf: { ...baseCourse.acf, course_color: '' } };
    const { container } = render(<CourseCard course={course} courseTypeName="Webinar" />);
    const card = container.querySelector('.course-card');
    expect(card?.getAttribute('style')).toContain('#EB3F9B');
  });
});
