# Select

## Root component class name

`hggs-select`

## Theme selector

```css
.hggs-select-wrapper,
.hggs-select {
  /*
  ... put here variables ...
  */
}
```

## Component variables

```css
--select-border
--select-border-focus
--select-border-radius
--select-box-shadow-focus
--select-color
--select-font-family
--select-font-size
--select-height
--select-open-icon-right
--select-open-icon-top
--select-outline-focus
--select-padding
```

## HTML Structure

### Default

#### Basic HTML structure

```html
<div class="hggs-select-wrapper">
  <select class="hggs-select" name="pets">
    <option class="hggs-option" value="">Please choose an option</option>
    <option class="hggs-option" value="dog">Dog</option>
    <option class="hggs-option" value="cat">Cat</option>
    <option class="hggs-option" value="hamster">Hamster</option>
    <option class="hggs-option" value="parrot">Parrot</option>
    <option class="hggs-option" value="spider">Spider</option>
    <option class="hggs-option" value="goldfish">Goldfish</option>
  </select>
  <span class="hggs-icon hggs-icon--chevron-down"></span>
</div>
```
