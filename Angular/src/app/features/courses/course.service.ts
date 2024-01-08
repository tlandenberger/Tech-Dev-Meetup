import {Injectable} from '@angular/core';
import {delay, Observable, of} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CourseService {

    constructor() {
    }

    fetch() {
        return of([
            {
                id: 1,
                title: 'Angular: Getting Started',
                description: 'Learn the fundamentals of Angular',
                category: 'BEGINNER'
            },
            {
                id: 2,
                title: 'Angular: Forms',
                description: 'Learn the fundamentals of Angular forms',
                category: 'INTERMEDIATE'
            },
            {
                id: 3,
                title: 'Angular: HTTP',
                description: 'Learn the fundamentals of Angular HTTP',
                category: 'ADVANCED'
            }
        ] as Course[])
            .pipe(
                delay(2000)
            );
    }

    fetchContent(courseId: number | null) {
        const courseContent = courseId != null
            ? {
                content: courseId +
                    '\n' +
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
                    'Sed non risus. Suspendisse lectus tortor, dignissim sit amet, ' +
                    'adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam.',
                status: 'LOADED'
            } as CourseContent
            : null;
        return of(courseContent)
            .pipe(
                delay(2000)
            )
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
