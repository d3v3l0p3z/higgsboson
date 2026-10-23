# Form

## Root component class name

`hggs-form`

## Theme selector

```css
.hggs-form {
  /*
  ... put here variables ...
  */
}
```

## Component variables

```css
--form-input-space-vertical
```

## HTML Structure

### Default

#### Basic HTML structure (two inputs)

```html
<form class="hggs-form">
  <input type="text" class="hggs-input" />
  <input type="text" class="hggs-input" />
</form>
```

#### Basic HTML structure (two fields)

```html
<form class="hggs-form">
  <div class="hggs-field">
    <label for="id-test" class="hggs-label">Label</label>
    <input id="id-test" type="text" class="hggs-input" />
  </div>
  <div class="hggs-field">
    <label for="id-test" class="hggs-label">Label</label>
    <input id="id-test" type="text" class="hggs-input" />
  </div>
</form>
```
