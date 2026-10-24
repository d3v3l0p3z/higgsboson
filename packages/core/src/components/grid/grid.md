# Grid

## Root component class name

`hggs-grid`

## Other elements component class names

`hggs-cell`

## Theme selector

```css
.hggs-grid {
  /*
  ... put here variables ...
  */
}
```

## HTML Structure

### Default

#### Basic HTML structure

```html
<div class="hggs-grid">
  <div class="hggs-cell hggs-cell--4of12"></div>
</div>
```

#### Basic HTML structure with `center` modifier

```html
<div class="hggs-grid hggs-grid--center">
  <div class="hggs-cell hggs-cell--6of12"></div>
  <div class="hggs-cell hggs-cell--2of12"></div>
</div>
```

#### Basic HTML structure with `right` modifier

```html
<div class="hggs-grid hggs-grid--right">
  <div class="hggs-cell hggs-cell--6of12"></div>
  <div class="hggs-cell hggs-cell--2of12"></div>
</div>
```

#### Basic HTML structure with `left` modifier

```html
<div class="hggs-grid hggs-grid--left">
  <div class="hggs-cell hggs-cell--6of12"></div>
  <div class="hggs-cell hggs-cell--2of12"></div>
</div>
```

#### Basic HTML structure with `between` modifier

```html
<div class="hggs-grid hggs-grid--between">
  <div class="hggs-cell hggs-cell--6of12"></div>
  <div class="hggs-cell hggs-cell--2of12"></div>
</div>
```

#### Basic HTML structure with so many cells

```html
<div class="hggs-grid">
  <div class="hggs-cell hggs-cell--6of12"></div>
  <div class="hggs-cell hggs-cell--2of12"></div>
  <div class="hggs-cell hggs-cell--4of12"></div>
  <div class="hggs-cell hggs-cell--4of12"></div>
  <div class="hggs-cell hggs-cell--3of12"></div>
  <div class="hggs-cell hggs-cell--5of12"></div>
</div>
```
