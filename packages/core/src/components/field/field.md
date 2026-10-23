# Field

## Root component class name

`hggs-field`

## Theme selector

```css
.hggs-field {
  /*
  ... put here variables ...
  */
}
```

## Component variables

```css
--field-label-after-color-required
--field-label-after-margin-left-required
--field-label-margin-bottom
```

## HTML Structure

### Default

#### Basic HTML structure

```html
<div class="hggs-field">
  <label for="id-test" class="hggs-label">Label</label>
  <input id="id-test" type="text" class="hggs-input" />
</div>
```

#### Basic HTML structure with `required` modifier

```html
<div class="hggs-field hggs-field--required">
  <label for="id-test" class="hggs-label">Label</label>
  <input id="id-test" type="text" class="hggs-input" />
</div>
```

#### Basic HTML structure with `focus` modifier

```html
<div class="hggs-field">
  <label for="id-test" class="hggs-label hggs-label--focus">Label</label>
  <input id="id-test" type="text" class="hggs-input hggs-input--focus" />
</div>
```

#### Basic HTML structure with `disabled` modifier

```html
<div class="hggs-field">
  <label for="id-test" class="hggs-label hggs-label--disabled">Label</label>
  <input id="id-test" type="text" class="hggs-input--disabled" />
</div>
```

#### Basic HTML structure with `error` modifier

```html
<div class="hggs-field">
  <label for="id-test" class="hggs-label--error">Label</label>
  <input id="id-test" type="text" class="hggs-input--error" />
</div>
```
