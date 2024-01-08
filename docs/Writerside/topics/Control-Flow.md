# Control Flow

Die neue Syntax für Control Flow in Templates folgt den Standards anderer Frameworks und soll für eine bessere
Lesbarkeit sorgen. Es werden Keywords genutzt, die nicht in HTML Tags eingebunden sind und sorgt damit für eine visuelle
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