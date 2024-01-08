# Signals

Ein **Signal** ist ein Objekt, das einen Wert annimmt und _reactive Programming_ vereinfachen soll.
Consumer können diesen Wert lesen und updaten, außerdem werden sie über Änderungen informiert. Wird ein **Signal** im
Template benutzt, dann triggered Angular die Change Detection, sobald sich der Wert des **Signals** ändert. Im Gegensatz
zu **Observables** muss kein _Unsubscribe_ stattfinden. In zukünftigen Versionen bieten Signals die Grundlage für eine
Zone-less Change Detection.

```Typescript
   @Component({...})
   export class CoursesComponent implements OnInit {
       courses = signal<Course[]>([]);
       filter = signal<string>('');
   
       filteredCourses = computed(() =>
           this.courses().filter(course => this.filter() === ''
               ? course
               : course.category === this.filter()
           )
       );
   }    
```

Das Beispiel zeigt wie Signal in einer Component erzeugt werden können. Der Wert eines Signals kann mit **set()** oder
**update()** gesetzt werden.

```Typescript
   this.courses.set([
      {
          id: 1,
          title: 'Angular: Getting Started',
          description: 'Learn the fundamentals of Angular',
          category: 'BEGINNER'
      }
   ]);
```

```Typescript
   this.courses.update(courses => courses.map(
      course => ({
         ...course,
         description: course.description + ' (updated)'
     })
   ));
```

Im Beispiel wird mit der Funktion **computed()** ein **read-only** Signal erzeugt. Die Berechnungsfunktion wird
automatisch
ausgeführt, wenn sich der Wert eines benutzen Signals ändert.

Die oben erstellten Signals können wir im Template mit wie folgt nutzen:

```HTML
<h1>Courses</h1>
<select [ngModel]="filter()" (ngModelChange)="filter.set($event)" name="filter">
    <option value="">All</option>
    <option value="BEGINNER">Beginner</option>
    <option value="INTERMEDIATE">Intermediate</option>
    <option value="ADVANCED">Advanced</option>
</select>

<ul>
    <li *ngFor="let course of filteredCourses()">
        {{ course.title }}
    </li>
</ul>
```