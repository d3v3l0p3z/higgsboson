# Radio

## Root component class name

`hggs-radios`
`hggs-radio`

## Theme selector

```css
.hggs-radios,
.hggs-radio {
  /*
  ... put here variables ...
  */
}
```

## Component variables

```
--radio-accent-color
--radio-border
--radio-border-checked
--radio-inside-background-color
--radio-inside-border-bold
--radio-inside-border-checked
--radio-inside-border-checked-hover
--radio-inside-border-hover
--radio-inside-box-shadow-focus
--radio-inside-outline-focus
--radio-inside-transition
--radio-label-color
--radio-label-font-family
--radio-label-font-size
--radio-label-font-style
--radio-label-font-weight
--radio-label-margin-left
--radio-size
--radios-gap
```

## HTML Structure

### Default

#### Basic HTML structure

```html
<div class="hggs-radio">
  <input type="radio" id="radio1" name="radiogroup" />
  <span></span>
  <label class="hggs-label" for="radio1">Option 1</label>
</div>
```

### Radios list

#### Basic vertical HTML structure

```html
<div class="hggs-radios">
  <div class="hggs-radio">
    <input type="radio" id="radio1" name="radiogroup" />
    <span></span>
    <label class="hggs-label" for="radio1">Option 1</label>
  </div>
  <div class="hggs-radio">
    <input type="radio" id="radio2" name="radiogroup" />
    <span></span>
    <label class="hggs-label" for="radio2">Option 2</label>
  </div>
</div>
```
