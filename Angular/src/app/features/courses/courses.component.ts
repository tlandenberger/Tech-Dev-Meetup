import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { delay, of, tap } from 'rxjs';

@Component({
    selector: 'app-courses',
    standalone: true,
    imports: [
        FormsModule,
    ],
    templateUrl: './courses.component.html',
    styleUrl: './courses.component.scss',
})
export class CoursesComponent implements OnInit {
    courses = signal<Course[]>([]);
    filter = signal<string>('');
    selectedCourse = signal<Course | null>(null);
    courseContent = signal<CourseContent | null>(null);

    filteredCourses = computed(() =>
        this.courses().filter((course) =>
            this.filter() === '' ? course : course.category === this.filter()
        )
    );

    constructor() {
        effect(() => {
            this.fetchCourseContent(this.selectedCourse()).then(res => this.courseContent.set({
                content: res || '',
                status: 'LOADED'
            }));
        }, {allowSignalWrites: true});
    }

    ngOnInit() {
        this.fetchCourses()
            .pipe(tap((courses) => this.courses.set(courses)))
            .subscribe();
    }

    onCourseClick = (course: Course) => this.selectedCourse.set(course);

    private fetchCourses() {
        return of([
            {
                id: 1,
                title: 'Angular: Getting Started',
                description: 'Learn the fundamentals of Angular',
                category: 'BEGINNER',
            },
            {
                id: 2,
                title: 'Angular: Forms',
                description: 'Learn the fundamentals of Angular forms',
                category: 'INTERMEDIATE',
            },
            {
                id: 3,
                title: 'Angular: HTTP',
                description: 'Learn the fundamentals of Angular HTTP',
                category: 'ADVANCED',
            },
        ] as Course[]).pipe(delay(2000));
    }

    private async fetchCourseContent(course: Course | null) {
        this.courseContent.update(content => content ? ({...content, status: 'LOADING'}) : null);

        if (course) {
            return new Promise<string>(resolve => {
                setTimeout(() => {
                    const content = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
                        'Sed non risus. Suspendisse lectus tortor, dignissim sit amet, ' +
                        'adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam.'

                    resolve(content);
                }, 2000);
            });
        } else {
            return null;
        }
    }
}

export type Course = {
    id: number;
    title: string;
    description: string;
    category: string;
};

export type CourseContent = {
    content: string;
    status: 'LOADING' | 'LOADED' | 'ERROR';
};
