import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { CoursesContextProvider, useCourses } from './CoursesContext';

const mockCourses = [
  {
    id: 1,
    title: { rendered: 'Course A' },
    link: '/course-a',
    acf: {
      course_subtitle: 'Sub A',
      course_description: 'Desc A',
      course_access_link: '',
      course_color: '#ff0000',
      course_background_color: '#fff',
      course_title_color: '#000',
      course_button_gradient: '',
    },
    course_audience: [10],
    course_type: [20],
    _embedded: { 'wp:featuredmedia': [ { source_url: '/img.jpg' } ] },
  },
];

const mockAudienceTerms = [
  { id: 10, name: 'Родителям', slug: 'parents' },
  { id: 11, name: 'Педагогам', slug: 'teachers' },
];

const mockCourseTypeTerms = [
  { id: 20, name: 'Вебинар', slug: 'webinar' },
];

function TestConsumer() {
  const {
    courses,
    coursesLoading,
    audienceTerms,
    audienceTermsLoading,
    courseTypeTerms,
    courseTypeTermsLoading,
  } = useCourses();

  if (coursesLoading || audienceTermsLoading || courseTypeTermsLoading) {
    return <div data-testid="loading">loading</div>;
  }

  return (
    <div>
      <div data-testid="courses-count">{courses.length}</div>
      <div data-testid="audience-count">{audienceTerms.length}</div>
      <div data-testid="coursetype-count">{courseTypeTerms.length}</div>
      <div data-testid="course-title">{courses[0]?.title?.rendered}</div>
      <div data-testid="audience-name">{audienceTerms[0]?.name}</div>
      <div data-testid="coursetype-name">{courseTypeTerms[0]?.name}</div>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <CoursesContextProvider>
      <TestConsumer />
    </CoursesContextProvider>,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('CoursesContextProvider', () => {
  it('shows loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise(() => {}),
    );

    renderWithProvider();
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('provides courses, audienceTerms and courseTypeTerms after fetching', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ json: () => Promise.resolve(mockCourses) })
      .mockResolvedValueOnce({ json: () => Promise.resolve(mockAudienceTerms) })
      .mockResolvedValueOnce({ json: () => Promise.resolve(mockCourseTypeTerms) });

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId('courses-count')).toHaveTextContent('1');
    });

    expect(screen.getByTestId('audience-count')).toHaveTextContent('2');
    expect(screen.getByTestId('coursetype-count')).toHaveTextContent('1');
    expect(screen.getByTestId('course-title')).toHaveTextContent('Course A');
    expect(screen.getByTestId('audience-name')).toHaveTextContent('Родителям');
    expect(screen.getByTestId('coursetype-name')).toHaveTextContent('Вебинар');
  });

  it('makes three separate fetch calls with correct URLs', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ json: () => Promise.resolve(mockCourses) })
      .mockResolvedValueOnce({ json: () => Promise.resolve(mockAudienceTerms) })
      .mockResolvedValueOnce({ json: () => Promise.resolve(mockCourseTypeTerms) });

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId('courses-count')).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/wp/v2/courses?per_page=100&_embed'),
    );
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/wp/v2/course-audience'),
    );
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/wp/v2/course-type'),
    );
  });
});
