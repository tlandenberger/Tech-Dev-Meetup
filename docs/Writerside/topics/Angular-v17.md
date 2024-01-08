# Angular v17

Angular 17 bringt einige Neuigkeiten die einen Eindruck geben in welche Richtung sich Angular in den nächsten Jahren
entwickeln möchte. <br/>
Mit **Signal** brachte Angular v16 eine neue Datenstruktur die _reactive Programming_ zugänglicher machen soll und die
Grundlage für eine _Zone-less Change Detection_ bietet. **Signals** sind in v17 stable und wurden nochmals leicht
überarbeitet. <br />
Die neue Syntax für Control Flow in Templates folgt den Standards anderer Frameworks und soll für eine bessere
Lesbarkeit sorgen.

## Signals

Ein **Signal** ist ein Objekt, das einen Wert annimmt. Consumer können diesen Wert lesen und updaten, außerdem werden
sie über Änderungen informiert. Wird ein **Signal** im Template benutzt, dann triggered Angular die Change Detection,
sobald sich der Wert des **Signals** ändert. Im Gegensatz zu **Observables** muss kein _Unsubscribe_ stattfinden.

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

## Control Flow Syntax

Der neue Control Flow Syntax nutzt Keywords, die nicht in HTML Tags eingebunden sind und sorgt damit für eine visuelle
Trennung zwischen HTMl und Control Flow Elementen. Der neue Control Flow ist für eine kommende Zone-less Change
Detection wichtig.

### @for
```HTML
<ul>
    @for (course of filteredCourses(); track course.id) {
        <li>{{ course.title }}</li>
    }
</ul>
```

### @if / @else
```HTML
@if (courses().length > 0) {
    <select [ngModel]="filter()" (ngModelChange)="filter.set($event)" name="filter">
        <option value="">All</option>
        <option value="BEGINNER">Beginner</option>
        <option value="INTERMEDIATE">Intermediate</option>
        <option value="ADVANCED">Advanced</option>
    </select>
    
    <ul>
        @for (course of filteredCourses(); track course.id) {
        <li>{{ course.title }}</li>
        }
    </ul>
} @else {
    <div>loading...</div>
}
```

Angular liefert direkt nützliche Werte mit: <br />
$index, $count, $first, $last, $even, $odd

```HTML
@for (course of filteredCourses(); track course.id;  let isEven = $even) {
    <li [style]="isEven ? 'color: red' : ''">
        {{ course.title }}
    </li>
}
```

### @switch

```HTML
@for (course of filteredCourses(); track $index;) {
    @switch (course.category) {
        @case('BEGINNER'){
            <span>Beginner</span>
        }
        @case('INTERMEDIATE'){
            <span>>Intermediate</span>
        }
        @case('ADVANCED'){
            <span>Advanced</span>
        }
        @default {
            <span>Beginner</span>
        }
    }
    {{ course.title }}
}
```