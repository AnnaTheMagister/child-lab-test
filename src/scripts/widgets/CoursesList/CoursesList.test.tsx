import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { CoursesListComponent } from './CoursesList';
import { CoursesContext } from '../../entities/Courses';

const mockContext = {
  courses: [
    {
      id: 1,
      title: { rendered: 'Курс для родителей' },
      link: '/course-1',
      acf: {
        course_subtitle: 'Подзаголовок 1',
        course_description: 'Описание 1',
        course_access_link: '',
        course_color: '#eb3f9b',
        course_background_color: '#fff',
        course_title_color: '#000',
        course_button_gradient: '',
      },
      course_audience: [10],
      course_type: [20],
      _embedded: { 'wp:featuredmedia': [ { source_url: '/img1.jpg' } ] },
    },
    {
      id: 2,
      title: { rendered: 'Курс для педагогов' },
      link: '/course-2',
      acf: {
        course_subtitle: 'Подзаголовок 2',
        course_description: 'Описание 2',
        course_access_link: '',
        course_color: '#3498db',
        course_background_color: '#fff',
        course_title_color: '#000',
        course_button_gradient: '',
      },
      course_audience: [11],
      course_type: [21],
      _embedded: { 'wp:featuredmedia': [ { source_url: '/img2.jpg' } ] },
    },
  ],
  coursesLoading: false,
  audienceTerms: [
    { id: 10, name: 'Родителям', slug: 'parents' },
    { id: 11, name: 'Педагогам', slug: 'teachers' },
  ],
  audienceTermsLoading: false,
  courseTypeTerms: [
    { id: 20, name: 'Вебинар', slug: 'webinar' },
    { id: 21, name: 'Курс', slug: 'course' },
  ],
  courseTypeTermsLoading: false,
};

function renderWithContext(context = mockContext) {
  return render(
    <CoursesContext.Provider value={context}>
      <CoursesListComponent />
    </CoursesContext.Provider>,
  );
}

describe('CoursesListComponent', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', window.location.pathname);
  });

  it('renders filter buttons for each audience term plus "Все"', () => {
    renderWithContext();

    expect(screen.getByText('Все')).toBeInTheDocument();
    expect(screen.getByText('Родителям')).toBeInTheDocument();
    expect(screen.getByText('Педагогам')).toBeInTheDocument();
  });

  it('renders all courses when "Все" filter is active', () => {
    renderWithContext();

    expect(screen.getByText('Курс для родителей')).toBeInTheDocument();
    expect(screen.getByText('Курс для педагогов')).toBeInTheDocument();
  });

  it('filters courses by audience when a filter button is clicked', () => {
    renderWithContext();

    fireEvent.click(screen.getByText('Родителям'));

    expect(screen.getByText('Курс для родителей')).toBeInTheDocument();
    expect(screen.queryByText('Курс для педагогов')).not.toBeInTheDocument();
  });

  it('shows all courses after switching filter then clicking "Все"', () => {
    renderWithContext();

    fireEvent.click(screen.getByText('Родителям'));
    expect(screen.queryByText('Курс для педагогов')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Все'));
    expect(screen.getByText('Курс для родителей')).toBeInTheDocument();
    expect(screen.getByText('Курс для педагогов')).toBeInTheDocument();
  });

  it('updates URL param when filter is clicked', () => {
    renderWithContext();

    fireEvent.click(screen.getByText('Родителям'));

    expect(window.location.search).toContain('audience=parents');
  });

  it('reads initial audience filter from URL', () => {
    window.history.replaceState({}, '', '?audience=teachers');

    renderWithContext();

    expect(screen.getByText('Курс для педагогов')).toBeInTheDocument();
    expect(screen.queryByText('Курс для родителей')).not.toBeInTheDocument();
  });

  it('shows loading state when data is loading', () => {
    const loadingContext = {
      ...mockContext,
      courses: [],
      coursesLoading: true,
    };

    renderWithContext(loadingContext);

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('shows empty state when no courses match the filter', () => {
    const emptyContext = {
      ...mockContext,
      audienceTerms: [
        { id: 99, name: 'Другое', slug: 'other' },
      ],
    };

    renderWithContext(emptyContext);

    fireEvent.click(screen.getByText('Другое'));

    expect(screen.getByText('Нет курсов по этой теме')).toBeInTheDocument();
  });

  it('shows subtitle and description when present', () => {
    renderWithContext();

    expect(screen.getByText('Подзаголовок 1')).toBeInTheDocument();
    expect(screen.getByText('Описание 1')).toBeInTheDocument();
  });

  it('renders course type tag on card banner', () => {
    renderWithContext();

    expect(screen.getByText('Вебинар')).toBeInTheDocument();
    expect(screen.getByText('Курс')).toBeInTheDocument();
  });

  it('each course card has a "Подробнее" link', () => {
    renderWithContext();

    const links = screen.getAllByText('Подробнее');
    expect(links).toHaveLength(2);
    expect(links[0].closest('a')).toHaveAttribute('href', '/course-1');
    expect(links[1].closest('a')).toHaveAttribute('href', '/course-2');
  });

  it('marks the active filter button with mod-active class', () => {
    renderWithContext();

    const allBtn = screen.getByText('Все');
    expect(allBtn.className).toContain('courses-filter__btn--active');

    fireEvent.click(screen.getByText('Педагогам'));
    expect(allBtn.className).not.toContain('courses-filter__btn--active');
    expect(screen.getByText('Педагогам').className).toContain('courses-filter__btn--active');
  });

  it('clears URL param when "Все" is clicked after a filter', () => {
    window.history.replaceState({}, '', '?audience=parents');
    renderWithContext();

    fireEvent.click(screen.getByText('Все'));

    expect(window.location.search).not.toContain('audience');
  });
});
