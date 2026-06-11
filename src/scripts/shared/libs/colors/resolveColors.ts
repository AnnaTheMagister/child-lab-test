import { addColors } from './colors';

const DEFAULT_COURSE_COLOR = '#EB3F9B';

export interface CourseColors {
  courseColor: string;
  courseTitleColor: string;
  courseButtonGradient: string;
  courseBackgroundColor: string;
}

export interface PartialCourseColors {
  courseColor?: string;
  courseTitleColor?: string;
  courseButtonGradient?: string;
  courseBackgroundColor?: string;
}

export function resolveColors(data: PartialCourseColors): CourseColors {
  const courseColor = data.courseColor || DEFAULT_COURSE_COLOR;
  const courseTitleColor = data.courseTitleColor || courseColor;
  const courseButtonGradient = data.courseButtonGradient || addColors(courseColor, '#3300FF');
  const courseBackgroundColor = data.courseBackgroundColor || addColors(courseColor, '#AAAAAA');
  return { courseColor, courseTitleColor, courseButtonGradient, courseBackgroundColor };
}
