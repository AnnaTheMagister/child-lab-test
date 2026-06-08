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
        course_audience: ['parents'],
        course_type: 'online',
      },
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
        course_audience: ['teachers'],
        course_type: 'offline',
      },
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
    { id: 20, name: 'Вебинар', slug: 'online' },
    { id: 21, name: 'Курс', slug: 'offline' },
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

  it('renders filter buttons for each audience term', () => {
    renderWithContext();

    expect(screen.getByText('Родителям')).toBeInTheDocument();
    expect(screen.getByText('Педагогам')).toBeInTheDocument();
  });

  it('does not render "Все" button', () => {
    renderWithContext();

    expect(screen.queryByText('Все')).not.toBeInTheDocument();
  });

  it('defaults to "Родителям" filter when no URL param', () => {
    renderWithContext();

    expect(screen.getByText('Курс для родителей')).toBeInTheDocument();
    expect(screen.queryByText('Курс для педагогов')).not.toBeInTheDocument();
  });

  it('default active button is "Родителям"', () => {
    renderWithContext();

    const parentsBtn = screen.getByRole('button', { name: /Родителям/ });
    expect(parentsBtn.className).toContain('ui-button--active');
  });

  it('filters courses by audience when a filter button is clicked', () => {
    renderWithContext();

    fireEvent.click(screen.getByText('Педагогам'));

    expect(screen.getByText('Курс для педагогов')).toBeInTheDocument();
    expect(screen.queryByText('Курс для родителей')).not.toBeInTheDocument();
  });

  it('switches active class when filter changes', () => {
    renderWithContext();

    const parentsBtn = screen.getByRole('button', { name: /Родителям/ });
    const teachersBtn = screen.getByRole('button', { name: /Педагогам/ });

    expect(parentsBtn.className).toContain('ui-button--active');
    expect(teachersBtn.className).not.toContain('ui-button--active');

    fireEvent.click(teachersBtn);

    expect(parentsBtn.className).not.toContain('ui-button--active');
    expect(teachersBtn.className).toContain('ui-button--active');
  });

  it('updates URL param when filter is clicked', () => {
    renderWithContext();

    fireEvent.click(screen.getByText('Педагогам'));

    expect(window.location.search).toContain('audience=teachers');
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
    expect(screen.queryByText('Курс')).not.toBeInTheDocument();
  });

  it('each course card has a "Подробнее" link', () => {
    renderWithContext();

    const links = screen.getAllByText('Подробнее');
    expect(links).toHaveLength(1);
    expect(links[0].closest('a')).toHaveAttribute('href', '/course-1');
  });

  it('defaults to parents slug when no URL param and parents term exists', () => {
    renderWithContext();

    expect(screen.getByRole('button', { name: /Родителям/ }).className).toContain('ui-button--active');
  });

  it('updates URL to parents param when parents button is clicked', () => {
    renderWithContext();

    fireEvent.click(screen.getByRole('button', { name: /Родителям/ }));

    expect(window.location.search).toContain('audience=parents');
  });
});
