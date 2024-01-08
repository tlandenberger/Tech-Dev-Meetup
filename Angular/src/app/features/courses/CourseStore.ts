import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState
} from "@ngrx/signals";
import { computed, inject } from "@angular/core";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { Course, CourseContent, CourseService } from "./course.service";
import { switchMap, tap } from "rxjs";

export const CourseStore = signalStore(
  { providedIn: "root" },
  withState({
    status: "INIT" as "INIT" | "LOADING" | "LOADED" | "ERROR",
    courses: [] as Course[],
    filter: "" as string,
    selectedCourseId: null as number | null,
    courseContent: null as CourseContent | null
  }),
  withComputed(({ courses, filter }) => ({
    filteredCourses: computed(() =>
      courses().filter((course) =>
        filter() === "" ? course : course.category === filter()
      )
    )
  })),
  withMethods((state) => {
    const courseService = inject(CourseService);

    return {
      setFilter: (filter: string) => patchState(state, { filter }),

      selectCourse: (id: number | null) => {
        if (state.selectedCourseId() === id) return;
        patchState(state, { selectedCourseId: id });
      },

      load: rxMethod<void>(() => {
        return courseService.fetch().pipe(
          tap((res) =>
            patchState(state, {
              courses: res,
              status: "LOADED"
            })
          )
        );
      }),

      loadContent: rxMethod<number | null>((courseId$) =>
        courseId$.pipe(
          tap(() =>
            patchState(state, {
              courseContent: { content: "", status: "LOADING" }
            })
          ),
          switchMap((courseId) => courseService.fetchContent(courseId)),
          tap((res) =>
            patchState(state, {
              courseContent: res
            })
          )
        )
      )
    };
  }),
  withHooks({
    onInit({ load, loadContent, selectedCourseId }) {
      load();
      loadContent(selectedCourseId);
    }
  })
);
