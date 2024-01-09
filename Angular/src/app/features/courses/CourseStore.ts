import {
    patchState,
    signalStore,
    withComputed,
    withHooks,
    withMethods,
    withState,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Course, CourseContent, CourseService } from './course.service';
import { switchMap, tap } from 'rxjs';
import {
    addEntity,
    removeEntity,
    setEntities,
    updateEntity,
    withEntities,
} from '@ngrx/signals/entities';

export const CourseStore = signalStore(
    { providedIn: 'root' },
    withState({
        status: 'INIT' as 'INIT' | 'LOADING' | 'LOADED' | 'ERROR',
        filter: '' as string,
        selectedCourseId: null as number | null,
        courseContent: null as CourseContent | null,
    }),
    withEntities<Course>(),
    withComputed(({ filter, entities }) => ({
        filteredCourses: computed(() =>
            entities().filter((course) =>
                filter() === '' ? course : course.category === filter()
            )
        ),
    })),
    withMethods((state) => {
        const courseService = inject(CourseService);

        return {
            setFilter: (filter: string) => patchState(state, { filter }),

            selectCourse: (id: number | null) => {
                if (state.selectedCourseId() === id) return;
                patchState(state, { selectedCourseId: id });
            },

            addCourse: () => {
                const newCourse = {
                    id: Math.floor(Math.random() * 1000),
                    title: 'New Course',
                    description: 'New Course Description',
                    category: 'BEGINNER',
                } as Course;
                patchState(state, addEntity(newCourse));
            },

            updateCourse: (course: Course) => {
                const newTitle = course.title + ' Updated';
                patchState(
                    state,
                    {},
                    updateEntity({
                        id: course.id,
                        changes: { title: newTitle },
                    })
                );
            },

            removeCourse: (course: Course) => {
                patchState(state, {}, removeEntity(course.id));
            },

            load: rxMethod<void>(() => {
                return courseService
                    .fetch()
                    .pipe(
                        tap((res) =>
                            patchState(
                                state,
                                { status: 'LOADED' },
                                setEntities(res)
                            )
                        )
                    );
            }),

            loadContent: rxMethod<number | null>((courseId$) =>
                courseId$.pipe(
                    tap(() =>
                        patchState(state, {
                            courseContent: { content: '', status: 'LOADING' },
                        })
                    ),
                    switchMap((courseId) =>
                        courseService.fetchContent(courseId)
                    ),
                    tap((res) =>
                        patchState(state, {
                            courseContent: res,
                        })
                    )
                )
            ),
        };
    }),
    withHooks({
        onInit({ load, loadContent, selectedCourseId }) {
            load();
            loadContent(selectedCourseId);
        },
    })
);
