import { Component, inject, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {CourseStore} from "./CourseStore";
import {Course} from "./course.service";
import {CourseStore} from "./CourseStore";
import {Course} from "./course.service";

@Component({
    selector: 'app-courses',
    standalone: true,
    imports: [
        FormsModule,
    ],
    templateUrl: './courses.component.html',
    styleUrl: './courses.component.scss',
})
export class CoursesComponent {
    private store = inject(CourseStore);
    courses = this.store.courses;
    filteredCourses: Signal<Course[]> = this.store.filteredCourses;
    filter = this.store.filter;
    courseContent = this.store.courseContent;

    onCourseClick = (course: Course) => this.store.selectCourse(course.id);

    onFilterChange = (filter: string) => this.store.setFilter(filter);
}
