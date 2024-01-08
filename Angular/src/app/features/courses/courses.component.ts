import { Component, computed, OnInit, signal } from '@angular/core';
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

    filteredCourses = computed(() =>
        this.courses().filter((course) =>
            this.filter() === '' ? course : course.category === this.filter()
        )
    );

    ngOnInit() {
        this.fetchCourses()
            .pipe(tap((courses) => this.courses.set(courses)))
            .subscribe();
    }

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
}

export type Course = {
    id: number;
    title: string;
    description: string;
    category: string;
};
